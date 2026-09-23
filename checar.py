"""Corretor automático de exercícios SQL (estilo DataCamp).

Você escreve sua resposta em `mes-XX/solucoes/<id>.sql` (ex.: mes-01/solucoes/1.3.sql)
e o corretor compara o RESULTADO da sua query com o do gabarito. Não importa se
você escreveu a query de outro jeito: se o resultado bate, você ganha o XP.

Uso:
    python checar.py 1.3            # corrige um exercício
    python checar.py --semana 1     # corrige todos os exercícios da semana 1
    python checar.py --todos        # corrige tudo que você já resolveu
"""

import argparse
import datetime as dt
import re
import sys
from decimal import Decimal
from pathlib import Path

import duckdb

RAIZ = Path(__file__).resolve().parent
BANCO = RAIZ / "dados" / "loja.duckdb"
sys.path.insert(0, str(RAIZ))
from xp import ja_concluidos, registrar  # noqa: E402

MARCADOR = re.compile(r"^--\s*@ex\s+(\S+)(?:\s+xp=(\d+))?", re.MULTILINE)


def carregar_gabaritos() -> dict:
    """Lê todos os `-- @ex <id> xp=<n>` de mes-*/gabarito/*.sql."""
    exercicios = {}
    for arquivo in sorted(RAIZ.glob("mes-*/gabarito/*.sql")):
        texto = arquivo.read_text(encoding="utf-8")
        marcas = list(MARCADOR.finditer(texto))
        for i, m in enumerate(marcas):
            fim = marcas[i + 1].start() if i + 1 < len(marcas) else len(texto)
            exercicios[m.group(1)] = {
                "sql": texto[m.end():fim].strip(),
                "xp": int(m.group(2) or 10),
                "pasta_mes": arquivo.parent.parent,
            }
    return exercicios


def normalizar(valor):
    if isinstance(valor, (float, Decimal)):
        return round(float(valor), 2)
    if isinstance(valor, dt.datetime) and valor.time() == dt.time(0):
        valor = valor.date()  # DATE_TRUNC devolve timestamp; trate como data
    if isinstance(valor, (dt.date, dt.datetime)):
        return valor.isoformat()
    return valor


def executar(con, sql: str):
    linhas = con.execute(sql).fetchall()
    return [tuple(normalizar(v) for v in linha) for linha in linhas]


def ordena_resultado(sql: str) -> bool:
    return re.search(r"\border\s+by\b", sql, re.IGNORECASE) is not None


def corrigir(ex_id: str, ex: dict, con) -> bool | None:
    solucao = ex["pasta_mes"] / "solucoes" / f"{ex_id}.sql"
    if not solucao.exists():
        return None
    sql_aluno = solucao.read_text(encoding="utf-8").strip()
    if not sql_aluno:
        return None
    try:
        esperado = executar(con, ex["sql"])
        obtido = executar(con, sql_aluno)
    except duckdb.Error as erro:
        print(f"  ❌ {ex_id}: sua query deu erro →\n     {str(erro).splitlines()[0]}")
        return False

    if esperado and obtido and len(esperado[0]) != len(obtido[0]):
        print(f"  ❌ {ex_id}: esperava {len(esperado[0])} coluna(s), "
              f"sua query devolveu {len(obtido[0])}.")
        return False
    if len(esperado) != len(obtido):
        print(f"  ❌ {ex_id}: esperava {len(esperado)} linha(s), sua query devolveu {len(obtido)}.")
        return False

    chave = lambda t: tuple((v is None, str(v)) for v in t)  # noqa: E731
    if ordena_resultado(ex["sql"]):
        ok = esperado == obtido
        dica = "confira também a ORDEM (ORDER BY) das linhas."
    else:
        ok = sorted(esperado, key=chave) == sorted(obtido, key=chave)
        dica = "os valores não batem."
    if not ok:
        for e, o in zip(esperado, obtido):
            if e != o:
                print(f"  ❌ {ex_id}: {dica}\n     esperado: {e}\n     obtido:   {o}")
                break
        else:
            print(f"  ❌ {ex_id}: {dica}")
        return False

    if ex_id in ja_concluidos():
        print(f"  ✅ {ex_id}: correto (XP já recebido antes)")
    else:
        registrar("exercicio", ex_id, ex["xp"])
        print(f"  ✅ {ex_id}: correto! +{ex['xp']} XP 🎉")
    return True


def main() -> None:
    parser = argparse.ArgumentParser(description="Corrige seus exercícios SQL.")
    parser.add_argument("id", nargs="?", help="id do exercício, ex.: 1.3 ou B1.2")
    parser.add_argument("--semana", help="corrige todos os exercícios da semana (ex.: 1)")
    parser.add_argument("--todos", action="store_true", help="corrige tudo")
    args = parser.parse_args()

    if not BANCO.exists():
        sys.exit("Banco não encontrado. Rode antes: python dados/criar_banco.py")

    exercicios = carregar_gabaritos()
    if args.id:
        if args.id not in exercicios:
            sys.exit(f"Exercício '{args.id}' não existe no gabarito.")
        alvo = [args.id]
    elif args.semana:
        alvo = [i for i in exercicios if i.split(".")[0].lstrip("B") == args.semana]
    elif args.todos:
        alvo = list(exercicios)
    else:
        parser.print_help()
        return

    con = duckdb.connect(str(BANCO), read_only=True)
    resultados = [corrigir(i, exercicios[i], con) for i in alvo]
    con.close()

    feitos = [r for r in resultados if r is not None]
    pendentes = [i for i, r in zip(alvo, resultados) if r is None]
    if len(alvo) > 1:
        print(f"\n{sum(feitos)}/{len(alvo)} corretos", end="")
        print(f" · pendentes: {', '.join(pendentes)}" if pendentes else "")
    elif pendentes:
        pasta = exercicios[alvo[0]]["pasta_mes"].name
        print(f"Crie o arquivo {pasta}/solucoes/{alvo[0]}.sql com a sua query.")


if __name__ == "__main__":
    main()
