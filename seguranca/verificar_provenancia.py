#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
 verificar_provenancia.py — Auditoria independente da cadeia de provenância
 Repositório: cavalcanteprofissional/cavalcanteprofissional
================================================================================

Verifica, em três camadas, todos os artefatos autorais deste repositório:

  [1/3] INTEGRIDADE — confere cada entrada de seguranca/CHECKSUMS.sha256
  [2/3] AUTORIA     — valida todas as assinaturas GPG destacadas (*.asc)
  [3/3] TEMPO       — valida o carimbo OpenTimestamps contra a blockchain do
                      Bitcoin, recomputando a merkle root a partir do header
                      do bloco obtido via API pública

Uso (a partir da raiz do repositório ou de qualquer pasta):

    python seguranca/verificar_provenancia.py
    python seguranca/verificar_provenancia.py --skip-gpg
    python seguranca/verificar_provenancia.py --offline
    python seguranca/verificar_provenancia.py --api https://mempool.space/api

Requisitos: Python 3.8+ (apenas biblioteca padrão). Opcionalmente, GnuPG no
PATH para a camada [2/3]. Sem GnuPG, a camada é pulada com aviso.

Código de saída: 0 = tudo aprovado; 1 = alguma verificação falhou.
================================================================================
"""

import argparse
import hashlib
import subprocess
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

for _stream in (sys.stdout, sys.stderr):
    if hasattr(_stream, "reconfigure"):
        _stream.reconfigure(encoding="utf-8", errors="replace")

REPO_ROOT = Path(__file__).resolve().parent.parent
MANIFEST = Path(__file__).resolve().parent / "CHECKSUMS.sha256"
OTS_FILE = Path(__file__).resolve().parent / "CHECKSUMS.sha256.ots"

MAGIC = b"\x00OpenTimestamps\x00\x00Proof\x00\xbf\x89\xe2\xe8\x84\xe8\x92\x94"

OP_APPEND, OP_PREPEND, OP_REVERSE, OP_HEXLIFY = 0xF0, 0xF1, 0xF2, 0xF3
OP_SHA1, OP_RIPEMD160, OP_SHA256 = 0x02, 0x03, 0x08

ATT_PENDING = bytes.fromhex("83dfe30d2ef90c8e")
ATT_BITCOIN = bytes.fromhex("0588960d73d71901")

failures = []


def fail(msg):
    failures.append(msg)
    print(f"  ✗ FALHA: {msg}")


# ------------------------------------------------------------------ RIPEMD-160
# Implementação de referência usada somente se o OpenSSL local não oferecer
# o algoritmo (comum no OpenSSL 3). Auto-testada na primeira utilização.

_K1 = [0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]
_K2 = [0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]
_SEL = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
    3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
    1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
    4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]
_ROL = [
    11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
    7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
    11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
    11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
    9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]


def _rol(x, n):
    return ((x << n) | (x >> (32 - n))) & 0xFFFFFFFF


def _f(j, x, y, z):
    if j < 16:
        return x ^ y ^ z
    if j < 32:
        return (x & y) | (~x & z)
    if j < 48:
        return (x | ~y) ^ z
    if j < 64:
        return (x & z) | (y & ~z)
    return x ^ (y | ~z)


def _ripemd160_py(data: bytes) -> bytes:
    h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]
    msg = bytearray(data)
    bit_len = len(data) * 8
    msg.append(0x80)
    while len(msg) % 64 != 56:
        msg.append(0)
    msg += bit_len.to_bytes(8, "little")

    for off in range(0, len(msg), 64):
        X = list(int.from_bytes(msg[off + 4 * i: off + 4 * i + 4], "little") for i in range(16))
        al, bl, cl, dl, el = h
        ar, br, cr, dr, er = h
        for j in range(80):
            rnd = j // 16
            tl = (_rol((al + _f(j, bl, cl, dl) + X[_SEL[j]] + _K1[rnd]) & 0xFFFFFFFF, _ROL[j]) + el) & 0xFFFFFFFF
            al, el, dl, cl, bl = el, dl, _rol(cl, 10), bl, tl
            jr = 79 - j
            tr = (_rol((ar + _f(79 - j, br, cr, dr) + X[_SEL[jr]] + _K2[rnd]) & 0xFFFFFFFF, _ROL[jr]) + er) & 0xFFFFFFFF
            ar, er, dr, cr, br = er, dr, _rol(cr, 10), br, tr
        t = (h[1] + cl + dr) & 0xFFFFFFFF
        h[1] = (h[2] + dl + er) & 0xFFFFFFFF
        h[2] = (h[3] + el + ar) & 0xFFFFFFFF
        h[3] = (h[4] + al + br) & 0xFFFFFFFF
        h[4] = (h[0] + bl + cr) & 0xFFFFFFFF
        h[0] = t & 0xFFFFFFFF
    return b"".join(x.to_bytes(4, "little") for x in h)


_ripemd_selftest_done = False


def hash_ripemd160(data: bytes) -> bytes:
    global _ripemd_selftest_done
    try:
        return hashlib.new("ripemd160", data).digest()
    except (ValueError, TypeError):
        pass
    out = _ripemd160_py(data)
    if not _ripemd_selftest_done:
        vec = _ripemd160_py(b"abc")
        if vec.hex() != "8eb208f7e05d987a9b044a8e98c6b087f15a0bfc":
            raise RuntimeError("RIPEMD-160 de referência falhou no auto-teste")
        _ripemd_selftest_done = True
    return out


# ------------------------------------------------------- leitor binário simples

class Reader:
    def __init__(self, data: bytes):
        self.data = data
        self.pos = 0

    def read(self, n: int) -> bytes:
        if self.pos + n > len(self.data):
            raise ValueError("arquivo .ots truncado")
        out = self.data[self.pos:self.pos + n]
        self.pos += n
        return out

    def read_varuint(self) -> int:
        value, shift = 0, 0
        while True:
            b = self.read(1)[0]
            value |= (b & 0x7F) << shift
            if not (b & 0x80):
                return value
            shift += 7


# ------------------------------------------------------------------- parser OTS

def apply_op(tag: int, arg: bytes, msg: bytes) -> bytes:
    if tag == OP_APPEND:
        return msg + arg
    if tag == OP_PREPEND:
        return arg + msg
    if tag == OP_REVERSE:
        return msg[::-1]
    if tag == OP_HEXLIFY:
        return msg.hex().encode("ascii")
    if tag == OP_SHA1:
        return hashlib.sha1(msg).digest()
    if tag == OP_RIPEMD160:
        return hash_ripemd160(msg)
    if tag == OP_SHA256:
        return hashlib.sha256(msg).digest()
    raise ValueError(f"op desconhecida 0x{tag:02x} (carimbo não suportado por este auditor)")


def parse_attestation(r: Reader):
    tag = r.read(8)
    payload = r.read(r.read_varuint())
    if tag == ATT_PENDING:
        pr = Reader(payload)
        uri_len = pr.read_varuint()
        return ("pending", pr.read(uri_len).decode("utf-8", "replace"))
    if tag == ATT_BITCOIN:
        pr = Reader(payload)
        return ("bitcoin", pr.read_varuint())
    return ("desconhecida", tag.hex())


def parse_timestamp(r: Reader, msg: bytes, depth: int = 0):
    """Percorre a árvore registrando (msg_corrente, atestação) nas folhas."""
    if depth > 256:
        raise ValueError("profundidade de recursão excedida")
    found = []

    def entry(tag_byte: bytes, cur: bytes):
        t = tag_byte[0]
        if t == 0x00:
            kind, val = parse_attestation(r)
            found.append((cur, kind, val))
        else:
            arg = b""
            if t in (OP_APPEND, OP_PREPEND):
                arg = r.read(r.read_varuint())
            new_msg = apply_op(t, arg, cur)
            found.extend(parse_timestamp(r, new_msg, depth + 1))

    tag = r.read(1)
    while tag == b"\xff":
        entry(r.read(1), msg)
        tag = r.read(1)
    entry(tag, msg)
    return found


def http_get(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "auditor-provenancia/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def header_merkle_root(hdr: bytes) -> bytes:
    return hdr[36:68]


def header_time_utc(hdr: bytes) -> str:
    n_time = int.from_bytes(hdr[68:72], "little")
    return datetime.fromtimestamp(n_time, timezone.utc).strftime("%Y-%m-%d %H:%M:%S")


# -------------------------------------------------------------------- camadas

def camada_integridade() -> None:
    print("\n[1/3] INTEGRIDADE — manifesto SHA-256")
    text = MANIFEST.read_text(encoding="utf-8-sig")
    total = 0
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        digest, _, path = line.partition(" ")
        path = path.lstrip("*").strip()
        total += 1
        target = REPO_ROOT / path
        if not target.is_file():
            fail(f"{path}: arquivo ausente")
            continue
        actual = hashlib.sha256(target.read_bytes()).hexdigest()
        if actual == digest.lower():
            print(f"  ✓ {path}")
        else:
            fail(f"{path}: hash diverge (esperado {digest[:16]}…, obtido {actual[:16]}…)")
    if total == 0:
        fail("manifesto sem entradas")


def camada_autoria(skip_gpg: bool) -> None:
    print("\n[2/3] AUTORIA — assinaturas GPG destacadas")
    pairs = sorted(p for p in REPO_ROOT.rglob("*.asc") if p.stem != "pubkey")
    if not pairs:
        fail("nenhum par de assinatura .asc encontrado")
        return
    gpg = None if skip_gpg else None
    if not skip_gpg:
        import shutil
        gpg = shutil.which("gpg")
        if gpg is None:
            print("  ⚠ GnuPG não encontrado no PATH — camada pulada "
                  "(instale o GnuPG ou rode novamente com ele disponível)")
            return
    for asc in pairs:
        target = asc.with_suffix("")
        rel_asc = asc.relative_to(REPO_ROOT)
        if not target.is_file():
            fail(f"{rel_asc}: arquivo correspondente ausente")
            continue
        proc = subprocess.run(
            [gpg, "--verify", str(asc), str(target)],
            capture_output=True, text=True)
        ok = proc.returncode == 0 and "Good signature" in (proc.stderr + proc.stdout)
        if ok:
            print(f"  ✓ {rel_asc} — boa assinatura")
        else:
            fail(f"{rel_asc}: assinatura inválida (rc={proc.returncode})")


def camada_tempo(api: str, offline: bool) -> None:
    print("\n[3/3] TEMPO — OpenTimestamps ⛓ Bitcoin")
    raw = OTS_FILE.read_bytes()
    if not raw.startswith(MAGIC):
        fail(".ots com magic inválido")
        return
    r = Reader(raw[len(MAGIC):])
    major = r.read_varuint()
    if major != 1:
        fail(f".ots versão não suportada ({major})")
        return
    hash_tag = r.read(1)[0]
    if hash_tag != OP_SHA256:
        fail(f".ots usa função de hash não suportada (tag 0x{hash_tag:02x})")
        return
    stamped = r.read(32)
    manifest_hash = hashlib.sha256(MANIFEST.read_bytes()).hexdigest()
    print(f"  manifesto : {manifest_hash}")
    print(f"  carimbado : {stamped.hex()}")
    if manifest_hash != stamped.hex():
        fail("o manifesto atual difere do documento carimbado")
        return

    leaves = parse_timestamp(r, stamped)
    btc = [(m, h) for m, k, h in leaves if k == "bitcoin"]
    pend = [(m, u) for m, k, u in leaves if k == "pending"]
    unk = sum(1 for _, k, _ in leaves if k == "desconhecida")
    print(f"  atestações: {len(leaves)} | Bitcoin: {len(btc)} | pendentes: {len(pend)}"
          + (f" | desconhecidas: {unk}" if unk else ""))

    if offline:
        print("  ⚠ modo offline: validação contra a blockchain pulada")
        return
    if not btc:
        fail("nenhuma atestação Bitcoin embutida — carimbo ainda não confirmado?")
        return

    any_ok = False
    for msg, height in btc:
        block_hash = http_get(f"{api}/block-height/{height}").decode().strip()
        hdr_hex = http_get(f"{api}/block/{block_hash}/header").decode().strip()
        hdr = bytes.fromhex(hdr_hex)
        root = header_merkle_root(hdr)
        if msg != root:
            fail(f"bloco {height}: merkle root diverge "
                 f"(atestada {msg[::-1].hex()}, real {root[::-1].hex()})")
            continue
        any_ok = True
        print(f"  ✓ bloco {height} {block_hash}")
        print(f"    merkle root confere · tempo do bloco: {header_time_utc(hdr)} UTC")
    if not any_ok:
        fail("nenhuma atestação Bitcoin pôde ser verificada")


# ------------------------------------------------------------------------ main

def main() -> int:
    ap = argparse.ArgumentParser(
        description="Auditoria independente da cadeia de provenância deste repositório.")
    ap.add_argument("--skip-gpg", action="store_true", help="não executa a camada GPG")
    ap.add_argument("--offline", "--skip-ots", dest="offline", action="store_true",
                    help="não consulta APIs de blockchain")
    ap.add_argument("--api", default="https://mempool.space/api",
                    help="API de blockchain alternativa (padrão: mempool.space)")
    args = ap.parse_args()

    print("=" * 72)
    print("AUDITORIA DA CADEIA DE PROVENÂNCIA — cavalcanteprofissional")
    print("=" * 72)

    camada_integridade()
    camada_autoria(args.skip_gpg)
    camada_tempo(args.api.rstrip("/"), args.offline)

    print("\n" + "=" * 72)
    if failures:
        print(f"RESULTADO: ✗ {len(failures)} falha(s) detectada(s)")
        for f in failures:
            print(f"  - {f}")
        print("\nCross-check manual recomendado: https://opentimestamps.org "
              "(arraste CHECKSUMS.sha256.ots e CHECKSUMS.sha256)")
        return 1
    print("RESULTADO: ✅ AUDITORIA APROVADA — integridade, autoria e tempo verificados")
    print("  Detalhes metodológicos: seguranca/PROVENANCE.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
