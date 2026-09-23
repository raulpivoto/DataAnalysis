"""Gera site/index.html (um único arquivo) a partir de site/src e dos gabaritos.

Uso:
    python dados/criar_banco.py      # se ainda não criou o banco
    python site/exportar_dados.py
    python site/build.py
"""

import csv
import json
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parent
RAIZ = SITE.parent
sys.path.insert(0, str(RAIZ))
from checar import carregar_gabaritos  # noqa: E402

# Lição que libera cada cartão de anki/mes-01.csv (mesma ordem do arquivo)
LICAO_DO_CARTAO = [
    "L1", "L4", "L8", "L2", "L3", "L3", "L3", "L4", "L4", "L5", "L5", "L6", "L6", "L7", "L8",
    "L9", "L10", "L10", "L10", "L18", "L18", "L18", "L18", "L11", "L11", "L11", "L14", "L13",
    "L13", "L13", "L15", "L15", "L11", "L16", "L17", "L18", "L18",
]


def json_seguro(obj) -> str:
    return json.dumps(obj, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


def cartoes() -> list[dict]:
    linhas = [l for l in (RAIZ / "anki" / "mes-01.csv").read_text(encoding="utf-8").splitlines()
              if l and not l.startswith("#")]
    itens = [{"f": f, "v": v} for f, v in csv.reader(linhas, delimiter=";")]
    assert len(itens) == len(LICAO_DO_CARTAO), (len(itens), len(LICAO_DO_CARTAO))
    return [{**c, "licao": l} for c, l in zip(itens, LICAO_DO_CARTAO)]


def main() -> None:
    src = SITE / "src"
    gabarito = {i: {"sql": e["sql"], "xp": e["xp"]} for i, e in carregar_gabaritos().items()}
    pagina = (SITE / "pagina.html").read_text(encoding="utf-8")
    trocas = {
        "/*CSS*/": (src / "estilo.css").read_text(encoding="utf-8"),
        "/*DADOS*/": (SITE / "build" / "dados.json").read_text(encoding="utf-8").replace("</", "<\\/"),
        "/*GABARITO*/": json_seguro(gabarito),
        "/*CARTOES*/": json_seguro(cartoes()),
        "/*MOTOR*/": (src / "motor.js").read_text(encoding="utf-8"),
        "/*CONTEUDO*/": (src / "conteudo.js").read_text(encoding="utf-8"),
        "/*APP*/": (src / "app.js").read_text(encoding="utf-8"),
    }
    for marca, conteudo in trocas.items():
        pagina = pagina.replace(marca, conteudo, 1)
    (SITE / "index.html").write_text(pagina, encoding="utf-8")
    print(f"site/index.html: {len(pagina.encode()) // 1024} KB")


if __name__ == "__main__":
    main()
