# 💼 Plano de Portfólio: 6 projetos, 1 por mês

**Princípio:** recrutador não lê código primeiro. Ele lê o **README** por 30–60 segundos. Então todo projeto tem:
**pergunta de negócio → método → resultado com números → recomendação → limitações.**

| Mês | Projeto | Stack | O que prova em entrevista |
|---|---|---|---|
| 1 | **Raio-X de Vendas: LojaData** | SQL (DuckDB) | JOINs, agregações, CTEs, pensamento de negócio |
| 2 | **Coortes e Retenção: Olist** | SQL avançado (window functions) + Excel | SQL nível teste técnico, métricas de retenção |
| 3 | **Dashboard Executivo de Vendas** | Power BI (Power Query + DAX) | Modelagem dimensional, DAX, design de dashboard |
| 4 | **Limpeza + EDA de Dados Públicos BR** | Python, Pandas, Seaborn (Colab) | Tratar dados sujos, análise exploratória, visualização |
| 5 | **Teste A/B + App Interativo** | Python (SciPy), Streamlit | Estatística aplicada, comunicação, entregar produto |
| 6 | **Capstone ponta a ponta** | SQL → Python → Power BI + vídeo | Visão completa do ciclo analítico + apresentação |

---

### Mês 1: Raio-X de Vendas (LojaData)
- **Dados:** banco deste repo (`dados/loja.duckdb`)
- **Perguntas:** sazonalidade e dependência da Black Friday; receita × margem por categoria; conversão e valor por canal; cancelamento; Pareto de clientes; avaliações negativas.
- **Entregável:** `mes-01/projeto/` com README + `queries.sql` + ERD.
- **Frase de entrevista:** *“Descobri que as categorias de maior margem percentual não são as que mais faturam, e recomendei…”*

### Mês 2: Coortes e Retenção (Olist)
- **Dados:** [Brazilian E-Commerce Public Dataset by Olist](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce), ~100 mil pedidos reais anonimizados.
- **Análises:** coortes mensais de primeira compra, retenção M+1/M+3, tempo de entrega × nota de avaliação (`LAG`, `ROW_NUMBER`, `DATE_TRUNC`), ranking de vendedores por estado.
- **Bônus Excel:** tabela dinâmica da matriz de coortes com formatação condicional (heatmap).
- **Frase de entrevista:** *“Pedidos entregues com mais de X dias de atraso têm nota média Y pontos menor.”* (preencha com os seus números)

### Mês 3: Dashboard Executivo (Power BI)
- **Dados:** Olist (reaproveite o modelo do mês 2) → **star schema** (`fato_itens`, `dim_cliente`, `dim_produto`, `dim_vendedor`, `dim_calendario`).
- **Páginas:** 1) Visão executiva (KPIs + tendência) · 2) Produtos e categorias · 3) Logística e satisfação.
- **DAX mínimo:** Receita, Ticket Médio, Receita YoY %, % Pedidos Atrasados, Nota Média.
- **Entregável:** `.pbix` + PDF + GIF de navegação no README + print do modelo de dados.

### Mês 4: Limpeza + EDA de Dados Públicos Brasileiros
- **Sugestões de dados:** preços de combustíveis (ANP), dados de saúde (DataSUS/OpenDataSUS), IBGE, reclamações do consumidor.gov.br, microdados do ENEM (use amostra).
- **Mostre:** diagnóstico de qualidade (NULLs, duplicados, tipos, outliers) → tratamento justificado → 6–8 gráficos com título que **afirma algo** (“Preço da gasolina subiu X% no Nordeste”, e não só “Preço por região”).
- **Entregável:** notebook Colab limpo, com markdown narrativo.

### Mês 5: Teste A/B + App Streamlit
- **Dados:** dataset público de A/B test (ex.: “A/B testing” de landing page ou de jogo mobile no Kaggle).
- **Mostre:** hipóteses, checagem de balanceamento, taxa de conversão por grupo, teste de proporções, intervalo de confiança, **decisão de negócio** (significância estatística ≠ relevância prática).
- **App:** Streamlit com filtros e explicação em linguagem simples, publicado no Streamlit Community Cloud.

### Mês 6: Capstone ponta a ponta
- Escolha um **domínio da vaga que você quer** (varejo, saúde, finanças, RH, logística). Isso mostra intenção.
- **Pipeline:** extração/modelagem em SQL → tratamento/análise em Python → dashboard em Power BI → **vídeo de 5 min** (Loom/YouTube não listado) apresentando como se fosse para a diretoria.
- É o projeto que você vai **apresentar em entrevistas**.

---

## ✅ Checklist de qualidade (vale para todos)
- [ ] Título que diz o problema, não a ferramenta (“Por que clientes não voltam?”, e não “Projeto SQL 2”)
- [ ] Resumo executivo com 3 bullets e números no topo do README
- [ ] Imagens (gráfico, dashboard, diagrama) no README
- [ ] Código comentado e organizado; sem senhas/dados sensíveis
- [ ] Seção de limitações e próximos passos
- [ ] Repositório fixado (“pinned”) no perfil do GitHub + post no LinkedIn

## 🧑‍💼 Como usar os projetos na entrevista
Prepare, para cada projeto, uma história de **2 minutos** no formato **STAR**:
- **S**ituação: qual era o problema de negócio
- **T**arefa: o que você precisava descobrir
- **A**ção: o que você fez (ferramentas + decisões, incluindo um obstáculo que superou)
- **R**esultado: o número + a recomendação
