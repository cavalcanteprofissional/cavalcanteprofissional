#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
 assinar_pdf_visivel.py — Re-assinatura PAdES visível do currículo
 Repositório: cavalcanteprofissional/cavalcanteprofissional
================================================================================

Remove qualquer assinatura anterior do PDF (preservando texto e metadados) e
aplica nova assinatura PAdES com imagem da rubrica no canto inferior direito
da página 2 — caixa [439, 40, 555, 130] ≈ 4,1 × 3,2 cm, margem ~1,4 cm.

Contexto de renovação: o certificado atual (.p12) expira em 22/08/2031 —
gerar novo .p12 (mesmo CNPJ/identidade) e rodar este script para renovar a
assinatura, seguido da cascata de reancoragem documentada em
seguranca/PROVENANCE.md (novo .asc → manifesto → GPG → OpenTimestamps).

Segredos: este script NÃO contém senhas. A senha do .p12 é resolvida na ordem:
  1. variável de ambiente P12_PASSWORD
  2. arquivo indicado em --senha-arquivo (padrão:
     %USERPROFILE%\\certificados\\senha-cert-lucas.txt)
  3. prompt interativo (getpass)

Uso:

    python scripts/assinar_pdf_visivel.py --saida caminho/para/saida.pdf
    python scripts/assinar_pdf_visivel.py --p12 outro.p12 --saida out.pdf

O arquivo original do repositório NUNCA é modificado: a saída vai sempre para
--saida (nunca sobrescreva curriculo/cv_br_lucas_cavalcante.pdf diretamente;
siga a cascata de reancoragem).

Requisitos: Python 3.10+ e
    pip install cryptography pypdf pillow endesive
