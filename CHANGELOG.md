# Changelog

Todas as mudanças notáveis deste repositório serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.6.0] - 2026-09-04

### Added
- **Assinatura de commits verificada (GPG)** — configuração **global** para que
  todo commit seja assinado e exibido como *Verified* no GitHub, em qualquer
  repositório da máquina.
- Seção `## 🔏 Assinatura de Commits Verificada (GPG)` no README.md com o plano
  por sistema operacional — Windows, Linux, **WSL** e macOS — sem expor dados
  sensíveis (placeholders para chave, e-mail e usuário).
- Este arquivo `CHANGELOG.md` com versionamento semântico do repositório.

### Changed
- Windows (Git for Windows): `commit.gpgsign`, `user.signingkey`, `tag.gpgsign`
  e `gpg.program` promovidos de escopo **local** (apenas este repositório) para
  escopo **global** (`git config --global`), cobrindo todos os repositórios.
- WSL (`/home/cavalcante`): criado `~/.gitconfig` com a mesma identidade e
  assinatura ativa; chave GPG (pública e secreta) importada no gpg nativo do WSL.
- Removido arquivo temporário contendo a chave secreta exportada após a
  importação no WSL (higiene de segurança).

### Fixed
- Repositórios criados sob outro SID (`AdsorbFit_Spec`, `ERP`) deixaram de
  bloquear o Git com "dubious ownership" via `safe.directory` global.

## [1.5.0] - 2026-08-24

### Added
- Seção "Minha Trajetória" redesenhada: diagrama **Mermaid** de faixas temporais
  paralelas (Experiência | Formação) com arestas tracejadas para conversas entre
  sistemas coexistentes, legenda "📖 Como ler" e bloco "🧵 Fio condutor".

### Changed
- Substituído bloco hierárquico mermaid por **faixas paralelas** com
  tempo esquerda→direita.
- Correções factuais: Téc. Jogos 2011–13; C. Sociais UFC 2019–21 trancado;
  Téc. Marketing iniciado em 2026 (em curso).
- Auditoria de consistência do flowchart: selos unificados, critério da seta
  grossa corrigido e conversas faltantes adicionadas.

## [1.4.0] - 2026-08-23

### Added
- CI de auditoria de proveniência (`auditoria.yml`): executa em push/PR, aos
  domingos 09:23 UTC e manualmente; importa `pubkey.asc` e roda a auditoria
  completa (fallback blockstream.info).
- Badges no README: proveniência (GPG | PAdES | Bitcoin) e status do CI.
- Cartão de compartilhamento social (`social-preview-card.png`).
- Diretório `scripts/` com ferramentas de renovação (alerta por e-mail) e
  re-assinatura PAdES visível.

### Changed
- Auditoria movida para `scripts/verificar_provenancia.py`.
- Remetente do alerta trocado para Gmail pessoal (Workspace edu sem Senha de App).
- Corrigida camada GPG ao usar `--skip-gpg`.

## [1.3.0] - 2026-08-23

### Added
- `scripts/verificar_provenancia.py` — auditoria independente em Python stdlib.
- Assinatura **PAdES visível** no currículo (PNG no canto inferior direito da
  página 2), com reancoragem da cadeia (Geração 3 e 4).
- `scripts/assinar_pdf_visivel.py` e `scripts/avisar_renovacao.py`.

### Fixed
- Retângulo inválido da assinatura visível que cortava a imagem (correção de
  layout e remoção de widget órfão).

## [1.2.0] - 2026-08-23

### Changed
- Reorganização do repositório em pastas temáticas (`assinaturas/`,
  `curriculo/`, `seguranca/`, `assets/`) com `git mv` (preserva histórico).
- Novo manifesto `CHECKSUMS.sha256` com caminhos relativos à raiz e
  reancoragem da cadeia (Geração 2).

### Added
- `TODO.md` adicionado ao `.gitignore`.

## [1.1.0] - 2026-08-23

### Added
- **Cadeia de proveniência criptográfica** das obras e currículo: hashes
  SHA-256, assinatura GPG ed25519 e carimbo de tempo OpenTimestamps ancorado em
  blocos Bitcoin (Geração 1).
- `seguranca/PROVENANCE.md` com a documentação da metodologia e `pubkey.asc`.

## [1.0.0] - 2026-08-22

### Added
- Reorganização do cabeçalho com assinatura reduzida, currículo em PDF e
  reescrita da seção "Sobre Mim".
- Foto de perfil versionada no repositório.

## [0.2.0] - 2026-07-26

### Added
- README com diagrama **Mermaid**, seções de tecnologias e assinatura com
  suporte a dark/light mode.
- Gráfico de atividade de contribuição (substituindo GitHub Stats).

### Changed
- Refinamento da seção "Sobre Mim" com informações do currículo.
- Reorganização do topo com assinatura reduzida e tags empilhadas.

## [0.1.0] - 2026-04-21

### Added
- Commit inicial com README e detalhes pessoais e técnicos.
- Componente TechStack com ícones e empresa Iselétrica.

### Removed
- Diretórios `src/` e `public/`.

[1.6.0]: https://github.com/cavalcanteprofissional/cavalcanteprofissional/releases/tag/v1.6.0
[1.5.0]: https://github.com/cavalcanteprofissional/cavalcanteprofissional/releases/tag/v1.5.0
[1.4.0]: https://github.com/cavalcanteprofissional/cavalcanteprofissional/releases/tag/v1.4.0
[1.3.0]: https://github.com/cavalcanteprofissional/cavalcanteprofissional/releases/tag/v1.3.0
[1.2.0]: https://github.com/cavalcanteprofissional/cavalcanteprofissional/releases/tag/v1.2.0
[1.1.0]: https://github.com/cavalcanteprofissional/cavalcanteprofissional/releases/tag/v1.1.0
[1.0.0]: https://github.com/cavalcanteprofissional/cavalcanteprofissional/releases/tag/v1.0.0
[0.2.0]: https://github.com/cavalcanteprofissional/cavalcanteprofissional/releases/tag/v0.2.0
[0.1.0]: https://github.com/cavalcanteprofissional/cavalcanteprofissional/releases/tag/v0.1.0
