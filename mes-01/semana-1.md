# Semana 1 — Fundamentos do `SELECT` 🔎

> **Missão da semana:** fazer perguntas simples a um banco de dados e receber respostas certas.
> **XP disponível:** 230 (lições) + 150 (Boss) · **Meta:** 5 dias de ofensiva

| Dia | Lição | Tempo | XP |
|---|---|---|---|
| Seg | L1 · Setup + `SELECT` | 60–90 min | 30 |
| Ter | L2 · Filtros com `WHERE` | 60 min | 50 |
| Qua | L3 · `IN`, `BETWEEN`, `LIKE`, `NULL` | 60 min | 40 |
| Qui | L4 · `ORDER BY`, `LIMIT`, `DISTINCT` | 60 min | 50 |
| Sex | L5 · Colunas calculadas | 60 min | 60 |
| Sáb | ⚔️ Boss Fight 1 + revisão | 90–120 min | 150 |
| Dom | 😴 Folga (a ofensiva não quebra) | — | — |

**Formato de cada lição:** 🔁 Aquecimento (5 min) → 📖 Conceito (10 min) → 💻 Mão na massa (35 min) → 🧠 Flashcards (5 min) → ✅ Commit (5 min)

**Como entregar um exercício:** crie `mes-01/solucoes/<id>.sql` com a query e rode `python checar.py <id>`.

---

## L1 · Setup + `SELECT` — “Fazendo sua primeira pergunta”

### 🔁 Aquecimento
Primeiro dia, não há revisão. Crie o baralho **"Dados — Mês 1"** no Anki.

