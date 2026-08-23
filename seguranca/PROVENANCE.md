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
e compare com o manifesto — **executando da raiz do repositório**:

```bash
sha256sum -c seguranca/CHECKSUMS.sha256   # Linux/macOS/Git Bash
certutil -hashfile ARQUIVO SHA256         # Windows (comparar manualmente)
```

Assinaturas PNG registradas em 2026-08-22; currículo re-assinado em 23/08/2026
com assinatura PAdES **visível** (o hash anterior permanece no histórico Git):

```
c2ca1c7ac3f9652fc6a6e2107072a669bec9eebfc98171c201f59f716008a0b4  assinaturas/ASSINATURA-LUCAS-CAVALCANTE-DOS-SANTOS.png
1c146e1d435f9d361f2b26143af2f82036c2b0b0d913823f5b325fe7fa92402e  assinaturas/ASSINATURA-LUCAS-CAVALCANTE-DOS-SANTOS-NEGATIVA.png
c0711ae967aaa4562a3d1331f9191fca446ede94ef71ac9975ad7190aa6e084e  curriculo/cv_br_lucas_cavalcante.pdf
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
gpg --import seguranca/pubkey.asc
gpg --verify seguranca/CHECKSUMS.sha256.asc seguranca/CHECKSUMS.sha256   # valida o manifesto inteiro
gpg --verify curriculo/cv_br_lucas_cavalcante.pdf.asc curriculo/cv_br_lucas_cavalcante.pdf
gpg --verify assinaturas/ASSINATURA-LUCAS-CAVALCANTE-DOS-SANTOS.png.asc assinaturas/ASSINATURA-LUCAS-CAVALCANTE-DOS-SANTOS.png
gpg --verify assinaturas/ASSINATURA-LUCAS-CAVALCANTE-DOS-SANTOS-NEGATIVA.png.asc assinaturas/ASSINATURA-LUCAS-CAVALCANTE-DOS-SANTOS-NEGATIVA.png
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

> **Geração 1 (histórica):** manifesto na raiz do repositório, carimbado em 22/08/2026 e
> confirmado no Bitcoin em 23/08/2026 — primeira âncora: bloco **963665**
> (`0000000000000000000113d1aeefed9b151990e2aae325fef96e6534bfb22d59`, 03:15:42 UTC),
> com atestações redundantes nos blocos 963667, 963680 e 963688. Essa prova permanece
> verificável pelo histórico Git (commits 7c9fe13 → 2980f9d).
>
> **Geração 2 (histórica):** manifesto reformatado com caminhos por pasta durante a
> reorganização de 23/08/2026 — mesmos hashes de conteúdo, carimbo confirmado no
> Bitcoin: bloco **963750**
> (`00000000000000000000ea92f45c70b4100ceb15aa98de1f5129c6da951fc7a3`, 17:16:04 UTC),
> transação `5eeabeb1aecadb874bdfb9682749b0c3a5f2460abf937cce450ab3f54e8780fa`.
> Preservada no histórico Git (commits aa29ee5 → 490577e).
>
> **Geração 3 (substituída):** primeira versão do currículo com assinatura
> visível, carimbada às 19:34 UTC de 23/08/2026 e substituída minutos depois,
> antes da confirmação, por correção de layout (retângulo da assinatura com
> coordenadas inválidas). Prova preservada no histórico Git (commit 41271a0).
>
> **Geração 4 (atual):** currículo com assinatura PAdES visível corrigida —
> novo hash do PDF, manifesto atualizado e re-assinado, carimbo em
> `seguranca/CHECKSUMS.sha256.ots` (submetido aos calendários às 19:40 UTC).
> Status: *pendente de confirmação no Bitcoin* — atualizar esta linha após `ots upgrade`.
> Verificação online alternativa: https://opentimestamps.org

---

## 5) Auditoria automatizada (script independente)

O repositório inclui um verificador que reproduz toda a cadeia de prova em um
comando — sem instalar nada além do Python 3.8+ (**somente biblioteca padrão**):

```bash
python seguranca/verificar_provenancia.py             # auditoria completa
python seguranca/verificar_provenancia.py --offline   # valida sem rede
python seguranca/verificar_provenancia.py --skip-gpg  # máquina sem GnuPG
```

Camadas validadas: **integridade** (cada entrada do manifesto), **autoria**
(todas as assinaturas GPG destacadas, se houver GnuPG disponível) e **tempo**
(o script parseia o `.ots` nativamente, extrai a atestação Bitcoin, baixa o
header do bloco citado de uma API pública — por padrão `mempool.space`,
trocável via `--api` — e recomputa a merkle root para comparar).

> **Nota sobre o próprio script:** trata-se de ferramenta de auditoria e não
> entra no manifesto assinado. Sua integridade fica garantida pelos commits
> assinados do Git (selo *Verified*) e pelo código aberto — qualquer pessoa
> pode revisar suas ~400 linhas antes de executar.

> Alternativa gráfica sem linha de comando: arraste `CHECKSUMS.sha256.ots` +
> `CHECKSUMS.sha256` em https://opentimestamps.org

## Cadeia de custódia no Git

Todo o histórico deste repositório está preservado no Git (commits assinados a partir de
22/08/2026). As versões anteriores dos arquivos continuam acessíveis pelos commits,
constituindo registro cronológico adicional.

**Reorganização de 23/08/2026:** os artefatos foram movidos para pastas temáticas
(`assinaturas/`, `curriculo/`, `seguranca/`, `assets/`) via `git mv` — os **bytes dos
arquivos assinados/carimbados não sofreram alteração** (hashes idênticos antes e depois),
de modo que todas as assinaturas destacadas e a âncora Geração 1 permanecem válidas sobre
o conteúdo. Apenas o manifesto foi reformatado (caminhos relativos), exigindo nova
assinatura GPG e novo carimbo (Geração 2).

**Re-assinatura do currículo (23/08/2026):** o PDF ganhou assinatura PAdES **visível** —
a imagem da assinatura manuscrita foi estampada no canto inferior direito da página 2
(caixa de 116×90 pt, margens de ~1,4 cm). Na primeira tentativa o retângulo da
assinatura saiu com coordenadas inválidas e a imagem aparecia cortada; o artefato foi
substituído no mesmo dia (Geração 3 → Geração 4), com remoção completa dos resíduos da
assinatura antiga antes da nova aplicação. O arquivo anterior permanece acessível pelo
histórico Git; o certificado é o mesmo (fingerprint §3 inalterado), verificado
localmente: hash íntegro, texto idêntico ao original e metadados preservados.
