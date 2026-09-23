-- GABARITO SEMANA 4 — Subqueries, CTEs e estatística de distribuição
-- Honestidade: só olhe depois de tentar (pelo menos 2 tentativas ou 10 min).

-- @ex 4.1 xp=10
SELECT nome, preco
FROM produtos
WHERE preco > (SELECT AVG(preco) FROM produtos)
ORDER BY preco DESC;

-- @ex 4.2 xp=20
SELECT COUNT(*) AS clientes
FROM clientes
WHERE cliente_id IN (
    SELECT cliente_id FROM pedidos
    WHERE data_pedido BETWEEN '2025-12-01' AND '2025-12-31'
);

-- @ex 4.3 xp=20
SELECT ROUND(AVG(valor_pedido), 2) AS ticket_medio
FROM (
    SELECT i.pedido_id, SUM(i.quantidade * i.preco_unitario) AS valor_pedido
    FROM itens_pedido AS i
    JOIN pedidos AS p ON p.pedido_id = i.pedido_id
    WHERE p.status <> 'cancelado'
    GROUP BY i.pedido_id
) AS t;

-- @ex 4.4 xp=20
SELECT pedido_id, SUM(quantidade * preco_unitario) AS total
FROM itens_pedido
GROUP BY pedido_id
ORDER BY total DESC
LIMIT 1;

-- @ex 4.5 xp=20
WITH valor_por_pedido AS (
    SELECT pedido_id, SUM(quantidade * preco_unitario) AS valor
    FROM itens_pedido
    GROUP BY pedido_id
)
SELECT CASE
         WHEN valor < 200 THEN '1. até R$199'
         WHEN valor < 1000 THEN '2. R$200 a R$999'
         ELSE '3. R$1000+'
       END AS faixa,
       COUNT(*) AS pedidos
FROM valor_por_pedido
GROUP BY faixa
ORDER BY faixa;

-- @ex 4.6 xp=30
WITH gasto AS (
    SELECT p.cliente_id, SUM(i.quantidade * i.preco_unitario) AS total
    FROM pedidos AS p
    JOIN itens_pedido AS i ON i.pedido_id = p.pedido_id
    WHERE p.status = 'entregue'
    GROUP BY p.cliente_id
)
SELECT CASE
         WHEN total >= 10000 THEN 'VIP'
         WHEN total >= 3000 THEN 'Recorrente'
         ELSE 'Ocasional'
       END AS segmento,
       COUNT(*) AS clientes
FROM gasto
GROUP BY segmento;

-- @ex 4.7 xp=30
WITH receita_mensal AS (
    SELECT MONTH(p.data_pedido) AS mes, SUM(i.quantidade * i.preco_unitario) AS receita
    FROM pedidos AS p
    JOIN itens_pedido AS i ON i.pedido_id = p.pedido_id
    WHERE YEAR(p.data_pedido) = 2025 AND p.status <> 'cancelado'
    GROUP BY mes
)
SELECT mes, receita
FROM receita_mensal
WHERE receita > (SELECT AVG(receita) FROM receita_mensal)
ORDER BY mes;

-- @ex 4.8 xp=30
WITH compradores_2024 AS (
    SELECT DISTINCT cliente_id FROM pedidos WHERE YEAR(data_pedido) = 2024
),
compradores_2025 AS (
    SELECT DISTINCT cliente_id FROM pedidos WHERE YEAR(data_pedido) = 2025
)
SELECT COUNT(*) AS clientes_retidos
FROM compradores_2024 AS a
JOIN compradores_2025 AS b ON a.cliente_id = b.cliente_id;

-- @ex 4.9 xp=20
WITH valor_por_pedido AS (
    SELECT pedido_id, SUM(quantidade * preco_unitario) AS valor
    FROM itens_pedido
    GROUP BY pedido_id
)
SELECT ROUND(QUANTILE_CONT(valor, 0.25), 2) AS q1,
       ROUND(MEDIAN(valor), 2) AS mediana,
       ROUND(QUANTILE_CONT(valor, 0.75), 2) AS q3
FROM valor_por_pedido;

-- @ex 4.10 xp=30
WITH valor_por_pedido AS (
    SELECT pedido_id, SUM(quantidade * preco_unitario) AS valor
    FROM itens_pedido
    GROUP BY pedido_id
),
quartis AS (
    SELECT QUANTILE_CONT(valor, 0.25) AS q1, QUANTILE_CONT(valor, 0.75) AS q3
    FROM valor_por_pedido
)
SELECT ROUND(q1, 2) AS q1, ROUND(q3, 2) AS q3,
       ROUND(q3 - q1, 2) AS iqr,
       ROUND(q3 + 1.5 * (q3 - q1), 2) AS limite_superior
