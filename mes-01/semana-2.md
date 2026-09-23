# Semana 2 — Agregações e Estatística Descritiva 📊

> **Missão da semana:** transformar milhares de linhas em **números que respondem perguntas de negócio**.
> **XP disponível:** 280 (lições) + 150 (Boss) · **Meta:** manter a ofensiva + 1 revisão por dia

| Dia | Lição | XP |
|---|---|---|
| Seg | L6 · `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` | 50 |
| Ter | L7 · `GROUP BY` | 60 |
| Qua | L8 · `HAVING` | 50 |
| Qui | L9 · Trabalhando com datas | 60 |
| Sex | L10 · Estatística descritiva com SQL | 60 |
| Sáb | ⚔️ Boss Fight 2 + revisão Leitner | 150 |
| Dom | 😴 Folga | — |

---

## L6 · Funções de agregação — “Resumindo a tabela inteira”

### 🔁 Aquecimento
Anki + refaça **B1.1** (o boss de sábado) sem olhar.

### 📖 Conceito
```sql
SELECT COUNT(*)            AS linhas,       -- conta linhas
       COUNT(email)        AS com_email,    -- conta valores NÃO nulos
       COUNT(DISTINCT estado) AS estados,   -- conta valores distintos
       SUM(preco), AVG(preco), MIN(preco), MAX(preco)
FROM clientes;
```
Agregações **ignoram NULL** (menos o `COUNT(*)`). Isso vai cair em entrevista.

### 💻 Mão na massa
| ID | Desafio | XP |
|---|---|---|
| 2.1 | Quantos clientes existem? | 10 |
| 2.2 ⭐⭐ | Em uma só query: total de clientes e quantos **têm e-mail**. | 20 |
| 2.3 | Preço mínimo, máximo e médio (2 casas) dos produtos. | 10 |
| 2.4 | Faturamento bruto total: soma de `quantidade × preco_unitario` de todos os itens (2 casas). | 10 |

### 🧠 Flashcards
- *`COUNT(*)` vs `COUNT(coluna)`?* → O primeiro conta linhas; o segundo ignora NULL.

---

## L7 · `GROUP BY` — “Resumindo por grupo”

### 🔁 Aquecimento
Anki + refaça o **1.17**.

### 📖 Conceito
```sql
SELECT estado, COUNT(*) AS clientes
FROM clientes
GROUP BY estado          -- uma linha de resultado por estado
ORDER BY clientes DESC;
```
**Regra de ouro:** toda coluna no `SELECT` que **não** está dentro de uma agregação **precisa** estar no `GROUP BY`.

### 💻 Mão na massa
| ID | Desafio | XP |
|---|---|---|
| 2.5 | Número de clientes por `estado`, do maior para o menor (desempate: `estado`). | 10 |
| 2.6 | Número de pedidos por `status`. | 10 |
| 2.7 ⭐⭐ | Por `categoria`: quantidade de produtos e preço médio (2 casas), do maior preço médio para o menor. | 20 |
| 2.8 ⭐⭐ | Os **5 `produto_id`** com maior receita (qtd × preço unitário) em `itens_pedido`. | 20 |

---

## L8 · `HAVING` — “Filtrando grupos”

### 🔁 Aquecimento
Anki + refaça o **2.2**.

### 📖 Conceito
- `WHERE` filtra **linhas** antes de agrupar.
- `HAVING` filtra **grupos** depois de agrupar.

```sql
SELECT cliente_id, COUNT(*) AS pedidos
FROM pedidos
WHERE status <> 'cancelado'        -- antes de agrupar
GROUP BY cliente_id
HAVING COUNT(*) >= 5;              -- depois de agrupar
```
**Ordem de execução do SQL** (decore, é pergunta clássica):
`FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`

### 💻 Mão na massa
| ID | Desafio | XP |
|---|---|---|
| 2.9 | Categorias com **mais de 4** produtos (`categoria`, qtd). | 10 |
| 2.10 ⭐⭐ | Clientes com **20 ou mais** pedidos: `cliente_id`, qtd, do maior para o menor (desempate: `cliente_id`). | 20 |
| 2.11 ⭐⭐ | Pedidos com **4 ou mais** itens (linhas em `itens_pedido`): `pedido_id`, qtd de itens, ordenado por `pedido_id`. | 20 |

### 🧠 Flashcards
- *WHERE vs HAVING?* → WHERE filtra linhas antes do agrupamento; HAVING filtra grupos depois.
- *Ordem de execução de uma query?* → FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT

