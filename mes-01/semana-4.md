# Semana 4 — Subqueries, CTEs, Distribuições e o 1º Projeto 🏗️

> **Missão da semana:** escrever SQL **legível** em várias etapas e entregar o **primeiro projeto de portfólio**.
> **XP disponível:** 280 (lições) + 240 (Prova do Mês) + 150 (projeto)

| Dia | Lição | XP |
|---|---|---|
| Seg | L16 · Subqueries | 70 |
| Ter | L17 · CTEs (`WITH`) | 110 |
| Qua | L18 · Distribuição, quartis e outliers | 100 |
| Qui | L19 · Projeto 1: perguntas + queries | 50 |
| Sex | L20 · Projeto 1: insights + README + publicação | 100 |
| Sáb | 🏆 Prova do Mês (Boss Final) | 240 |
| Dom | 🔍 Retrospectiva do mês + planejamento do Mês 2 | — |

---

## L16 · Subqueries — “Uma pergunta dentro da outra”

### 🔁 Aquecimento
Anki + refaça o **3.16**.

### 📖 Conceito
```sql
-- 1) No WHERE, comparando com um valor único
WHERE preco > (SELECT AVG(preco) FROM produtos)

-- 2) No WHERE, com uma lista
WHERE cliente_id IN (SELECT cliente_id FROM pedidos WHERE ...)

-- 3) No FROM: agregação em DOIS NÍVEIS (ex.: média do total por pedido)
SELECT AVG(valor_pedido)
FROM (SELECT pedido_id, SUM(quantidade * preco_unitario) AS valor_pedido
      FROM itens_pedido GROUP BY pedido_id) AS t;
```
O caso 3 é o **ticket médio**, uma das métricas mais pedidas em e-commerce. Note que `AVG(preco_unitario)` **não** é ticket médio!

### 💻 Mão na massa
| ID | Desafio | XP |
|---|---|---|
| 4.1 | Produtos com preço **acima da média**: `nome`, `preco`, do mais caro ao mais barato. | 10 |
| 4.2 ⭐⭐ | **Quantos clientes** fizeram pedido em **dezembro de 2025**? Use `IN (subquery)`. | 20 |
| 4.3 ⭐⭐ | **Ticket médio** (2 casas) dos pedidos **não cancelados**. | 20 |
| 4.4 ⭐⭐ | Qual pedido teve o **maior valor**? `pedido_id`, total. | 20 |

---

## L17 · CTEs — “SQL que se lê como uma história”

### 🔁 Aquecimento
Anki + refaça o **4.3**.

### 📖 Conceito
Uma CTE (`WITH`) dá **nome** a uma etapa. É a forma profissional de escrever análises complexas, e a que entrevistadores preferem ver.
```sql
WITH valor_por_pedido AS (           -- etapa 1: um valor por pedido
    SELECT pedido_id, SUM(quantidade * preco_unitario) AS valor
    FROM itens_pedido
    GROUP BY pedido_id
),
faixas AS (                           -- etapa 2: classifica
    SELECT pedido_id,
           CASE WHEN valor < 200 THEN 'baixo' ELSE 'alto' END AS faixa
    FROM valor_por_pedido
)
SELECT faixa, COUNT(*) FROM faixas GROUP BY faixa;   -- etapa final
```
Isso também resolve a **armadilha da duplicação** da semana 3: agregue cada coisa no seu nível numa CTE e **depois** junte.

### 💻 Mão na massa
| ID | Desafio | XP |
|---|---|---|
| 4.5 ⭐⭐ | Pedidos por faixa de valor: `'1. até R$199'` (< 200), `'2. R$200 a R$999'` (< 1000), `'3. R$1000+'`. Ordenado pela faixa. | 20 |
| 4.6 ⭐⭐⭐ | **Segmentação RFM simplificada:** gasto total por cliente (pedidos **entregues**) → `'VIP'` (≥ 10.000), `'Recorrente'` (≥ 3.000), `'Ocasional'`. Conte clientes por segmento. | 30 |
| 4.7 ⭐⭐⭐ | Meses de **2025** cuja receita (sem cancelados) ficou **acima da média mensal** de 2025: `mes`, `receita`, em ordem. | 30 |
| 4.8 ⭐⭐⭐ | **Retenção:** quantos clientes compraram em 2024 **e também** em 2025? | 30 |

### 🧠 Flashcards
- *Subquery vs CTE?* → Mesmo poder; a CTE nomeia etapas, é mais legível e pode ser reutilizada na query.
- *Como calcular ticket médio?* → Somar por pedido primeiro, depois tirar a média desses totais.

---

## L18 · Distribuição, quartis e outliers — “Estatística que o negócio entende”

### 🔁 Aquecimento
Anki + refaça o **4.6**.

### 📖 Conceito
- **Quartis:** Q1 (25%), Q2 = mediana (50%), Q3 (75%).
- **IQR** (intervalo interquartil) = Q3 − Q1 → onde estão os 50% “do meio”.
- **Regra do boxplot:** outlier se valor > Q3 + 1,5 × IQR (ou < Q1 − 1,5 × IQR).
- Outliers **não são lixo automaticamente**: em e-commerce podem ser clientes corporativos, fraudes ou erro de cadastro. **Investigue antes de remover** (frase ótima para entrevista).

