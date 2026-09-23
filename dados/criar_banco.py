"""Gera o banco de treino `dados/loja.duckdb` (e-commerce fictício "LojaData").

Os dados são sintéticos e determinísticos (seed fixa): todo mundo que rodar
este script terá exatamente o mesmo banco, o que permite corrigir exercícios
automaticamente com `python checar.py`.

Uso:
    python dados/criar_banco.py
"""

import random
from datetime import date, timedelta
from pathlib import Path

import duckdb
import pandas as pd

SEED = 42
CAMINHO_BANCO = Path(__file__).resolve().parent / "loja.duckdb"

ESTADOS = {
    "SP": ["São Paulo", "Campinas", "Santos", "Ribeirão Preto"],
    "RJ": ["Rio de Janeiro", "Niterói", "Petrópolis"],
    "MG": ["Belo Horizonte", "Uberlândia", "Juiz de Fora"],
    "PR": ["Curitiba", "Londrina"],
    "RS": ["Porto Alegre", "Caxias do Sul"],
    "SC": ["Florianópolis", "Joinville"],
    "BA": ["Salvador", "Feira de Santana"],
    "PE": ["Recife", "Olinda"],
    "CE": ["Fortaleza"],
    "DF": ["Brasília"],
    "GO": ["Goiânia"],
}
PESO_ESTADOS = [30, 14, 12, 7, 6, 5, 7, 5, 4, 5, 5]

NOMES = [
    "Ana", "Bruno", "Carla", "Diego", "Eduarda", "Felipe", "Gabriela", "Henrique",
    "Isabela", "João", "Karina", "Lucas", "Mariana", "Nicolas", "Olívia", "Pedro",
    "Queila", "Rafael", "Sofia", "Thiago", "Úrsula", "Vinícius", "Yasmin", "Laura",
    "Matheus", "Beatriz", "Gustavo", "Larissa", "Rodrigo", "Camila",
]
SOBRENOMES = [
    "Silva", "Santos", "Oliveira", "Souza", "Lima", "Pereira", "Costa", "Ferreira",
    "Almeida", "Ribeiro", "Carvalho", "Gomes", "Martins", "Araújo", "Rocha",
]
CANAIS = ["organico", "google_ads", "instagram", "indicacao", "email"]
PESO_CANAIS = [35, 25, 20, 12, 8]

# (nome, categoria, preco, custo)
PRODUTOS = [
    ("Notebook Pro 14", "Informática", 5899.00, 4300.00),
    ("Notebook Basic 15", "Informática", 2999.00, 2250.00),
    ("Monitor 24 Full HD", "Informática", 899.00, 610.00),
    ("Monitor 27 4K", "Informática", 2199.00, 1580.00),
    ("Teclado Mecânico", "Periféricos", 349.90, 190.00),
    ("Teclado Sem Fio", "Periféricos", 159.90, 80.00),
    ("Mouse Gamer", "Periféricos", 219.90, 105.00),
    ("Mouse Sem Fio", "Periféricos", 89.90, 38.00),
    ("Headset USB", "Periféricos", 279.00, 150.00),
    ("Webcam HD", "Periféricos", 249.00, 130.00),
    ("Smartphone X", "Celulares", 3499.00, 2600.00),
    ("Smartphone Lite", "Celulares", 1299.00, 920.00),
    ("Capinha Silicone", "Acessórios", 39.90, 8.00),
    ("Película de Vidro", "Acessórios", 29.90, 5.00),
    ("Carregador Turbo", "Acessórios", 119.90, 45.00),
    ("Cabo USB-C 2m", "Acessórios", 49.90, 12.00),
    ("Power Bank 10000", "Acessórios", 159.00, 75.00),
    ("Fone Bluetooth", "Áudio", 299.00, 140.00),
    ("Caixa de Som Portátil", "Áudio", 449.00, 240.00),
    ("Soundbar", "Áudio", 1199.00, 780.00),
    ("Smart TV 50", "TV e Vídeo", 2799.00, 2100.00),
    ("Smart TV 65", "TV e Vídeo", 4599.00, 3500.00),
    ("Chromecast", "TV e Vídeo", 349.00, 220.00),
    ("Suporte de Parede TV", "TV e Vídeo", 129.00, 55.00),
    ("Smartwatch Fit", "Wearables", 899.00, 520.00),
    ("Pulseira Fitness", "Wearables", 249.00, 110.00),
    ("Tablet 10", "Informática", 1899.00, 1350.00),
    ("SSD 1TB", "Informática", 499.00, 330.00),
    ("HD Externo 2TB", "Informática", 429.00, 290.00),
    ("Roteador Wi-Fi 6", "Redes", 599.00, 360.00),
    ("Repetidor Wi-Fi", "Redes", 149.00, 70.00),
    ("Cadeira Gamer", "Móveis", 1299.00, 800.00),
    ("Mesa para Escritório", "Móveis", 899.00, 540.00),
    ("Luminária LED", "Casa Inteligente", 119.00, 50.00),
    ("Lâmpada Inteligente", "Casa Inteligente", 79.90, 32.00),
    ("Tomada Inteligente", "Casa Inteligente", 99.90, 41.00),
    ("Câmera de Segurança", "Casa Inteligente", 329.00, 170.00),
    ("Console Portátil", "Games", 2499.00, 1900.00),
    ("Controle Sem Fio", "Games", 399.00, 230.00),
    ("Kit Limpeza de Telas", "Acessórios", 34.90, 9.00),
]
# Produtos que nunca serão vendidos (bom para exercícios de LEFT JOIN)
PRODUTOS_SEM_VENDA = {36, 40}

