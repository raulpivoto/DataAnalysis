# 🎓 DataAnalysis: de zero a Analista de Dados Júnior em 6 meses

Plano de estudos **gamificado** (estilo Duolingo/DataCamp) com microlearning, repetição espaçada e **correção automática de exercícios**. Para quem estuda 1 a 2 horas por dia.

```
$ python checar.py 3.7
  ✅ 3.7: correto! +20 XP 🎉

$ python xp.py
══════════ SEU PAINEL ══════════
 Nível:     🔗 Domador de JOINs
 XP total:  1620
 Próximo:   📊 Mestre dos Agregados  [█░░░░░░░░░░░░░░░░░░░░░░░] faltam 1380 XP
 Hoje:      45 XP ✅
 Semana:    [████████████████░░░░░░░░] 240/350 XP
 Ofensiva:  🔥 17 dia(s)
════════════════════════════════
```

## 🌐 Estudar direto no navegador

**[Trilha do Analista](https://claude.ai/artifact/GjtQF6u7i2qM2dWffoLSid)**: o Mês 1 inteiro como site no estilo Duolingo, sem instalar nada. Tem lições, editor SQL com correção na hora, XP, ofensiva, revisão espaçada e cartões de memória. O código-fonte do site fica em `site/` (para regerar: `python site/exportar_dados.py && python site/build.py`).

## 📚 O plano

| # | Documento | Conteúdo |
|---|---|---|
| 1 | [Roadmap de 6 meses](docs/01-roadmap.md) | 2 blocos de 3 meses, prioridades do mercado e o que **não** estudar |
| 2 | [Metodologia](docs/02-metodologia.md) | Rotina diária, repetição espaçada, micro-hábitos, sistema de XP |
| 3 | [Arquitetura da plataforma](docs/03-arquitetura.md) | Ferramentas gratuitas e como elas se conectam |
| 4 | [Portfólio](docs/04-portfolio.md) | 6 projetos, um por mês, e como usá-los na entrevista |
| ▶️ | **[Mês 1: lições práticas](mes-01/README.md)** | 20 lições, 68 exercícios, 4 Boss Fights, Projeto 1 |

## 🚀 Começando em 10 minutos

### Opção A: no seu computador
```bash
git clone https://github.com/<seu-usuario>/DataAnalysis.git
cd DataAnalysis
pip install -r requirements.txt
python dados/criar_banco.py      # cria dados/loja.duckdb
python xp.py                     # seu painel (vazio por enquanto 😉)
```

### Opção B: no Google Colab (sem instalar nada)
Numa célula do Colab:
```python
!git clone https://github.com/<seu-usuario>/DataAnalysis.git
%cd DataAnalysis
!pip install -q -r requirements.txt
!python dados/criar_banco.py
```
Para escrever uma solução e corrigir direto do Colab:
```python
%%writefile mes-01/solucoes/1.1.sql
SELECT * FROM produtos;
```
```python
!python checar.py 1.1
```
> ⚠️ No Colab, os arquivos somem ao fechar a sessão. Faça commit/push para o seu GitHub ao final de cada dia (ou use a Opção A).

### Explorar os dados de forma visual
Instale o [DBeaver Community](https://dbeaver.io/) → Nova conexão → **DuckDB** → aponte para `dados/loja.duckdb`. Para rodar queries soltas no Python:
```python
import duckdb
con = duckdb.connect("dados/loja.duckdb", read_only=True)
con.sql("SELECT * FROM pedidos LIMIT 5").df()
```

## 🧰 Comandos

| Comando | O que faz |
|---|---|
| `python checar.py 2.7` | Corrige um exercício (`mes-01/solucoes/2.7.sql`) |
| `python checar.py --semana 2` | Corrige a semana inteira, Boss incluído |
| `python checar.py --todos` | Corrige tudo que você já resolveu |
| `python xp.py` | Mostra nível, XP, ofensiva e conquistas |
| `python xp.py registrar anki` | +5 XP pela revisão diária de flashcards |
| `python xp.py registrar revisao 1.7` | +10 XP por refazer um exercício (Leitner) |
| `python xp.py registrar projeto "erd" --xp 30` | XP de entregáveis de projeto |

## 🗂️ Estrutura

```
├── checar.py              # corretor automático (feedback imediato)
├── xp.py                  # gamificação: XP, níveis, ofensiva, conquistas
├── dados/criar_banco.py   # gera o banco de treino LojaData (DuckDB)
├── anki/mes-01.csv        # flashcards prontos para importar no Anki
├── docs/                  # roadmap, metodologia, arquitetura, portfólio
├── mes-01/
│   ├── semana-1..4.md     # lições
│   ├── gabarito/          # respostas (regra de honra!)
│   ├── solucoes/          # ← SUAS queries vão aqui
│   └── projeto/           # Projeto 1 de portfólio
└── progresso/xp_log.csv   # seu histórico (criado no primeiro XP; commite!)
```

---
*Os dados da LojaData são sintéticos e servem apenas para treino.*
