"""Painel de gamificação: XP, nível, ofensiva (streak) e conquistas.

Uso:
    python xp.py                         # mostra o painel
    python xp.py registrar anki          # revisão diária de flashcards (+5 XP)
    python xp.py registrar revisao 1.3   # refez um exercício antigo (+10 XP)
    python xp.py registrar leitura       # micro-lição/artigo/vídeo (+5 XP)
    python xp.py registrar projeto "insights semana 1" --xp 50
"""

import argparse
import csv
import datetime as dt
from pathlib import Path

LOG = Path(__file__).resolve().parent / "progresso" / "xp_log.csv"
CAMPOS = ["data", "tipo", "ref", "xp"]
XP_PADRAO = {"anki": 5, "leitura": 5, "revisao": 10, "projeto": 50, "exercicio": 10}
META_SEMANAL = 350

NIVEIS = [
    (0, "🌱 Estagiário de Planilha"),
    (500, "🔎 Aprendiz de SELECT"),
    (1500, "🔗 Domador de JOINs"),
    (3000, "📊 Mestre dos Agregados"),
    (5000, "🐼 Treinador de Pandas"),
    (8000, "📈 Contador de Histórias com Dados"),
    (12000, "🚀 Analista Júnior Pronto"),
]


def ler_log() -> list[dict]:
    if not LOG.exists():
        return []
    with LOG.open(encoding="utf-8") as f:
        return [{**r, "xp": int(r["xp"]), "data": dt.date.fromisoformat(r["data"])}
                for r in csv.DictReader(f)]


def registrar(tipo: str, ref: str = "", xp: int | None = None) -> int:
    xp = XP_PADRAO.get(tipo, 10) if xp is None else xp
    novo = not LOG.exists()
    LOG.parent.mkdir(exist_ok=True)
    with LOG.open("a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=CAMPOS)
        if novo:
            w.writeheader()
        w.writerow({"data": dt.date.today().isoformat(), "tipo": tipo, "ref": ref, "xp": xp})
    return xp


def ja_concluidos() -> set[str]:
    return {r["ref"] for r in ler_log() if r["tipo"] == "exercicio"}


def ofensiva(dias: set[dt.date], hoje: dt.date) -> int:
    """Dias seguidos estudando. Cada semana tem 1 'folga' que não quebra a ofensiva
    (o domingo de descanso do plano, ou um dia difícil)."""
    dia = hoje if hoje in dias else hoje - dt.timedelta(days=1)
    contagem, folgas_usadas = 0, set()
    while True:
        if dia in dias:
            contagem += 1
        else:
            semana = dia.isocalendar()[:2]
            if semana in folgas_usadas or dia < min(dias, default=hoje):
                break
            folgas_usadas.add(semana)
        dia -= dt.timedelta(days=1)
    return contagem


def conquistas(log: list[dict], streak: int) -> list[str]:
    exercicios = {r["ref"] for r in log if r["tipo"] == "exercicio"}
    tipos = {r["tipo"] for r in log}
    regras = [
        (len(exercicios) >= 1, "🥇 Primeira query certa"),
        (len(exercicios) >= 25, "🎯 25 exercícios"),
        (len(exercicios) >= 100, "💯 100 exercícios"),
        (any(e.startswith("B") for e in exercicios), "⚔️  Derrotou um Boss"),
        (streak >= 7, "🔥 Ofensiva de 7 dias"),
        (streak >= 30, "🌋 Ofensiva de 30 dias"),
        ("revisao" in tipos, "🧠 Primeira revisão espaçada"),
        ("projeto" in tipos, "📁 Primeiro entregável de portfólio"),
    ]
    return [nome for ok, nome in regras if ok]


def painel() -> None:
    log = ler_log()
    hoje = dt.date.today()
    total = sum(r["xp"] for r in log)
    atual = max((n for n in NIVEIS if total >= n[0]), key=lambda n: n[0])
    proximos = [n for n in NIVEIS if n[0] > total]
    inicio_semana = hoje - dt.timedelta(days=hoje.weekday())
    xp_semana = sum(r["xp"] for r in log if r["data"] >= inicio_semana)
    xp_hoje = sum(r["xp"] for r in log if r["data"] == hoje)
    streak = ofensiva({r["data"] for r in log}, hoje)

    def barra(valor, maximo, largura=24):
        cheio = min(largura, int(largura * valor / maximo)) if maximo else largura
        return "█" * cheio + "░" * (largura - cheio)

    print("\n══════════ SEU PAINEL ══════════")
    print(f" Nível:     {atual[1]}")
    print(f" XP total:  {total}")
    if proximos:
        alvo = proximos[0]
        print(f" Próximo:   {alvo[1]}  [{barra(total - atual[0], alvo[0] - atual[0])}] "
              f"faltam {alvo[0] - total} XP")
    print(f" Hoje:      {xp_hoje} XP {'✅' if xp_hoje else '⚠️  ainda não estudou hoje!'}")
    print(f" Semana:    [{barra(xp_semana, META_SEMANAL)}] {xp_semana}/{META_SEMANAL} XP")
    print(f" Ofensiva:  🔥 {streak} dia(s)")
    medalhas = conquistas(log, streak)
    if medalhas:
        print(" Conquistas:")
        for m in medalhas:
            print(f"   {m}")
    print("════════════════════════════════\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Painel de XP e ofensiva.")
    sub = parser.add_subparsers(dest="cmd")
    reg = sub.add_parser("registrar", help="registra uma atividade fora do corretor")
    reg.add_argument("tipo", choices=sorted(set(XP_PADRAO) - {"exercicio"}))
    reg.add_argument("ref", nargs="?", default="")
    reg.add_argument("--xp", type=int)
    args = parser.parse_args()
    if args.cmd == "registrar":
        ganho = registrar(args.tipo, args.ref, args.xp)
        print(f"+{ganho} XP registrado ({args.tipo}).")
    painel()


if __name__ == "__main__":
    main()
