# 🦉 Metodologia “Estilo Duolingo/DataCamp”

O que torna o Duolingo e o DataCamp eficazes não é o app, e sim **4 mecanismos**. Este plano reproduz os quatro:

| Mecanismo | No Duolingo/DataCamp | Aqui |
|---|---|---|
| **Microlearning** | lições de 5–10 min | Conceito em **10 min**, direto ao código |
| **Feedback imediato** | ✅/❌ na hora | `python checar.py` corrige sua query em 1 segundo |
| **Repetição espaçada** | revisão de palavras “fracas” | Anki (conceitos) + Leitner (exercícios) |
| **Gamificação** | XP, ofensiva, ligas, conquistas | `python xp.py`: XP, níveis, ofensiva, conquistas, Boss Fights |

---

## ⏱️ A sessão diária (60 min: o “mínimo que conta”)

| Bloco | Tempo | O que fazer | Princípio |
|---|---|---|---|
| 🔁 **Aquecimento** | 5 min | Anki + refazer 1 exercício antigo **sem olhar** | Recuperação ativa |
| 📖 **Micro-conceito** | 10 min | Ler **um** conceito da lição e rodar o exemplo | Microlearning |
| 💻 **Mão na massa** | 35 min | Resolver os desafios; checar cada um | Prática deliberada + feedback |
| 🧠 **Fixação** | 5 min | Criar 2–3 flashcards **com suas palavras** | Elaboração |
| ✅ **Fechamento** | 5 min | `git commit` + `python xp.py registrar anki` | Hábito + ofensiva visível |

**Dias de 2 h:** os 60 min extras vão para **projeto de portfólio** ou **problemas extras** (DataLemur/StrataScratch). Nunca para “assistir mais aula”.

### Semana-tipo
| Seg–Sex | Sábado | Domingo |
|---|---|---|
| 1 lição/dia | ⚔️ **Boss Fight** (simulado cronometrado) + Leitner | 😴 Folga, que **não quebra a ofensiva** (1 folga/semana) |

---

## 🔁 Repetição espaçada na prática

### 1. Anki: para **conceitos** (“o que é”, “quando usar”)
- Baixe o [Anki](https://apps.ankiweb.net/) (grátis no PC/Android; AnkiDroid) e importe `anki/mes-01.csv` (Arquivo → Importar, separador `;`).
- Adicione 2–3 cartões **seus** por lição. Cartão bom = pergunta curta, resposta curta.
- 5 min por dia, **todo dia**. O algoritmo decide os intervalos.

### 2. Sistema Leitner: para **exercícios** (“sei fazer?”)
Crie `progresso/leitner.md` com 4 caixas:

| Caixa | Refazer em | Entra aqui quando… |
|---|---|---|
| 📦 1 | 1 dia | errou ou demorou > 10 min |
| 📦 2 | 3 dias | acertou a revisão da caixa 1 |
| 📦 3 | 7 dias | acertou a revisão da caixa 2 |
| 📦 4 | 21 dias | acertou a da caixa 3 → depois disso, **dominado** 🏅 |

Errou numa revisão? **Volta para a caixa 1.** Cada revisão: apague sua solução antiga, refaça do zero, `python checar.py <id>`, e `python xp.py registrar revisao <id>` (+10 XP).

> As lições já trazem o aquecimento “refaça o exercício X”, que é o Leitner pré-programado nos intervalos 1 → 3 → 7 dias.

---

## 🎮 Sistema de gamificação

### XP
| Atividade | XP |
|---|---|
| Exercício ⭐ / ⭐⭐ / ⭐⭐⭐ (1ª vez correto) | 10 / 20 / 30 |
| Boss Fight (cada questão) | 30–40 |
| Revisão Leitner | 10 |
| Anki diário / leitura curta | 5 |
| Entregável de projeto | 30–150 |

**Meta semanal:** 350 XP (a barra do painel mostra). Mês 1 completo ≈ 2.000–2.300 XP.

### Níveis
| XP | Nível |
|---|---|
| 0 | 🌱 Estagiário de Planilha |
| 500 | 🔎 Aprendiz de SELECT |
| 1.500 | 🔗 Domador de JOINs |
| 3.000 | 📊 Mestre dos Agregados |
| 5.000 | 🐼 Treinador de Pandas |
| 8.000 | 📈 Contador de Histórias com Dados |
| 12.000 | 🚀 Analista Júnior Pronto |

### Ofensiva (streak) 🔥
Qualquer XP no dia conta. Você tem **1 folga por semana** que não quebra a ofensiva (é o domingo, ou um dia ruim).

### Ligas (opcional, social)
Chame 1–3 amigos que também estudam dados, cada um com seu fork. Todo domingo, comparem o XP da semana num grupo. Quem ficar em último escolhe o dataset do próximo desafio. **Accountability é o mecanismo mais forte de todos.**

---

## 🧱 Micro-hábitos (para não quebrar a corrente)

1. **Âncora fixa:** “Depois do café da manhã / ao chegar em casa, abro o notebook.” Mesmo horário, mesmo lugar.
2. **Regra dos 2 minutos:** em dia péssimo, faça **só** o Anki + 1 exercício antigo. Conta como dia. A ofensiva sobrevive, e o hábito também.
3. **Deixe pronto na véspera:** o arquivo da próxima solução já criado, a aba da lição já aberta.
4. **Nunca dois dias sem estudar** (fora a folga).
5. **Sinal visível:** o gráfico de contribuições do GitHub (quadradinhos verdes) é sua ofensiva pública, e recrutadores olham.
6. **Recompensa real:** a cada Boss vencido, algo que você gosta (série, doce, jogo).

## 🚨 Anti-padrões
- ❌ Assistir aula sem digitar código → ✅ pausar e reproduzir tudo
- ❌ Olhar o gabarito depois de 2 min → ✅ regra: 2 tentativas ou 10 min
- ❌ Copiar e colar → ✅ digitar sempre (memória motora)
- ❌ “Vou compensar no fim de semana” → ✅ consistência > intensidade