STATUS = ["entregue", "enviado", "cancelado", "processando"]
PESO_STATUS = [78, 8, 10, 4]
PAGAMENTOS = ["cartao_credito", "pix", "boleto", "cartao_debito"]
PESO_PAGAMENTOS = [52, 30, 10, 8]

INICIO = date(2024, 1, 1)
FIM = date(2025, 12, 31)


def data_aleatoria(rng: random.Random, inicio: date, fim: date) -> date:
    return inicio + timedelta(days=rng.randint(0, (fim - inicio).days))


def gerar_clientes(rng: random.Random, n: int = 500) -> pd.DataFrame:
    linhas = []
    for cid in range(1, n + 1):
        nome = f"{rng.choice(NOMES)} {rng.choice(SOBRENOMES)}"
        uf = rng.choices(list(ESTADOS), weights=PESO_ESTADOS)[0]
        cidade = rng.choice(ESTADOS[uf])
        email = f"{nome.lower().replace(' ', '.')}{cid}@email.com"
        # Dados "sujos" de propósito: alguns e-mails e cidades ausentes
        if rng.random() < 0.06:
            email = None
        if rng.random() < 0.03:
            cidade = None
        linhas.append({
            "cliente_id": cid,
            "nome": nome,
            "email": email,
            "cidade": cidade,
            "estado": uf,
            "data_cadastro": data_aleatoria(rng, date(2023, 6, 1), date(2025, 11, 30)),
            "canal_aquisicao": rng.choices(CANAIS, weights=PESO_CANAIS)[0],
        })
    return pd.DataFrame(linhas)


def gerar_produtos() -> pd.DataFrame:
    return pd.DataFrame([
        {"produto_id": i, "nome": n, "categoria": c, "preco": p, "custo": cu}
        for i, (n, c, p, cu) in enumerate(PRODUTOS, start=1)
    ])


