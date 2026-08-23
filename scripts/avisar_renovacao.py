#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
 avisar_renovacao.py — Alerta por e-mail para renovação de credenciais
 Repositório: cavalcanteprofissional/cavalcanteprofissional
================================================================================

Verifica quantos dias faltam para o vencimento das credenciais da cadeia de
provenância e envia um e-mail de aviso quando a janela configurada é atingida:

  • Chave GPG ed25519            vence em 22/08/2028
  • Certificado PAdES (.p12)     vence em 22/08/2031

Comportamento:
  • Sem credencial na janela → não faz nada (saída silenciosa, código 0)
  • Na janela (≤90 dias; urgente ≤30) → envia e-mail com os passos de renovação

O remetente usa SMTP do Gmail com Senha de App (requer 2FA ativo na conta).
As credenciais ficam em arquivo LOCAL FORA DO GIT (nunca versionar!):

    %USERPROFILE%\\ferramentas\\smtp.json
    { "usuario": "muitomalakoi@gmail.com",
      "senha_app": "<cole aqui a senha de app de 16 letras>" }

Destinatário padrão: cavalcanteprofissional@outlook.com (alterável em
--destinatario ou pela chave \"destinatario\" do JSON).

Agendamento (Agendador do Windows — mensal, dia 1º às 09:00):

    schtasks /create /tn "AvisoRenovacaoCertificados" ^
      /tr "\"python\" \"<raiz>\\scripts\\avisar_renovacao.py\"" ^
      /sc monthly /d 1 /st 09:00 /f

Uso:

    python scripts/avisar_renovacao.py                 # checagem normal
    python scripts/avisar_renovacao.py --testar        # envia agora (teste)
    python scripts/avisar_renovacao.py --dias 180      # janela maior
    python scripts/avisar_renovacao.py --config caminho.json

Requisitos: Python 3.8+ (apenas biblioteca padrão).
Códigos de saída: 0 = ok (silencioso ou enviado) · 1 = falha de envio ·
2 = configuração ausente/inválida.
================================================================================
"""

import argparse
import json
import smtplib
import sys
from datetime import date, datetime, timezone
from email.mime.text import MIMEText
from email.utils import formatdate
from pathlib import Path

for _stream in (sys.stdout, sys.stderr):
    if hasattr(_stream, "reconfigure"):
        _stream.reconfigure(encoding="utf-8", errors="replace")

REPO_ROOT = Path(__file__).resolve().parent.parent
CONFIG_PADRAO = Path.home() / "ferramentas" / "smtp.json"
SMTP_HOST, SMTP_PORTA = "smtp.gmail.com", 465

DESTINATARIO_PADRAO = "cavalcanteprofissional@outlook.com"

CREDENCIAIS = [
    ("Chave GPG ed25519 (pubkey.asc)", date(2028, 8, 22),
     ["gpg --quick-set-expire 880A68E4D53E4345ECA9F2292ED9BC95BC8746A1 <prazo> "
      "(ou gerar par novo)",
      "atualizar seguranca/pubkey.asc",
      "re-assinar artefatos e manifesto (cascata em seguranca/PROVENANCE.md)",
      "reancorar carimbo OpenTimestamps"]),
    ("Certificado PAdES lucas-signing.p12", date(2031, 8, 22),
     ["gerar novo .p12 (mesma identidade) e salvar em %USERPROFILE%/certificados/",
      "python scripts/assinar_pdf_visivel.py --saida <novo.pdf>",
      "seguir a cascata completa: .asc → manifesto → GPG → OpenTimestamps "
      "(ver TODO.md / PROVENANCE.md)"]),
]

JANELA_URGENTE_DIAS = 30


def ler_config(caminho: Path):
    if not caminho.exists():
        raise FileNotFoundError(
            f"config ausente: {caminho}\n"
            f'Crie o arquivo com o conteúdo:\n'
            '{ "usuario": "muitomalakoi@gmail.com", '
            '"senha_app": "<senha de app>" }')
    cfg = json.loads(caminho.read_text(encoding="utf-8"))
    usuario, senha_app = cfg.get("usuario"), cfg.get("senha_app")
    if not usuario or not senha_app or "COLE_" in senha_app:
        raise ValueError(f"config incompleta em {caminho}: preencha "
                         "\"usuario\" e \"senha_app\" (senha de app real)")
    return usuario, senha_app, cfg.get("destinatario")


def montar_email(remetente: str, destinatario: str,
                 proximos: list) -> MIMEText:
    hoje = datetime.now(timezone.utc)
    linhas = [
        "Olá, Lucas!",
        "",
        "Este é um aviso automático de renovação das credenciais que sustentam",
        "a cadeia de provenância do repositório cavalcanteprofissional:",
        "",
    ]
    urgente = False
    for nome, vence, passos in proximos:
        restam = (vence - hoje.date()).days
        marcador = "🚨 URGENTE" if restam <= JANELA_URGENTE_DIAS else "⚠️ Atenção"
        urgente = urgente or restam <= JANELA_URGENTE_DIAS
        linhas += [
            f"{marcador}: {nome}",
            f"   vence em {vence.strftime('%d/%m/%Y')} — faltam {restam} dias",
            "   o que fazer:",
        ]
        linhas += [f"   {i+1}. {p}" for i, p in enumerate(passos)]
        linhas.append("")

    linhas += [
        "Depois de renovar, siga a cascata de reancoragem documentada em",
        "seguranca/PROVENANCE.md e valide com:",
        "",
        "    python scripts/verificar_provenancia.py",
        "",
        "— Enviado automaticamente por scripts/avisar_renovacao.py",
    ]

    msg = MIMEText("\n".join(linhas), "plain", "utf-8")
    assunto = "[URGENTE] " if urgente else ""
    msg["Subject"] = (f"{assunto}Renovação de credenciais — cadeia de "
                      "provenância cavalcanteprofissional")
    msg["From"] = remetente
    msg["To"] = destinatario
    msg["Date"] = formatdate(localtime=False)
    return msg


def enviar(cfg_path: Path, destinatario_cli: str | None, forcar: bool,
           janela: int) -> int:
    hoje = datetime.now(timezone.utc).date()
    proximos = []
    for nome, vence, passos in CREDENCIAIS:
        restam = (vence - hoje).days
        estado = ("vencida!" if restam < 0 else
                  f"faltam {restam} dias" if restam <= janela else "ok")
        print(f"  {nome}: vence {vence.strftime('%d/%m/%Y')} → {estado}")
        if restam <= janela:
            proximos.append((nome, vence, passos))

    if not proximos and not forcar:
        print(f"\nNada na janela de {janela} dias — nenhum e-mail necessário.")
        return 0

    try:
        usuario, senha_app, dest_cfg = ler_config(cfg_path)
    except (FileNotFoundError, ValueError) as exc:
        print(f"\n✗ {exc}", file=sys.stderr)
        return 2
    destinatario = destinatario_cli or dest_cfg or DESTINATARIO_PADRAO

    msg = montar_email(usuario, destinatario, proximos)
    try:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORTA, timeout=30) as s:
            s.login(usuario, senha_app)
            s.send_message(msg)
    except Exception as exc:
        print(f"\n✗ falha ao enviar via {SMTP_HOST}:{SMTP_PORTA}: {exc}",
              file=sys.stderr)
        print("  confira usuário/senha de app no JSON e se a conta tem 2FA "
              "com Senhas de App habilitadas (contas Workspace educacionais "
              "podem ter o recurso desativado pelo administrador).",
              file=sys.stderr)
        return 1
    print(f"\n✅ e-mail enviado: {usuario} → {destinatario}")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="Alerta de renovação de credenciais.")
    ap.add_argument("--testar", action="store_true",
                    help="envia o e-mail agora, ignorando a janela")
    ap.add_argument("--dias", type=int, default=90,
                    help="janela de antecedência em dias (padrão: 90)")
    ap.add_argument("--config", type=Path, default=CONFIG_PADRAO,
                    help=f"caminho do JSON de SMTP (padrão: {CONFIG_PADRAO})")
    ap.add_argument("--destinatario", help="sobrepõe o destinatário do e-mail")
    args = ap.parse_args()
    print(f"checando vencimentos (janela: {args.dias} dias, teste: {args.testar})")
    return enviar(args.config, args.destinatario, args.testar, args.dias)


if __name__ == "__main__":
    sys.exit(main())
