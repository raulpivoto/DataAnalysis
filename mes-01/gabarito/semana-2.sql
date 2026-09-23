-- GABARITO SEMANA 2 — Agregações e estatística descritiva
-- Honestidade: só olhe depois de tentar (pelo menos 2 tentativas ou 10 min).

-- @ex 2.1 xp=10
SELECT COUNT(*) AS total_clientes FROM clientes;

-- @ex 2.2 xp=20
SELECT COUNT(*) AS total, COUNT(email) AS com_email FROM clientes;

-- @ex 2.3 xp=10
SELECT MIN(preco) AS minimo, MAX(preco) AS maximo, ROUND(AVG(preco), 2) AS media
FROM produtos;

-- @ex 2.4 xp=10
SELECT ROUND(SUM(quantidade * preco_unitario), 2) AS faturamento_bruto FROM itens_pedido;

-- @ex 2.5 xp=10
SELECT estado, COUNT(*) AS clientes
FROM clientes
GROUP BY estado
ORDER BY clientes DESC, estado;

-- @ex 2.6 xp=10
SELECT status, COUNT(*) AS pedidos FROM pedidos GROUP BY status;

-- @ex 2.7 xp=20
SELECT categoria, COUNT(*) AS qtd_produtos, ROUND(AVG(preco), 2) AS preco_medio
FROM produtos
GROUP BY categoria
ORDER BY preco_medio DESC;

-- @ex 2.8 xp=20
SELECT produto_id, SUM(quantidade * preco_unitario) AS receita
FROM itens_pedido
GROUP BY produto_id
ORDER BY receita DESC
LIMIT 5;

-- @ex 2.9 xp=10
SELECT categoria, COUNT(*) AS qtd_produtos
FROM produtos
GROUP BY categoria
HAVING COUNT(*) > 4;

-- @ex 2.10 xp=20
SELECT cliente_id, COUNT(*) AS pedidos
FROM pedidos
GROUP BY cliente_id
HAVING COUNT(*) >= 20
ORDER BY pedidos DESC, cliente_id;

-- @ex 2.11 xp=20
SELECT pedido_id, COUNT(*) AS itens
FROM itens_pedido
GROUP BY pedido_id
HAVING COUNT(*) >= 4
ORDER BY pedido_id;

-- @ex 2.12 xp=10
SELECT YEAR(data_pedido) AS ano, COUNT(*) AS pedidos
FROM pedidos
GROUP BY ano
ORDER BY ano;

-- @ex 2.13 xp=10
SELECT MONTH(data_pedido) AS mes, COUNT(*) AS pedidos
FROM pedidos
WHERE YEAR(data_pedido) = 2025
GROUP BY mes
ORDER BY mes;

-- @ex 2.14 xp=20
SELECT ISODOW(data_pedido) AS dia_semana, COUNT(*) AS pedidos
FROM pedidos
GROUP BY dia_semana
ORDER BY dia_semana;

-- @ex 2.15 xp=20
SELECT DATE_TRUNC('month', data_pedido) AS mes, COUNT(*) AS pedidos
FROM pedidos
WHERE YEAR(data_pedido) = 2024
GROUP BY mes
ORDER BY mes;

-- @ex 2.16 xp=20
SELECT ROUND(AVG(quantidade * preco_unitario), 2) AS media,
       ROUND(MEDIAN(quantidade * preco_unitario), 2) AS mediana
FROM itens_pedido;

-- @ex 2.17 xp=20
SELECT ROUND(AVG(frete), 2) AS media,
       ROUND(MEDIAN(frete), 2) AS mediana,
       ROUND(STDDEV_SAMP(frete), 2) AS desvio_padrao
FROM pedidos
WHERE frete > 0;

-- @ex 2.18 xp=10
SELECT nota, COUNT(*) AS avaliacoes FROM avaliacoes GROUP BY nota ORDER BY nota;

-- @ex 2.19 xp=10
SELECT forma_pagamento, COUNT(*) AS pedidos
FROM pedidos
GROUP BY forma_pagamento
ORDER BY pedidos DESC
LIMIT 1;

-- ================= BOSS FIGHT 2 =================

-- @ex B2.1 xp=30
SELECT forma_pagamento, status, COUNT(*) AS pedidos
FROM pedidos
GROUP BY forma_pagamento, status
HAVING COUNT(*) >= 20
ORDER BY forma_pagamento, pedidos DESC;

-- @ex B2.2 xp=30
SELECT MONTH(data_pedido) AS mes, COUNT(*) AS pedidos
FROM pedidos
WHERE YEAR(data_pedido) = 2025
GROUP BY mes
ORDER BY pedidos DESC
LIMIT 1;

-- @ex B2.3 xp=30
SELECT canal_aquisicao, COUNT(*) AS clientes,
       MIN(data_cadastro) AS primeiro_cadastro, MAX(data_cadastro) AS ultimo_cadastro
FROM clientes
GROUP BY canal_aquisicao
ORDER BY clientes DESC;

-- @ex B2.4 xp=30
SELECT produto_id, SUM(quantidade) AS unidades
FROM itens_pedido
GROUP BY produto_id
ORDER BY unidades DESC
LIMIT 3;

-- @ex B2.5 xp=30
SELECT ROUND(QUANTILE_CONT(preco, 0.25), 2) AS q1,
       ROUND(MEDIAN(preco), 2) AS mediana,
       ROUND(QUANTILE_CONT(preco, 0.75), 2) AS q3
FROM produtos;
