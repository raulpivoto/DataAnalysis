# 📅 Mês 1: SQL Fundamentos + Estatística Descritiva

> **Ao final deste mês você vai:** consultar, filtrar, agregar e cruzar tabelas com SQL; calcular e interpretar estatísticas descritivas; e publicar seu **primeiro projeto de portfólio**.

## Mapa do mês

| Semana | Tema | Lições | Boss | Entregável |
|---|---|---|---|---|
| [1](semana-1.md) | Fundamentos do `SELECT` | L1–L5 · 19 exercícios | ⚔️ O Gerente Apressado | Pesquisa de 20 vagas (+30 XP) |
| [2](semana-2.md) | Agregações + estatística descritiva | L6–L10 · 19 exercícios | ⚔️ Reunião de Resultados | 3 insights no diário (+50 XP) |
| [3](semana-3.md) | Modelagem relacional, JOINs, `CASE` | L11–L15 · 18 exercícios | ⚔️ O Diretor Comercial | Diagrama ER (+30 XP) |
| [4](semana-4.md) | Subqueries, CTEs, outliers + projeto | L16–L20 · 12 exercícios | 🏆 Prova do Mês | **Projeto 1** (+150 XP) |

**Total:** 68 exercícios + 20 questões de Boss, todos com correção automática · ~2.000 XP possíveis.

## A base de treino: LojaData 🛒

E-commerce fictício de eletrônicos (dados sintéticos, gerados por `dados/criar_banco.py`), 2024–2025:

| Tabela | Linhas | Colunas principais |
|---|---|---|
| `clientes` | 500 | `cliente_id`, `nome`, `email`, `cidade`, `estado`, `data_cadastro`, `canal_aquisicao` |
| `produtos` | 40 | `produto_id`, `nome`, `categoria`, `preco`, `custo` |
| `pedidos` | 3.000 | `pedido_id`, `cliente_id`, `data_pedido`, `status`, `forma_pagamento`, `frete` |
| `itens_pedido` | 5.090 | `pedido_id`, `produto_id`, `quantidade`, `preco_unitario`, `desconto_pct` |
| `avaliacoes` | 1.395 | `pedido_id`, `nota` (1–5), `data_avaliacao` |

Ela tem “sujeiras” de propósito, como no mundo real: e-mails e cidades nulos, clientes que nunca compraram, produtos nunca vendidos, pedidos sem avaliação e sazonalidade forte de Black Friday e Natal.

## O ciclo de cada exercício

```
 ler o desafio ─► escrever mes-01/solucoes/2.7.sql ─► python checar.py 2.7
                                                         │
                          ❌ dica do que está errado ◄───┤
                          ✅ +20 XP, registrado     ◄───┘
```

- O corretor compara o **resultado**, não o texto: qualquer query que chegue à resposta certa vale.
- Os nomes das colunas (aliases) não importam; **a ordem das colunas importa**, então siga a ordem pedida no enunciado.
- Se o enunciado pede ordenação, a ordem das linhas também é verificada.
- **Gabarito** em `gabarito/`. Regra de honra: só depois de 2 tentativas ou 10 minutos.

## Critério para desbloquear o Mês 2 🔓
- [ ] Prova do Mês: ≥ 4/6
- [ ] Projeto 1 publicado no GitHub
- [ ] Ofensiva de pelo menos 18 dos 24 dias de estudo
- [ ] Checklist de domínio da [semana 4](semana-4.md#-domingo--retrospectiva-do-mês-1-30-min) completo