Código de saída: 0 = assinado e validado; 1 = falha em alguma verificação.
================================================================================
"""

import argparse
import getpass
import io
import os
import re
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

for _stream in (sys.stdout, sys.stderr):
    if hasattr(_stream, "reconfigure"):
        _stream.reconfigure(encoding="utf-8", errors="replace")

REPO_ROOT = Path(__file__).resolve().parent.parent

PDF_PADRAO = REPO_ROOT / "curriculo" / "cv_br_lucas_cavalcante.pdf"
PNG_PADRAO = REPO_ROOT / "assinaturas" / "ASSINATURA-LUCAS-CAVALCANTE-DOS-SANTOS.png"
P12_PADRAO = Path.home() / "certificados" / "lucas-signing.p12"
SENHA_ARQ_PADRAO = Path.home() / "certificados" / "senha-cert-lucas.txt"

FINGERPRINT_ATUAL = "F3:5A:F2:3F:DF:2F:2C:CD:A2:E7:0F:E9:98:E9:95:1E:6B:E1:18:C6:27:A4:06:18:5D:2C:48:2C:C3:D8:5B:46"

CAIXA = (439, 40, 555, 130)


def resolver_senha(p12_path: Path, senha_arquivo: Path) -> bytes:
    env = os.environ.get("P12_PASSWORD")
    if env:
        print("senha: obtida da variável de ambiente P12_PASSWORD")
        return env.encode()
    if senha_arquivo.exists():
        linhas = [
            l.strip()
            for l in senha_arquivo.read_text(encoding="utf-8").splitlines()
            if re.fullmatch(r"[\x21-\x7e]{16,}", l.strip())
        ]
        if len(linhas) == 1:
            print(f"senha: linha única candidata em {senha_arquivo}")
            return linhas[0].encode()
        print(f"⚠ {senha_arquivo} não tem linha-senha inequívoca "
              f"({len(linhas)} candidatas); use P12_PASSWORD ou getpass")
    return getpass.getpass(f"senha do {p12_path.name}: ").encode()


def extrair_texto(path: Path) -> str:
    from pypdf import PdfReader

    return "\n".join(p.extract_text() or "" for p in PdfReader(path).pages)


def strip_assinatura(pdf_in: Path, tmp_unsigned: Path) -> None:
    """Remove widgets de assinatura (/FT == /Sig) preservando páginas/metadados."""
    from pypdf import PdfReader, PdfWriter
    from pypdf.generic import ArrayObject, NameObject

    r = PdfReader(pdf_in)
    w = PdfWriter()
    for p in r.pages:
        if "/Annots" in p:
            mantidas = [
                a for a in p["/Annots"] if a.get_object().get("/FT") != "/Sig"
            ]
            removidos = len(p["/Annots"]) - len(mantidas)
            if removidos:
                print(f"widgets de assinatura removidos da página: {removidos}")
                p[NameObject("/Annots")] = ArrayObject(mantidas)
        w.add_page(p)
    if r.metadata:
        w.add_metadata({k: v for k, v in r.metadata.items()})
    with open(tmp_unsigned, "wb") as f:
        w.write(f)

    residuo = len(re.findall(rb"/ByteRange", tmp_unsigned.read_bytes()))
    assert residuo == 0, f"strip deixou resíduo de assinatura ({residuo} ByteRange)!"
    print("strip sem resíduos de ByteRange: OK")


def validar_saida(saida: Path, texto_original: str) -> bool:
    from cryptography.hazmat.primitives import hashes  # noqa: F401
    from pypdf import PdfReader
    import endesive.pdf

    ok = True
    rr = PdfReader(saida)
    campos_sig = []
    for fld in rr.trailer["/Root"]["/AcroForm"].get_object()["/Fields"]:
        fo = fld.get_object()
        if fo.get("/FT") == "/Sig":
            campos_sig.append(fo)
            rect = [float(x) for x in fo["/Rect"]]
            ap_ok = fo.get("/AP") is not None
            print(f"campo {fo.get('/T')} | Rect: {rect} | AP: {ap_ok}")
            if list(map(float, CAIXA)) != rect:
                print(f"✗ Rect difere da caixa aprovada {list(CAIXA)}")
                ok = False
            if not ap_ok:
                print("✗ campo sem aparência visual (/AP)")
                ok = False
    if len(campos_sig) != 1:
        print(f"✗ esperado exatamente 1 campo de assinatura, há {len(campos_sig)}")
        ok = False

    br = len(re.findall(rb"/ByteRange", saida.read_bytes()))
    print(f"ByteRange no arquivo final: {br}")
    if br != 1:
        print("✗ esperado exatamente 1 ByteRange")
        ok = False

    if extrair_texto(saida) != texto_original:
        print("✗ texto alterado pela assinatura!")
        ok = False
    else:
        print("texto idêntico ao original: OK")

    with open(saida, "rb") as f:
        for v in endesive.pdf.verify(f.read()):
            hashok, sigok = bool(v[0]), bool(v[1])
            certok = bool(v[2]) if len(v) > 2 else None
            print("verify -> hash:", hashok, "| assinatura:", sigok,
                  "| cadeia de certs:", certok,
                  "(False é esperado para certificado autoassinado)")
            if not (hashok and sigok):
                ok = False
    return ok


def main() -> int:
    ap = argparse.ArgumentParser(description="Re-assinatura PAdES visível do currículo.")
    ap.add_argument("--pdf-in", type=Path, default=PDF_PADRAO, help="PDF de entrada")
    ap.add_argument("--png", type=Path, default=PNG_PADRAO, help="imagem da rubrica")
    ap.add_argument("--p12", type=Path, default=P12_PADRAO, help="certificado PKCS#12")
    ap.add_argument("--senha-arquivo", type=Path, default=SENHA_ARQ_PADRAO,
                    help="arquivo de texto com a senha do .p12")
    ap.add_argument("--pagina", type=int, default=1,
                    help="índice 0-based da página da assinatura (padrão: 1 = pág. 2)")
    ap.add_argument("--saida", type=Path, required=True, help="PDF assinado de saída")
    args = ap.parse_args()

    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.serialization import pkcs12
    from PIL import Image as PILImage
    import endesive.pdf

    senha = resolver_senha(args.p12, args.senha_arquivo)
    with open(args.p12, "rb") as f:
        key, cert, _ = pkcs12.load_key_and_certificates(f.read(), senha)
    fp = cert.fingerprint(hashes.SHA256()).hex(":").upper()
    print("fingerprint SHA-256 do certificado:", fp)
    if fp != FINGERPRINT_ATUAL:
        print("(diferente do atual — normal após renovação do .p12)")

    img = PILImage.open(args.png)
    print("rubrica:", args.png.name, img.size)

    with tempfile.TemporaryDirectory(prefix="assinar_visivel_") as td:
        tmp_unsigned = Path(td) / "unsigned.pdf"

        texto_original = extrair_texto(args.pdf_in)
        strip_assinatura(args.pdf_in, tmp_unsigned)

        udct = {
            "aligned": 0,
            "sigflags": 3,
            "sigpage": args.pagina,
            "signaturebox": CAIXA,
            "signature_img": str(args.png),
            "signature_img_distort": False,
            "signature_img_centred": True,
            "contact": "cavalcanteprofissional@outlook.com",
            "location": "Brasil",
            "reason": "Autoria e integridade do curriculo - Lucas Cavalcante dos Santos",
            "signingdate": datetime.now(timezone.utc).strftime("D:%Y%m%d%H%M%S+00'00'"),
        }

        datau = tmp_unsigned.read_bytes()
        datas = endesive.pdf.cms.sign(datau, udct, key, cert, [], "sha256")
        args.saida.write_bytes(datau + datas)
        print(f"assinado: {args.saida} ({len(datas)} bytes de PKCS#7)")

        ok = validar_saida(args.saida, texto_original)

    print("RESULTADO:", "✅ PDF assinado e validado" if ok else "❌ falhas detectadas")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
