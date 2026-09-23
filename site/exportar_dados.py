"""Exporta o banco LojaData (DuckDB) para JSON compacto, usado pelo site.

Também grava os resultados esperados de cada exercício (via DuckDB) em
site/build/esperado.json, para o teste que confere o motor do navegador.
"""

import datetime as dt
import json
import sys
from decimal import Decimal
from pathlib import Path

import duckdb

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ))
from checar import carregar_gabaritos, executar  # noqa: E402

TABELAS = ["clientes", "produtos", "pedidos", "itens_pedido", "avaliacoes"]


def valor(v):
    if isinstance(v, Decimal):
        return float(v)
    if isinstance(v, (dt.date, dt.datetime)):
        return v.isoformat()
    return v


def main() -> None:
    con = duckdb.connect(str(RAIZ / "dados" / "loja.duckdb"), read_only=True)
    dados = {}
    for t in TABELAS:
        cols = con.execute(f"DESCRIBE {t}").fetchall()
        linhas = con.execute(f"SELECT * FROM {t} ORDER BY ALL").fetchall()
        dados[t] = {
            "colunas": [[c[0], c[1]] for c in cols],
            "linhas": [[valor(v) for v in linha] for linha in linhas],
        }
    saida = RAIZ / "site" / "build"
    saida.mkdir(exist_ok=True)
    (saida / "dados.json").write_text(json.dumps(dados, ensure_ascii=False, separators=(",", ":")))

    esperado = {i: executar(con, ex["sql"]) for i, ex in carregar_gabaritos().items()}
    (saida / "esperado.json").write_text(json.dumps(esperado, ensure_ascii=False))
    print(f"dados.json: {(saida / 'dados.json').stat().st_size // 1024} KB · {len(esperado)} exercícios")


if __name__ == "__main__":
    main()
