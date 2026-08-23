# 🔐 Proveniência e Prova de Autoria

Este repositório documenta a **cadeia completa de prova digital** da autoria dos arquivos
`ASSINATURA-LUCAS-CAVALCANTE-DOS-SANTOS.png`, `ASSINATURA-LUCAS-CAVALCANTE-DOS-SANTOS-NEGATIVA.png`
e `cv_br_lucas_cavalcante.pdf`, produzidos por **Lucas Cavalcante dos Santos**.

- **Origem das imagens:** obra autoral original criada em **Adobe Photoshop**
- **Registro:** 22/08/2026 (Fortaleza, Ceará, Brasil)

---

## Camadas de prova

| # | Camada | Arquivo(s) | O que comprova |
|---|--------|-----------|----------------|
| 1 | Metadados embutidos | os 2 PNGs + PDF | Identificação do autor, copyright e origem (Photoshop) |
| 2 | Assinatura PAdES embutida | `cv_br_lucas_cavalcante.pdf` | Integridade desde a assinatura — validável no Adobe Acrobat sem arquivos extras |
| 3 | Assinatura GPG destacada | `*.asc` | Autoria criptográfica ligada à chave abaixo |
| 4 | Carimbo de tempo Bitcoin | `CHECKSUMS.sha256.ots` | Existência dos arquivos na data registrada, independente deste repositório |

---

## 1) Verificação por hash (integridade)

Baixe os arquivos em versão **raw** (`raw.githubusercontent.com/cavalcanteprofissional/cavalcanteprofissional/main/...`)
e compare com o manifesto:

```bash
sha256sum -c CHECKSUMS.sha256          # Linux/macOS/Git Bash
certutil -hashfile ARQUIVO SHA256      # Windows (comparar manualmente)
```

Hashes registrados em 2026-08-22:

```
c2ca1c7ac3f9652fc6a6e2107072a669bec9eebfc98171c201f59f716008a0b4  ASSINATURA-LUCAS-CAVALCANTE-DOS-SANTOS.png
1c146e1d435f9d361f2b26143af2f82036c2b0b0d913823f5b325fe7fa92402e  ASSINATURA-LUCAS-CAVALCANTE-DOS-SANTOS-NEGATIVA.png
6b3b45eda92d86db7de09b6beea0e6fafeefd10e841b56f6912945ba880afaee  cv_br_lucas_cavalcante.pdf
```

## 2) Assinatura GPG

**Fingerprint da chave (ed25519):**

```
880A 68E4 D53E 4345 ECA9  F229 2ED9 BC95 BC87 46A1
Lucas Cavalcante dos Santos <cavalcanteprofissional@outlook.com>
Válida até: 2028-08-22 · Chave pública: pubkey.asc neste repositório
```

> ⚠️ Para confiança máxima, confirme o fingerprint por um canal fora deste repositório
> (LinkedIn, WhatsApp ou contato direto com o autor).

```bash
gpg --import pubkey.asc
gpg --verify CHECKSUMS.sha256.asc CHECKSUMS.sha256   # valida o manifesto inteiro
gpg --verify cv_br_lucas_cavalcante.pdf.asc cv_br_lucas_cavalcante.pdf
gpg --verify ASSINATURA-LUCAS-CAVALCANTE-DOS-SANTOS.png.asc ASSINATURA-LUCAS-CAVALCANTE-DOS-SANTOS.png
```

## 3) Assinatura PAdES embutida no PDF

O currículo possui assinatura digital invisível no padrão PAdES/CMS.
Abra o PDF no **Adobe Acrobat Reader → painel de Assinaturas**: mostrará que o documento
não foi alterado desde a assinatura.

**Certificado autoassinado do autor — fingerprint SHA-256:**

```
F3:5A:F2:3F:DF:2F:2C:CD:A2:E7:0F:E9:98:E9:95:1E:6B:E1:18:C6:27:A4:06:18:5D:2C:48:2C:C3:D8:5B:46
CN = Lucas Cavalcante dos Santos
```

Como o certificado é autoassinado (sem autoridade certificadora paga), o Acrobat exibirá
"validade desconhecida". Para validar: **Assinaturas → Validar assinatura → Adicionar à
identidades confiáveis**, conferindo o fingerprint acima. A prova técnica da autoria não
depende dessa etapa — as camadas GPG e OpenTimestamps são independentes.

## 4) OpenTimestamps (âncora no blockchain do Bitcoin)

`CHECKSUMS.sha256.ots` carimba o manifesto completo, provando que os três hashes existiam
na data do registro — verificação **independente deste repositório e do GitHub**:

```bash
# instalar: pip install opentimestamps-client
ots verify CHECKSUMS.sha256.ots -f CHECKSUMS.sha256
```

> Status atual: **confirmado no Bitcoin** (2026-08-23) — prova completa embutida no `.ots`
> via `ots upgrade`. Primeira âncora: bloco **963665**
> (`0000000000000000000113d1aeefed9b151990e2aae325fef96e6534bfb22d59`, 2026-08-23 03:15:42 UTC),
> com atestações redundantes confirmadas também nos blocos 963667, 963680 e 963688.
> Verificação online alternativa: https://opentimestamps.org

---

## Cadeia de custódia no Git

Todo o histórico deste repositório está preservado no Git (commits assinados a partir de
22/08/2026). As versões anteriores dos arquivos continuam acessíveis pelos commits,
constituindo registro cronológico adicional.
