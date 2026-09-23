# 🏛️ Arquitetura da Plataforma de Estudos (custo: R$ 0)

Pense no seu estudo como um **sistema de dados**: tem fontes (conteúdo), processamento (prática), armazenamento (GitHub) e camada de apresentação (painel, portfólio).

```
┌──────────────── CONTEÚDO (entrada) ────────────────┐
│ Lições deste repo · SQLBolt · Kaggle Learn ·        │
│ Microsoft Learn (PL-300) · docs DuckDB/Pandas       │
└──────────────────────┬─────────────────────────────┘
                       ▼
┌──────────────── PRÁTICA (processamento) ───────────┐
│ DuckDB local/DBeaver  →  checar.py (feedback)      │
│ Google Colab (Python) · Power BI Desktop           │
│ DataLemur / StrataScratch / LeetCode (SQL extra)   │
└──────────────────────┬─────────────────────────────┘
                       ▼
┌──────────────── MEMÓRIA (retenção) ────────────────┐
│ Anki (conceitos)  ·  Leitner (exercícios)          │
└──────────────────────┬─────────────────────────────┘
                       ▼
┌──────────── REGISTRO / "BANCO" (GitHub) ───────────┐
│ solucoes/*.sql · progresso/xp_log.csv · projetos   │
│ → commits diários = ofensiva pública               │
└──────────────────────┬─────────────────────────────┘
                       ▼
┌──────────────── APRESENTAÇÃO ──────────────────────┐
│ xp.py (painel) · Notion (planejamento) ·           │
│ Streamlit (dashboard de progresso, mês 5) ·        │
│ GitHub Profile + LinkedIn (vitrine p/ recrutador)  │
└────────────────────────────────────────────────────┘
```

## Ferramentas por função

| Função | Ferramenta | Custo | Por que esta |
|---|---|---|---|
| **Hub central / versionamento** | **GitHub** (este repo) | Grátis | Vira o próprio portfólio; commits = ofensiva visível para recrutadores |
| **Motor SQL** | **DuckDB** + DBeaver Community | Grátis | Sintaxe próxima do PostgreSQL, roda local sem servidor, super rápido |
| **Feedback imediato** | `checar.py` (este repo) | Grátis | Sensação de DataCamp: ✅/❌ + XP |
| **Gamificação** | `xp.py` (este repo) | Grátis | XP, níveis, ofensiva, conquistas |
| **Python na nuvem** | **Google Colab** | Grátis | Zero instalação, roda até no computador fraco |
| **BI** | **Power BI Desktop** | Grátis (Windows) | Padrão de mercado no Brasil. *No Mac: use máquina virtual Windows, ou Looker Studio como plano B.* |
| **Repetição espaçada** | **Anki** / AnkiDroid | Grátis (iOS é pago) | Algoritmo SRS comprovado |
| **Planejamento semanal** | **Notion** (ou GitHub Projects) | Grátis | Quadro Kanban: A fazer / Fazendo / Feito / Revisar |
| **App de portfólio** | **Streamlit Community Cloud** | Grátis | Publica apps Python com 1 clique a partir do GitHub |
| **Prática extra de SQL** | SQLBolt, SQL Murder Mystery, DataLemur, StrataScratch, LeetCode SQL 50, HackerRank | Grátis (planos básicos) | Exercícios estilo entrevista |
| **Conteúdo guiado** | Kaggle Learn (SQL, Pandas), Microsoft Learn (trilha PL-300 de Power BI), documentação oficial | Grátis | Curto, prático, com certificados |
| **Dados reais** | Kaggle (Olist), dados.gov.br, IBGE, BigQuery Sandbox (datasets públicos) | Grátis | Projetos com cara de mundo real |

> 💰 **Se quiser pagar por algo (opcional):** 1 mês de DataCamp ou similar **no mês 4** (Python) pode acelerar. Não é necessário.

## Setup do Notion (15 min, opcional)

Crie uma página “🎓 Jornada Analista de Dados” com:
1. **Database “Lições”:** propriedades `Mês`, `Semana`, `Status` (A fazer/Feito/Revisar), `Data`, `XP`, `Dificuldade sentida (1–5)`.
2. **Database “Leitner”:** `Exercício`, `Caixa` (1–4), `Próxima revisão` (data). Filtro da visão “Hoje”: `Próxima revisão ≤ hoje`.
3. **Database “Candidaturas”** (meses 5–6): `Empresa`, `Vaga`, `Status`, `Data`, `Próximo passo`.
4. **Página “Diário de bordo”:** 3 linhas por dia: *o que aprendi · onde travei · o que farei amanhã*.

> Regra para não virar procrastinação produtiva: **no máximo 15 minutos por semana** mexendo em Notion. O XP oficial mora no `xp.py`.

## Evolução da plataforma ao longo dos meses

| Mês | Upgrade na sua plataforma |
|---|---|
| 1 | GitHub + DuckDB + `checar.py` + `xp.py` + Anki |
| 2 | Crie seus próprios exercícios de window functions no formato `-- @ex` do gabarito (ensinar é aprender) |
| 3 | Importe `progresso/xp_log.csv` no **Power BI** e faça o dashboard da sua própria jornada 🤯 |
| 4 | Reescreva o `xp.py` em Pandas (ótimo exercício) |
| 5 | Publique um **app Streamlit** com seu painel de progresso + seus projetos: vira link no currículo |
| 6 | README de perfil do GitHub apontando para tudo |

A ideia é que **a própria plataforma de estudos vire portfólio**: você usa as ferramentas que está aprendendo para medir o seu aprendizado.