---

## L9 · Datas — “Analisando o tempo”

### 🔁 Aquecimento
Anki + refaça o **2.10**.

### 📖 Conceito (DuckDB, quase igual ao PostgreSQL)
```sql
YEAR(data_pedido)                  -- 2025
MONTH(data_pedido)                 -- 11
ISODOW(data_pedido)                -- 1 = segunda … 7 = domingo
DATE_TRUNC('month', data_pedido)   -- 2025-11-01 (1º dia do mês): ótimo para séries temporais
data_pedido + INTERVAL 7 DAY
```
> 💡 Cada banco tem suas funções de data (`EXTRACT`, `DATEPART`, `strftime`…). Não decore todas; aprenda o **conceito** e consulte a documentação. Isso é o que analistas fazem no dia a dia.

### 💻 Mão na massa
| ID | Desafio | XP |
|---|---|---|
| 2.12 | Pedidos por **ano** (`ano`, qtd), em ordem de ano. | 10 |
| 2.13 | Pedidos por **mês de 2025** (`mes` numérico, qtd), em ordem de mês. | 10 |
| 2.14 ⭐⭐ | Pedidos por **dia da semana** (use `ISODOW`), em ordem de dia. | 20 |
| 2.15 ⭐⭐ | Série mensal de 2024 usando `DATE_TRUNC('month', …)`: `mes`, qtd, em ordem. | 20 |

---

## L10 · Estatística descritiva com SQL — “A média mente”

### 🔁 Aquecimento
Anki + refaça o **2.8**.

### 📖 Conceito
| Medida | O que diz | SQL (DuckDB) |
|---|---|---|
| Média | “centro” sensível a extremos | `AVG(x)` |
| Mediana | valor do meio, **robusta** a outliers | `MEDIAN(x)` |
| Moda | valor mais frequente | `MODE(x)` |
| Desvio padrão | quão espalhados estão os dados | `STDDEV_SAMP(x)` |
| Quartis | cortes em 25%, 50%, 75% | `QUANTILE_CONT(x, 0.25)` |

**Insight de negócio:** quando a **média ≫ mediana**, poucos valores muito altos estão “puxando” a média (assimetria à direita). Relatar só a média de ticket, salário ou tempo de entrega pode enganar a diretoria.

### 💻 Mão na massa
| ID | Desafio | XP |
|---|---|---|
| 2.16 ⭐⭐ | Média e mediana (2 casas) do valor por item (qtd × preço unitário). **Escreva num comentário da solução o que a diferença significa.** | 20 |
| 2.17 ⭐⭐ | Para pedidos com frete pago (`frete > 0`): média, mediana e desvio padrão amostral do frete (2 casas). | 20 |
| 2.18 | Distribuição das notas de avaliação: `nota`, qtd, em ordem de nota. | 10 |
| 2.19 | Qual a forma de pagamento mais usada (moda)? `forma_pagamento`, qtd. | 10 |

### 🧠 Flashcards
- *Quando preferir a mediana à média?* → Quando há outliers/assimetria (renda, preços, tempo).
- *O que é desvio padrão, em uma frase?* → A distância típica dos valores em relação à média.

---

## ⚔️ Sábado — Boss Fight 2: “Reunião de Resultados”

> *A diretoria quer números para a reunião de segunda. **50 minutos**, sem consulta.*

| ID | Pergunta | XP |
|---|---|---|
| B2.1 | Pedidos por `forma_pagamento` **e** `status`, só combinações com **20 ou mais** pedidos. Ordene por forma de pagamento e depois qtd decrescente. | 30 |
| B2.2 | Qual **mês de 2025** teve mais pedidos? (`mes`, qtd) | 30 |
| B2.3 | Por `canal_aquisicao`: nº de clientes, primeira e última data de cadastro. Do maior canal para o menor. | 30 |
| B2.4 | Os **3 `produto_id`** com mais **unidades** vendidas. | 30 |
| B2.5 | Q1, mediana e Q3 (2 casas) do preço dos produtos. | 30 |

**Entregável extra (+50 XP, `python xp.py registrar projeto "insights semana 2"`):** escreva em `mes-01/projeto/diario.md` **3 insights de negócio** que você descobriu nesta semana. Exemplo: *“Novembro concentra 20% dos pedidos do ano: planejar estoque para a Black Friday.”*