def gerar_pedidos_e_itens(rng, clientes, produtos, n_pedidos=3000):
    # ~12% dos clientes nunca compram
    compradores = clientes.sample(frac=0.88, random_state=SEED)
    # Clientes "fiéis" compram mais: peso exponencial simples
    pesos = [rng.expovariate(1.0) for _ in range(len(compradores))]
    ids_vendaveis = [p for p in produtos["produto_id"] if p not in PRODUTOS_SEM_VENDA]
    # Produtos baratos vendem mais
    preco = dict(zip(produtos["produto_id"], produtos["preco"]))
    pesos_prod = [1 / (preco[p] ** 0.45) for p in ids_vendaveis]

    pedidos, itens = [], []
    cadastro = dict(zip(clientes["cliente_id"], clientes["data_cadastro"]))
    for pid in range(1, n_pedidos + 1):
        cid = int(rng.choices(list(compradores["cliente_id"]), weights=pesos)[0])
        inicio = max(INICIO, cadastro[cid])
        d = data_aleatoria(rng, inicio, FIM)
        # Sazonalidade: Black Friday (novembro) e Natal (dezembro) vendem mais
        if d.month not in (11, 12) and rng.random() < 0.18:
            d = data_aleatoria(rng, date(d.year, 11, 1), date(d.year, 12, 24))
            d = max(d, inicio)
        status = rng.choices(STATUS, weights=PESO_STATUS)[0]
        if d > date(2025, 12, 20) and status == "entregue":
            status = rng.choice(["enviado", "processando"])
        frete = 0.0 if rng.random() < 0.3 else round(rng.uniform(9.9, 59.9), 2)
        pedidos.append({
            "pedido_id": pid,
            "cliente_id": cid,
            "data_pedido": d,
            "status": status,
            "forma_pagamento": rng.choices(PAGAMENTOS, weights=PESO_PAGAMENTOS)[0],
            "frete": frete,
        })
        n_itens = rng.choices([1, 2, 3, 4], weights=[55, 28, 12, 5])[0]
        escolhidos = set()
        while len(escolhidos) < n_itens:
            escolhidos.add(rng.choices(ids_vendaveis, weights=pesos_prod)[0])
        for prod in sorted(escolhidos):
            desconto = rng.choice([0, 0, 0, 0.05, 0.10, 0.15]) if d.month == 11 else rng.choice([0, 0, 0, 0, 0.05])
            itens.append({
                "pedido_id": pid,
                "produto_id": prod,
                "quantidade": rng.choices([1, 2, 3], weights=[80, 15, 5])[0],
                "preco_unitario": round(preco[prod] * (1 - desconto), 2),
                "desconto_pct": desconto,
            })
    return pd.DataFrame(pedidos), pd.DataFrame(itens)


def gerar_avaliacoes(rng, pedidos) -> pd.DataFrame:
    linhas = []
    entregues = pedidos[pedidos["status"] == "entregue"]
    for _, p in entregues.iterrows():
        if rng.random() < 0.62:  # nem todo pedido é avaliado
            nota = rng.choices([1, 2, 3, 4, 5], weights=[6, 6, 12, 30, 46])[0]
            linhas.append({
                "pedido_id": int(p["pedido_id"]),
                "nota": nota,
                "data_avaliacao": p["data_pedido"] + timedelta(days=rng.randint(3, 20)),
            })
    return pd.DataFrame(linhas)


def main() -> None:
    rng = random.Random(SEED)
    clientes = gerar_clientes(rng)
    produtos = gerar_produtos()
    pedidos, itens = gerar_pedidos_e_itens(rng, clientes, produtos)
    avaliacoes = gerar_avaliacoes(rng, pedidos)

    if CAMINHO_BANCO.exists():
        CAMINHO_BANCO.unlink()
    con = duckdb.connect(str(CAMINHO_BANCO))
    con.execute("""
        CREATE TABLE clientes (
            cliente_id INTEGER PRIMARY KEY, nome VARCHAR, email VARCHAR,
            cidade VARCHAR, estado VARCHAR, data_cadastro DATE, canal_aquisicao VARCHAR);
        CREATE TABLE produtos (
            produto_id INTEGER PRIMARY KEY, nome VARCHAR, categoria VARCHAR,
            preco DECIMAL(10,2), custo DECIMAL(10,2));
        CREATE TABLE pedidos (
            pedido_id INTEGER PRIMARY KEY, cliente_id INTEGER REFERENCES clientes(cliente_id),
            data_pedido DATE, status VARCHAR, forma_pagamento VARCHAR, frete DECIMAL(10,2));
        CREATE TABLE itens_pedido (
            pedido_id INTEGER REFERENCES pedidos(pedido_id),
            produto_id INTEGER REFERENCES produtos(produto_id),
            quantidade INTEGER, preco_unitario DECIMAL(10,2), desconto_pct DECIMAL(4,2),
            PRIMARY KEY (pedido_id, produto_id));
        CREATE TABLE avaliacoes (
            pedido_id INTEGER PRIMARY KEY REFERENCES pedidos(pedido_id),
            nota INTEGER, data_avaliacao DATE);
    """)
    for nome, df in [("clientes", clientes), ("produtos", produtos), ("pedidos", pedidos),
                     ("itens_pedido", itens), ("avaliacoes", avaliacoes)]:
        con.register("df_tmp", df)
        con.execute(f"INSERT INTO {nome} SELECT * FROM df_tmp")
        con.unregister("df_tmp")
        total = con.execute(f"SELECT COUNT(*) FROM {nome}").fetchone()[0]
        print(f"  {nome:<14} {total:>6} linhas")
    con.close()
    print(f"\nBanco criado em {CAMINHO_BANCO}")


if __name__ == "__main__":
    main()