### ⚙️ Setup (só hoje, ~30 min)
1. Crie uma conta no GitHub e faça um **fork** (ou clone) deste repositório.
2. Instale Python 3.10+ **ou** use o Google Colab (veja o [README](../README.md#-começando-em-10-minutos)).
3. `pip install -r requirements.txt` → `python dados/criar_banco.py`
4. Instale o [DBeaver Community](https://dbeaver.io/) (grátis) e abra o arquivo `dados/loja.duckdb` para ver as tabelas. *(Opcional, mas ajuda muito ver os dados.)*

### 📖 Conceito
Um **banco relacional** é um conjunto de **tabelas** (linhas × colunas). SQL é a língua usada para perguntar coisas a ele.
A LojaData tem 5 tabelas: `clientes`, `produtos`, `pedidos`, `itens_pedido`, `avaliacoes`.

```sql
SELECT nome, preco      -- QUAIS colunas eu quero
FROM produtos;          -- DE QUAL tabela
```
- `SELECT *` traz todas as colunas. Bom para explorar, ruim em produção (lento e frágil).
- SQL não diferencia maiúsculas nas palavras-chave, mas a convenção é escrevê-las em MAIÚSCULAS.
- Termine a query com `;`.

### 💻 Mão na massa
| ID | Desafio | XP |
|---|---|---|
| 1.1 | Traga **todas** as colunas da tabela `produtos`. | 10 |
| 1.2 | Traga apenas `nome`, `categoria` e `preco` dos produtos. | 10 |
| 1.3 | Traga `nome`, `estado` e `canal_aquisicao` de todos os clientes. | 10 |

### 🧠 Flashcards (crie no Anki)
- *O que faz `SELECT *`?* → Retorna todas as colunas da tabela.
- *Ordem mínima de uma query?* → `SELECT` colunas `FROM` tabela.

### ✅ Encerramento
`git add . && git commit -m "L1: primeiras queries" && git push` · `python xp.py registrar anki`

---

## L2 · Filtros com `WHERE` — “Só o que importa”

### 🔁 Aquecimento (5 min)
Revise o Anki. Sem olhar nada, reescreva a query do 1.2.

### 📖 Conceito
```sql
SELECT nome, preco
FROM produtos
WHERE preco > 1000;          -- filtra LINHAS
```
- Comparações: `=`, `<>` (diferente), `>`, `<`, `>=`, `<=`
- Texto e datas vão entre **aspas simples**: `WHERE status = 'cancelado'`
- Combine condições com `AND` / `OR`. **Cuidado:** `AND` é avaliado antes de `OR`. Na dúvida, use parênteses.

```sql
-- ⚠️ ERRADO: traz TODOS de SP + só os do RJ que vieram do Instagram
WHERE estado = 'SP' OR estado = 'RJ' AND canal_aquisicao = 'instagram'
-- ✅ CERTO
WHERE (estado = 'SP' OR estado = 'RJ') AND canal_aquisicao = 'instagram'
```

### 💻 Mão na massa
| ID | Desafio | XP |
|---|---|---|
| 1.4 | `nome` e `preco` dos produtos da categoria `'Periféricos'`. | 10 |
| 1.5 | `nome` e `preco` dos produtos com preço **acima de** R$ 1.000. | 10 |
| 1.6 | `pedido_id` e `data_pedido` dos pedidos **cancelados** pagos via `'pix'`. | 10 |
| 1.7 ⭐⭐ | `cliente_id`, `nome`, `estado` dos clientes de SP **ou** RJ que vieram do `'instagram'`. | 20 |

### 🧠 Flashcards
- *`AND` ou `OR`: qual é avaliado primeiro?* → `AND`. Use parênteses.
- *Como escrever “diferente” em SQL?* → `<>` (ou `!=`)

---

## L3 · `IN`, `BETWEEN`, `LIKE`, `IS NULL` — “Filtros ninja”

### 🔁 Aquecimento
Anki + refaça o **1.7** do zero (repetição espaçada: 1 dia depois).

### 📖 Conceito
```sql
WHERE estado IN ('PR', 'SC', 'RS')                          -- lista de valores
WHERE data_pedido BETWEEN '2025-11-01' AND '2025-11-30'    -- intervalo (inclusivo!)
WHERE nome LIKE 'Smart%'      -- % = qualquer sequência · _ = exatamente 1 caractere
WHERE email IS NULL           -- NUNCA use "= NULL": NULL não é igual a nada
```
**NULL** = “valor desconhecido/ausente”. Dados reais vêm cheios deles. Saber lidar com isso é o que separa quem já trabalhou com dados de quem não trabalhou.

### 💻 Mão na massa
| ID | Desafio | XP |
|---|---|---|
| 1.8 | `cliente_id`, `nome`, `estado` dos clientes da **Região Sul** (PR, SC, RS). Use `IN`. | 10 |
| 1.9 | `pedido_id`, `data_pedido` dos pedidos de **novembro de 2025**. Use `BETWEEN`. | 10 |
| 1.10 | `nome` dos produtos que **começam** com `'Smart'`. | 10 |
| 1.11 | `cliente_id`, `nome` dos clientes **sem e-mail** cadastrado. | 10 |

### 🧠 Flashcards
- *Por que `= NULL` não funciona?* → NULL é “desconhecido”; comparação com ele dá NULL. Use `IS NULL`.
- *`BETWEEN` inclui os extremos?* → Sim.
- *`LIKE '%tv%'` encontra “Smart TV”?* → Não no DuckDB/Postgres (diferencia maiúsculas). Use `ILIKE`.

---

## L4 · `ORDER BY`, `LIMIT`, `DISTINCT`, alias — “Rankings”

### 🔁 Aquecimento
Anki + refaça o **1.9**.

### 📖 Conceito
```sql
SELECT nome AS produto, preco      -- AS = apelido (alias) da coluna
FROM produtos
ORDER BY preco DESC, nome          -- DESC = maior→menor; 2º critério = desempate
LIMIT 5;                           -- só as 5 primeiras linhas

SELECT DISTINCT categoria FROM produtos;   -- remove duplicatas
```
**Ordem de escrita:** `SELECT → FROM → WHERE → ORDER BY → LIMIT`

### 💻 Mão na massa
| ID | Desafio | XP |
|---|---|---|
| 1.12 | Os **5 produtos mais caros** (`nome`, `preco`). | 10 |
| 1.13 | Lista de **categorias distintas** em ordem alfabética. | 10 |
| 1.14 ⭐⭐ | Os **10 pedidos mais recentes** (`pedido_id`, `data_pedido`). Desempate: `pedido_id` decrescente. | 20 |
| 1.15 | Quais **canais de aquisição** distintos existem? | 10 |

> 💡 Por que o desempate importa? Vários pedidos têm a mesma data. Sem um 2º critério, o “top 10” pode mudar a cada execução — em entrevista isso é um ponto que o avaliador observa.

---

## L5 · Colunas calculadas — “Gerando métricas”

### 🔁 Aquecimento
Anki + refaça o **1.14** sem olhar.

### 📖 Conceito
Você pode fazer contas dentro do `SELECT`:
```sql
SELECT nome,
       preco - custo                          AS margem,
       ROUND((preco - custo) / preco * 100, 1) AS margem_pct
FROM produtos;
```
- `ROUND(valor, casas)` arredonda.
- Você pode **ordenar** pelo alias (`ORDER BY margem`), mas no padrão SQL **não pode usar o alias no `WHERE`**; repita a expressão (o `WHERE` roda antes do `SELECT`). O DuckDB até aceita, mas PostgreSQL, SQL Server e MySQL não: crie o hábito certo.

### 💻 Mão na massa
| ID | Desafio | XP |
|---|---|---|
| 1.16 | `nome`, `preco`, `custo` e `margem` (preço − custo) dos **10 produtos de maior margem**. | 10 |
| 1.17 ⭐⭐ | `nome` e `margem_pct` (arredondada, 1 casa) de **todos** os produtos, da maior para a menor margem. Desempate: `nome`. | 20 |
| 1.18 | Para o `pedido_id = 10`: `pedido_id`, `produto_id` e `valor_total` (quantidade × preço unitário). | 10 |
| 1.19 ⭐⭐ | `nome` e `margem_pct` (1 casa) dos produtos com margem **acima de 60%**. | 20 |

### 🧠 Flashcards
- *Posso usar um alias do SELECT no WHERE?* → No SQL padrão, não: o WHERE é executado antes. No ORDER BY pode.
- *Fórmula de margem %?* → (preço − custo) / preço × 100

---

## ⚔️ Sábado — Boss Fight 1: “O Gerente Apressado”

> *Seu gestor manda 5 pedidos no Slack às 17h55 de sexta. Você tem **45 minutos**. Sem consultar as lições.*

Cronometre. Crie os arquivos `B1.x.sql` e rode `python checar.py --semana 1`.

| ID | Pedido do gestor | XP |
|---|---|---|
| B1.1 | “Quero `nome`, `cidade` e `data_cadastro` dos clientes de **MG** cadastrados a partir de **2025** que **têm e-mail**. Ordena pela data de cadastro (desempate: `cliente_id`).” | 30 |
| B1.2 | “Pedidos de **dezembro/2024** com **frete grátis** pagos no **boleto ou cartão de débito**: `pedido_id`, `data_pedido`, `forma_pagamento`, por `pedido_id`.” | 30 |
| B1.3 | “Os **3 acessórios mais baratos**, `nome` e `preco`.” | 30 |
| B1.4 | “Itens vendidos **com desconto** e **quantidade ≥ 2**: `pedido_id`, `produto_id`, `quantidade`, `desconto_pct` e `valor` (qtd × preço unitário). Só os **10 maiores valores** (desempate: `pedido_id`).” | 30 |
| B1.5 | “Clientes que têm **Silva** no nome e **não são de SP**: `cliente_id`, `nome`, `estado`.” | 30 |

**Depois do Boss (30 min):** todo exercício que você errou ou demorou mais de 10 min vai para a **Caixa 1** do seu Leitner (veja [metodologia](../docs/02-metodologia.md#-repetição-espaçada-na-prática)).
**Registro:** `python xp.py` e tire um print do painel para o seu diário de bordo.

**Missão extra da semana (+30 XP, `python xp.py registrar projeto "pesquisa de vagas" --xp 30`):** leia **20 vagas** de Analista de Dados Júnior (LinkedIn, Gupy, Indeed) e conte em uma tabelinha no `mes-01/projeto/diario.md` quantas pedem SQL, Power BI, Excel, Python e Estatística. Você vai confirmar (ou ajustar) as prioridades do [roadmap](../docs/01-roadmap.md) com dados do **seu** mercado. É sua primeira análise de dados!
