# Semana 3 — Modelagem Relacional, JOINs e `CASE WHEN` 🔗

> **Missão da semana:** cruzar tabelas. É **a** habilidade mais cobrada em testes técnicos de SQL para vagas júnior.
> **XP disponível:** 320 (lições) + 30 (ERD) + 120 (Boss) · **Entregável:** diagrama do banco (ERD)

| Dia | Lição | XP |
|---|---|---|
| Seg | L11 · Modelo relacional: PK, FK e cardinalidade | 20 + 30 (ERD) |
| Ter | L12 · `INNER JOIN` | 60 |
| Qua | L13 · `LEFT JOIN` e o problema dos “órfãos” | 80 |
| Qui | L14 · JOIN de 3+ tabelas | 80 |
| Sex | L15 · `CASE WHEN`: segmentação | 80 |
| Sáb | ⚔️ Boss Fight 3 + revisão Leitner | 120 |
| Dom | 😴 Folga | — |

---

## L11 · Modelo relacional — “Como as tabelas conversam”

### 🔁 Aquecimento
Anki + refaça o **B2.1**.

### 📖 Conceito
- **Chave primária (PK):** identifica cada linha de forma única (`clientes.cliente_id`).
- **Chave estrangeira (FK):** aponta para a PK de outra tabela (`pedidos.cliente_id → clientes.cliente_id`).
- **Cardinalidade:** 1 cliente → N pedidos · 1 pedido → N itens · 1 pedido → 0 ou 1 avaliação.

```
clientes 1───N pedidos 1───N itens_pedido N───1 produtos
                   │
                   1───0..1 avaliacoes
```
**Por que importa:** quase todo bug de análise júnior é um JOIN que **duplica linhas** (juntar 1:N e depois somar algo que estava do lado “1”). Saber a cardinalidade evita isso.

> 🔭 **Prévia do Mês 2/3:** em BI, organizamos tabelas em **fatos** (eventos: `itens_pedido`) e **dimensões** (contexto: `clientes`, `produtos`, calendário). É o *star schema*, base do Power BI.