FROM quartis;

-- @ex 4.11 xp=30
WITH valor_por_pedido AS (
    SELECT pedido_id, SUM(quantidade * preco_unitario) AS valor
    FROM itens_pedido
    GROUP BY pedido_id
),
limite AS (
    SELECT QUANTILE_CONT(valor, 0.75)
           + 1.5 * (QUANTILE_CONT(valor, 0.75) - QUANTILE_CONT(valor, 0.25)) AS lim
    FROM valor_por_pedido
)
SELECT COUNT(*) AS pedidos_outliers
FROM valor_por_pedido, limite
WHERE valor > lim;

-- @ex 4.12 xp=20
WITH valor_por_pedido AS (
    SELECT p.pedido_id, p.forma_pagamento, SUM(i.quantidade * i.preco_unitario) AS valor
    FROM pedidos AS p
    JOIN itens_pedido AS i ON i.pedido_id = p.pedido_id
    GROUP BY p.pedido_id, p.forma_pagamento
)
SELECT forma_pagamento,
       ROUND(AVG(valor), 2) AS media,
       ROUND(MEDIAN(valor), 2) AS mediana
FROM valor_por_pedido
GROUP BY forma_pagamento
ORDER BY forma_pagamento;

-- ================= BOSS FINAL — PROVA DO MÊS =================

-- @ex B4.1 xp=40
SELECT QUARTER(p.data_pedido) AS trimestre,
       COUNT(DISTINCT p.pedido_id) AS pedidos,
       SUM(i.quantidade * i.preco_unitario) AS receita
FROM pedidos AS p
JOIN itens_pedido AS i ON i.pedido_id = p.pedido_id
WHERE YEAR(p.data_pedido) = 2025 AND p.status = 'entregue'
GROUP BY trimestre
ORDER BY trimestre;

-- @ex B4.2 xp=40
SELECT pr.categoria,
       SUM((i.preco_unitario - pr.custo) * i.quantidade) AS margem_bruta
FROM itens_pedido AS i
JOIN produtos AS pr ON pr.produto_id = i.produto_id
JOIN pedidos AS p ON p.pedido_id = i.pedido_id
WHERE p.status = 'entregue'
GROUP BY pr.categoria
ORDER BY margem_bruta DESC
LIMIT 3;

-- @ex B4.3 xp=40
WITH pedidos_por_cliente AS (
    SELECT cliente_id, COUNT(*) AS pedidos
    FROM pedidos
    GROUP BY cliente_id
)
SELECT ROUND(100.0 * SUM(CASE WHEN pedidos >= 2 THEN 1 ELSE 0 END) / COUNT(*), 1)
         AS taxa_recompra
FROM pedidos_por_cliente;

-- @ex B4.4 xp=40
SELECT c.canal_aquisicao,
       COUNT(DISTINCT c.cliente_id) AS clientes,
       COUNT(DISTINCT p.cliente_id) AS compradores,
       ROUND(100.0 * COUNT(DISTINCT p.cliente_id) / COUNT(DISTINCT c.cliente_id), 1) AS conversao
FROM clientes AS c
LEFT JOIN pedidos AS p ON p.cliente_id = c.cliente_id
GROUP BY c.canal_aquisicao
ORDER BY conversao DESC;

-- @ex B4.5 xp=40
SELECT pr.nome, COUNT(*) AS avaliacoes_ruins
FROM avaliacoes AS a
JOIN itens_pedido AS i ON i.pedido_id = a.pedido_id
JOIN produtos AS pr ON pr.produto_id = i.produto_id
WHERE a.nota <= 2
GROUP BY pr.nome
ORDER BY avaliacoes_ruins DESC, pr.nome
LIMIT 3;

-- @ex B4.6 xp=40
WITH valor_por_pedido AS (
    SELECT p.pedido_id, ISODOW(p.data_pedido) AS dia_semana,
           SUM(i.quantidade * i.preco_unitario) AS valor
    FROM pedidos AS p
    JOIN itens_pedido AS i ON i.pedido_id = p.pedido_id
    WHERE p.status <> 'cancelado'
    GROUP BY p.pedido_id, dia_semana
)
SELECT dia_semana, ROUND(AVG(valor), 2) AS ticket_medio
FROM valor_por_pedido
GROUP BY dia_semana
ORDER BY ticket_medio DESC
LIMIT 1;
