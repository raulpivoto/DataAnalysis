# 🗺️ Roadmap de 6 meses: Analista de Dados Júnior

**Premissa:** 1–2 h/dia, 6 dias por semana ≈ **150–250 horas** no total. É suficiente para a vaga júnior **se** o tempo for gasto no que o mercado cobra e **não** em ruído.

## O que o mercado cobra de um júnior (e em que ordem)

Em vagas júnior de Analista de Dados/BI no Brasil, o padrão se repete:

| Prioridade | Habilidade | Frequência em vagas (estimativa) | Como é testada |
|---|---|---|---|
| 🥇 1 | **SQL** (JOIN, GROUP BY, CTE, window functions) | ~90% | Teste técnico online / live coding |
| 🥈 2 | **Power BI** (Power Query, modelagem, DAX básico) | ~70% | Case para casa: “monte um dashboard” |
| 🥉 3 | **Excel/Sheets** (PROCV/XLOOKUP, tabela dinâmica) | ~60% | Pergunta rápida ou case |
| 4 | **Python + Pandas** | ~50% (diferencial forte) | Case de limpeza/EDA em notebook |
| 5 | **Estatística básica** | implícito | Perguntas conceituais e no case |
| 6 | **Comunicação / storytelling** | 100% | Apresentação do case, entrevista comportamental |

> 🔎 **Valide você mesmo (tarefa da semana 1, +30 XP):** leia 20 vagas júnior no LinkedIn/Gupy da sua cidade e conte quantas pedem cada item. Os percentuais acima são uma estimativa; o seu mercado local é o que manda.

> **Por que Power BI e não Tableau?** No Brasil, Power BI domina as vagas júnior (ecossistema Microsoft nas empresas). Aprenda **um** bem; o conceito transfere para o outro em uma semana.

## 🚫 Ruído: o que NÃO estudar agora

| Tentação | Por que adiar |
|---|---|
| Machine Learning / Deep Learning | É outra carreira (Cientista de Dados). Não é cobrado de analista júnior. |
| Spark, Airflow, Kafka, Docker | Engenharia de dados. Fica para depois da 1ª vaga. |
| Certificações de nuvem (AWS/Azure/GCP) | Pouco peso para júnior sem experiência prática. |
| Aprender R **e** Python | Escolha um: Python. |
| Power BI **e** Tableau **e** Looker | Escolha um: Power BI. |
| 5 cursos longos em paralelo | Gera sensação de progresso sem habilidade real. **Faça > assista.** |
| Matemática/estatística “de faculdade” | Você precisa de estatística **aplicada**: média × mediana, distribuição, correlação, teste A/B. |

---

## BLOCO 1 (Meses 1–3): Fundação “Consigo responder perguntas de negócio”

### Mês 1: SQL Fundamentos + Estatística Descritiva
- `SELECT`, filtros, agregações, `GROUP BY`/`HAVING`, datas, JOINs, `CASE WHEN`, subqueries, CTEs
- Estatística: média, mediana, moda, desvio padrão, quartis, outliers (IQR)
- Modelagem: PK, FK, cardinalidade, diagrama ER
- 🎯 **Projeto 1:** Raio-X de Vendas em SQL · ➡️ [Lições detalhadas](../mes-01/README.md)

### Mês 2: SQL Intermediário + Excel/Sheets + Modelagem Dimensional
- **Window functions** (`ROW_NUMBER`, `RANK`, `LAG/LEAD`, soma acumulada, média móvel): **o que mais diferencia candidatos em testes**
- Tratamento de texto/NULL, `UNION`, `COALESCE`, casts; boas práticas de legibilidade
- Excel/Sheets: `XLOOKUP`/`PROCV`, `SE`, `SOMASES`, tabela dinâmica, gráfico dinâmico, formatação condicional
- **Modelagem dimensional:** fato × dimensão, *star schema*, granularidade, tabela calendário
- Prática: 40 problemas no DataLemur/StrataScratch/LeetCode (SQL 50)
- 🎯 **Projeto 2:** Análise de coortes e retenção em SQL (dataset real: Olist, e-commerce brasileiro do Kaggle)

### Mês 3: Power BI
- Power Query (ETL: tipos, mesclar, acrescentar, colunas condicionais)
- Modelagem no Power BI: relacionamentos 1:N, star schema, tabela calendário
- DAX essencial: `SUM`, `CALCULATE`, `FILTER`, `DIVIDE`, time intelligence (`SAMEPERIODLASTYEAR`, `TOTALYTD`)
- Design de dashboards: hierarquia visual, KPIs no topo, 1 pergunta por página
- Publicação no Power BI Service (conta gratuita) / exportar para PDF + prints no GitHub
- 🎯 **Projeto 3:** Dashboard executivo de vendas (Olist ou dados públicos)
- 🏁 **Marco do Bloco 1:** passar em um teste de SQL “nível entrevista” de 60 min e ter 3 projetos no GitHub

---

## BLOCO 2 (Meses 4–6): Diferenciação e Empregabilidade “Sou contratável”

### Mês 4: Python + Pandas
- Python essencial para dados (tipos, listas, dicionários, funções, loops, list comprehension): **só o necessário**
- Pandas: ler CSV/Excel, `loc/iloc`, filtros, `groupby`, `merge`, `pivot_table`, datas, tratamento de NULL/duplicados
- Visualização: Matplotlib/Seaborn (os 5 gráficos que resolvem 90% dos casos)
- Tudo no **Google Colab** e versionado no GitHub
- 🎯 **Projeto 4:** Limpeza + EDA de dados públicos brasileiros (ex.: dados.gov.br, IBGE, ANP, DataSUS)

### Mês 5: Estatística Aplicada + Análise de Negócio
- Distribuições, amostragem, intervalo de confiança (intuição, não prova)
- Correlação ≠ causalidade · **Teste A/B** (hipóteses, p-valor, significância prática)
- Métricas de negócio: funil, conversão, churn, LTV, CAC, NPS, coortes, RFM
- **Streamlit:** transformar uma análise em app interativo (grande diferencial no portfólio)
- 🎯 **Projeto 5:** Análise de teste A/B + app Streamlit publicado

### Mês 6: Projeto Final + Máquina de Entrevistas
- 🎯 **Projeto 6 (Capstone):** ponta a ponta: SQL (extração) → Python (tratamento) → Power BI (dashboard) → apresentação de 5 min em vídeo
- Portfólio: README impecável, GitHub organizado, LinkedIn otimizado (título, sobre, destaques)
- Treino de entrevista: 2 simulados de SQL/semana, cases, método STAR para perguntas comportamentais
- **Candidaturas:** começam no **mês 5** (3–5 por semana) e sobem para **10 por semana** no mês 6. Esperar se sentir “100% pronto” é o erro mais comum, e cada entrevista é treino.
- 🏁 **Marco final:** 6 projetos, ~12.000 XP, 100+ problemas de SQL resolvidos, perfil pronto

---

## 📊 Distribuição do esforço

```
Mês:        1     2     3     4     5     6
SQL       ████  ███   █     █     █     ██    (revisão contínua até o fim)
Excel           ██
Power BI        █     ████              █
Python                      ████  ██    █
Estatíst.  █               █     ██
Modelagem  █    █     █
Portfólio  █    █     █     █     ██    ████
Entrevista                        █     ███
```

**Regra de manutenção:** a partir do mês 2, **15 min/dia** de revisão de SQL (Anki + 1 exercício antigo) nunca saem da rotina. SQL é o que reprova ou aprova no teste técnico.