### 💻 Mão na massa
| ID | Desafio | XP |
|---|---|---|
| 4.9 ⭐⭐ | Q1, mediana e Q3 (2 casas) do **valor por pedido** (todos os pedidos). | 20 |
| 4.10 ⭐⭐⭐ | Q1, Q3, IQR e **limite superior** de outlier (2 casas). | 30 |
| 4.11 ⭐⭐⭐ | **Quantos pedidos** estão acima do limite superior? | 30 |
| 4.12 ⭐⭐ | Média e mediana (2 casas) do valor por pedido para cada `forma_pagamento`, em ordem alfabética. | 20 |

📺 **Leitura/vídeo de 10 min (+5 XP, `registrar leitura`):** procure “boxplot explicado” (StatQuest ou canal em PT-BR de sua preferência).

---

## L19–L20 · 🎯 Projeto 1 — “Raio-X de Vendas da LojaData (2024–2025)”

O primeiro item do seu portfólio. Objetivo: provar que você **faz perguntas de negócio, escreve SQL limpo e comunica conclusões**.

**Estrutura** (use o modelo em [`projeto/README.md`](projeto/README.md)):
1. **Contexto:** quem é a empresa e qual problema você investiga.
2. **5 a 7 perguntas de negócio**, por exemplo:
   - Como a receita evoluiu por mês? Qual a dependência da Black Friday?
   - Quais categorias geram **receita** e quais geram **margem**? (não é a mesma coisa!)
   - Qual canal de aquisição traz clientes que **mais convertem** e **mais gastam**?
   - Qual a taxa de cancelamento e onde ela é maior?
   - Quanto da receita vem dos clientes VIP (princípio de Pareto)?
   - O que as avaliações negativas indicam por categoria?
3. **Uma query por pergunta** em `projeto/queries.sql` (com comentários e CTEs).
4. **Resultados + insights + recomendações:** para cada pergunta, *o que o número mostra → por que importa → o que eu faria*.
5. **Limitações:** dados sintéticos, período, etc. (mostra maturidade).

**Critérios de pronto (checklist):**
- [ ] README com as seções acima, escrito para uma pessoa **não técnica** ler em 3 minutos
- [ ] Todas as queries executam sem erro
- [ ] Pelo menos 3 recomendações acionáveis
- [ ] Commit com mensagem clara + link fixado no seu perfil do GitHub
- [ ] Post curto no LinkedIn: “Aprendi X, descobri Y” (opcional, **+30 XP bônus**)

Registrar: `python xp.py registrar projeto "projeto 1" --xp 150`

---

## 🏆 Sábado — Prova do Mês (Boss Final)

> *Simulado de teste técnico real: **75 minutos**, 6 questões, sem consulta às lições (documentação do DuckDB pode, como na vida real).*
> **Aprovação:** 4/6 corretas. Se passar, desbloqueia o **Mês 2**. Se não, revise por 3 dias com Leitner e refaça.

| ID | Questão | XP |
|---|---|---|
| B4.1 | Por **trimestre de 2025** (pedidos entregues): `trimestre`, nº de pedidos, receita. | 40 |
| B4.2 | **Top 3 categorias** por **margem bruta** total (`(preco_unitario − custo) × quantidade`), pedidos entregues. | 40 |
| B4.3 | **Taxa de recompra (%)**: entre clientes com pedido, quantos % têm **2 ou mais**? (1 casa) | 40 |
| B4.4 | Por **canal de aquisição**: nº de clientes, nº de compradores e **% de conversão** (1 casa), da maior conversão para a menor. | 40 |
| B4.5 | Os **3 produtos** que mais aparecem em avaliações com nota **≤ 2**: `nome`, qtd (desempate: `nome`). | 40 |
| B4.6 | Qual **dia da semana** (`ISODOW`) tem o maior **ticket médio** (pedidos não cancelados)? Dia, ticket (2 casas). | 40 |

---

## 🔍 Domingo — Retrospectiva do Mês 1 (30 min)

Responda em `mes-01/projeto/diario.md`:
1. Quais 3 conceitos ainda me dão insegurança? → viram cartões prioritários no Anki.
2. Quantos dias de ofensiva mantive? O que me fez falhar?
3. Qual horário/local funcionou melhor para estudar?
4. **Checklist de domínio.** Consigo, sem consultar:
   - [ ] Filtrar com `WHERE` combinando `AND`/`OR`/`IN`/`LIKE`/`NULL`
   - [ ] Agregar com `GROUP BY` + `HAVING` e explicar a ordem de execução
   - [ ] Usar `INNER` e `LEFT JOIN` e achar registros sem correspondência
   - [ ] Criar segmentos com `CASE WHEN` e taxas com `CASE` dentro de `SUM`
   - [ ] Calcular ticket médio com CTE
   - [ ] Explicar média × mediana e identificar outliers com IQR

➡️ **Mês 2:** SQL intermediário (window functions!), Excel/Sheets para análise e modelagem dimensional. Veja o [roadmap](../docs/01-roadmap.md).