### 💻 Mão na massa
| ID | Desafio | XP |
|---|---|---|
| 3.1 | Em `itens_pedido`: nº de linhas e nº de `pedido_id` **distintos**. O que a diferença revela? | 10 |
| 3.2 | Quantos clientes **distintos** já fizeram pedido? Compare com o total (500). | 10 |
| 🎨 ERD | Desenhe o diagrama do banco no [dbdiagram.io](https://dbdiagram.io) e salve o PNG em `mes-01/projeto/erd.png`. `python xp.py registrar projeto erd --xp 30` | 30 |

---

## L12 · `INNER JOIN` — “Só o que casa dos dois lados”

### 🔁 Aquecimento
Anki + refaça o **2.15**.

### 📖 Conceito
```sql
SELECT p.pedido_id, p.data_pedido, c.nome
FROM pedidos AS p
INNER JOIN clientes AS c              -- "JOIN" sozinho = INNER JOIN
        ON c.cliente_id = p.cliente_id;   -- a regra de ligação (FK = PK)
```
- Use **aliases curtos** (`p`, `c`) e **sempre** prefixe as colunas (`c.nome`). Evita ambiguidade e mostra maturidade no código.
- `INNER JOIN` descarta linhas sem par do outro lado.

### 💻 Mão na massa
| ID | Desafio | XP |
|---|---|---|
| 3.3 | Pedidos 1 a 5: `pedido_id`, `data_pedido` e `nome` do cliente, em ordem de pedido. | 10 |
| 3.4 | Itens do pedido **42**: `nome` do produto, `quantidade`, `preco_unitario`. | 10 |
| 3.5 ⭐⭐ | **Receita por categoria** (qtd × preço unitário), da maior para a menor. | 20 |
| 3.6 ⭐⭐ | **Pedidos por estado** do cliente, do maior para o menor (desempate: `estado`). | 20 |

---

## L13 · `LEFT JOIN` — “Encontrando o que falta”

### 🔁 Aquecimento
Anki + refaça o **3.5**.

### 📖 Conceito
`LEFT JOIN` mantém **todas** as linhas da tabela da esquerda; quando não há par, as colunas da direita vêm `NULL`.
```sql
-- Padrão "anti-join": produtos que NUNCA foram vendidos
SELECT pr.nome
FROM produtos AS pr
LEFT JOIN itens_pedido AS i ON i.produto_id = pr.produto_id
WHERE i.produto_id IS NULL;
```
Perguntas de negócio típicas: *clientes que nunca compraram*, *produtos encalhados*, *pedidos sem avaliação*.
`COALESCE(x, 0)` troca NULL por 0, útil para mostrar “0 vendas” em vez de vazio.

### 💻 Mão na massa
| ID | Desafio | XP |
|---|---|---|
| 3.7 ⭐⭐ | `nome` dos produtos que **nunca** foram vendidos. | 20 |
| 3.8 ⭐⭐ | **Quantos** clientes nunca fizeram pedido? | 20 |
| 3.9 ⭐⭐ | Quantos pedidos **entregues** **não** têm avaliação? | 20 |
| 3.10 ⭐⭐ | Os **5 produtos que menos venderam** (unidades; mostre 0 para quem nunca vendeu): `nome`, unidades. Desempate: `nome`. | 20 |

### 🧠 Flashcards
- *INNER vs LEFT JOIN?* → INNER: só linhas com par. LEFT: tudo da esquerda + par (ou NULL).
- *Como achar registros sem correspondência?* → LEFT JOIN + `WHERE direita.chave IS NULL`.

---

## L14 · JOIN de várias tabelas — “A pergunta completa”

### 🔁 Aquecimento
Anki + refaça o **3.8**.

### 📖 Conceito
Siga o “caminho” do diagrama: `clientes → pedidos → itens_pedido → produtos`.
```sql
SELECT c.estado, SUM(i.quantidade * i.preco_unitario) AS receita
FROM clientes AS c
JOIN pedidos      AS p ON p.cliente_id = c.cliente_id
JOIN itens_pedido AS i ON i.pedido_id  = p.pedido_id
WHERE p.status = 'entregue'
GROUP BY c.estado;
```
> ⚠️ **Armadilha da duplicação:** ao juntar `pedidos` com `itens_pedido`, o `frete` do pedido se repete em cada item. `SUM(p.frete)` depois desse JOIN **infla** o frete. Some métricas no **nível correto** (vamos resolver isso com CTEs na semana 4).

### 💻 Mão na massa
| ID | Desafio | XP |
|---|---|---|
| 3.11 ⭐⭐ | **Top 5 estados** por receita de pedidos **entregues**. | 20 |
| 3.12 ⭐⭐ | **Nota média** (2 casas) das avaliações por **categoria** de produto, da maior para a menor (desempate: categoria). | 20 |
| 3.13 ⭐⭐ | **Top 5 clientes** por valor gasto em pedidos entregues: `cliente_id`, `nome`, total. | 20 |
| 3.14 ⭐⭐ | Receita de **2025** por **canal de aquisição**, excluindo pedidos cancelados, da maior para a menor. | 20 |

---

## L15 · `CASE WHEN` — “Criando segmentos”

### 🔁 Aquecimento
Anki + refaça o **3.13**.

### 📖 Conceito
`CASE` é o “SE” do SQL. Cria categorias que não existem na base:
```sql
SELECT CASE
         WHEN preco < 100  THEN 'Barato'
         WHEN preco < 1000 THEN 'Médio'   -- avaliado em ordem: o 1º verdadeiro vence
         ELSE 'Caro'
       END AS faixa,
       COUNT(*)
FROM produtos
GROUP BY faixa;
```
**Truque que impressiona em entrevista:** taxa com `CASE` dentro de agregação:
```sql
100.0 * SUM(CASE WHEN status = 'cancelado' THEN 1 ELSE 0 END) / COUNT(*)
```

### 💻 Mão na massa
| ID | Desafio | XP |
|---|---|---|
| 3.15 ⭐⭐ | Nº de produtos por faixa: `'Barato'` (< 100), `'Médio'` (100 a 999,99), `'Caro'` (≥ 1000). | 20 |
| 3.16 ⭐⭐ | **Taxa de cancelamento (%)** por forma de pagamento (1 casa), da maior para a menor. | 20 |
| 3.17 ⭐⭐ | Pedidos por período: `'Black Friday'` (novembro), `'Natal'` (dezembro), `'Resto do ano'`. | 20 |
| 3.18 ⭐⭐ | Avaliações por perfil NPS: nota 5 = `'Promotor'`, 4 = `'Neutro'`, 1–3 = `'Detrator'`. | 20 |

---

## ⚔️ Sábado — Boss Fight 3: “O Diretor Comercial”

> *40 minutos. Sem consulta.*

| ID | Pergunta | XP |
|---|---|---|
| B3.1 | Por `categoria`: receita de **2024** e de **2025** lado a lado (duas colunas), sem pedidos cancelados, ordenado por categoria. *Dica: `CASE` dentro do `SUM`.* | 30 |
| B3.2 | Clientes do **RJ** que já compraram alguma **Smart TV**: `cliente_id`, `nome` (sem repetição), por `cliente_id`. | 30 |
| B3.3 | Categorias com **mais de 20 pedidos** avaliados com nota **≤ 2**: `categoria`, nº de pedidos distintos. | 30 |
| B3.4 | **Frete médio** (2 casas) por região: Sudeste (SP, RJ, MG), Sul (PR, SC, RS), Nordeste (BA, PE, CE), Centro-Oeste (DF, GO). Ordem alfabética de região. | 30 |
