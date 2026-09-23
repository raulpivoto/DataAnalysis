-- GABARITO SEMANA 3 — JOINs, modelagem relacional e CASE WHEN
-- Honestidade: só olhe depois de tentar (pelo menos 2 tentativas ou 10 min).

-- @ex 3.1 xp=10
SELECT COUNT(*) AS linhas, COUNT(DISTINCT pedido_id) AS pedidos_distintos
FROM itens_pedido;

-- @ex 3.2 xp=10
SELECT COUNT(DISTINCT cliente_id) AS clientes_que_compraram FROM pedidos;

-- @ex 3.3 xp=10
SELECT p.pedido_id, p.data_pedido, c.nome
FROM pedidos AS p
INNER JOIN clientes AS c ON c.cliente_id = p.cliente_id
WHERE p.pedido_id <= 5
ORDER BY p.pedido_id;

-- @ex 3.4 xp=10
SELECT pr.nome, i.quantidade, i.preco_unitario
FROM itens_pedido AS i
JOIN produtos AS pr ON pr.produto_id = i.produto_id
WHERE i.pedido_id = 42;

-- @ex 3.5 xp=20
SELECT pr.categoria, SUM(i.quantidade * i.preco_unitario) AS receita
FROM itens_pedido AS i
JOIN produtos AS pr ON pr.produto_id = i.produto_id
GROUP BY pr.categoria
ORDER BY receita DESC;

-- @ex 3.6 xp=20
SELECT c.estado, COUNT(*) AS pedidos
FROM pedidos AS p
JOIN clientes AS c ON c.cliente_id = p.cliente_id
GROUP BY c.estado
ORDER BY pedidos DESC, c.estado;

-- @ex 3.7 xp=20
SELECT pr.nome
FROM produtos AS pr
LEFT JOIN itens_pedido AS i ON i.produto_id = pr.produto_id
WHERE i.produto_id IS NULL;

-- @ex 3.8 xp=20
SELECT COUNT(*) AS clientes_sem_pedido
FROM clientes AS c
LEFT JOIN pedidos AS p ON p.cliente_id = c.cliente_id
WHERE p.pedido_id IS NULL;

-- @ex 3.9 xp=20
SELECT COUNT(*) AS entregues_sem_avaliacao
FROM pedidos AS p
LEFT JOIN avaliacoes AS a ON a.pedido_id = p.pedido_id
WHERE p.status = 'entregue' AND a.pedido_id IS NULL;

-- @ex 3.10 xp=20
SELECT pr.nome, COALESCE(SUM(i.quantidade), 0) AS unidades
FROM produtos AS pr
LEFT JOIN itens_pedido AS i ON i.produto_id = pr.produto_id
GROUP BY pr.nome
ORDER BY unidades, pr.nome
LIMIT 5;

-- @ex 3.11 xp=20
SELECT c.estado, SUM(i.quantidade * i.preco_unitario) AS receita
FROM clientes AS c
JOIN pedidos AS p ON p.cliente_id = c.cliente_id
JOIN itens_pedido AS i ON i.pedido_id = p.pedido_id
WHERE p.status = 'entregue'
GROUP BY c.estado
ORDER BY receita DESC
LIMIT 5;

-- @ex 3.12 xp=20
SELECT pr.categoria, ROUND(AVG(a.nota), 2) AS nota_media
FROM avaliacoes AS a
JOIN itens_pedido AS i ON i.pedido_id = a.pedido_id
JOIN produtos AS pr ON pr.produto_id = i.produto_id
GROUP BY pr.categoria
ORDER BY nota_media DESC, pr.categoria;

-- @ex 3.13 xp=20
SELECT c.cliente_id, c.nome, SUM(i.quantidade * i.preco_unitario) AS total_gasto
FROM clientes AS c
JOIN pedidos AS p ON p.cliente_id = c.cliente_id
JOIN itens_pedido AS i ON i.pedido_id = p.pedido_id
WHERE p.status = 'entregue'
GROUP BY c.cliente_id, c.nome
ORDER BY total_gasto DESC
LIMIT 5;

-- @ex 3.14 xp=20
SELECT c.canal_aquisicao, SUM(i.quantidade * i.preco_unitario) AS receita
FROM clientes AS c
JOIN pedidos AS p ON p.cliente_id = c.cliente_id
JOIN itens_pedido AS i ON i.pedido_id = p.pedido_id
WHERE YEAR(p.data_pedido) = 2025 AND p.status <> 'cancelado'
GROUP BY c.canal_aquisicao
ORDER BY receita DESC;

-- @ex 3.15 xp=20
SELECT CASE
         WHEN preco < 100 THEN 'Barato'
         WHEN preco < 1000 THEN 'Médio'
         ELSE 'Caro'
       END AS faixa,
       COUNT(*) AS produtos
FROM produtos
GROUP BY faixa;

-- @ex 3.16 xp=20
SELECT forma_pagamento,
       ROUND(100.0 * SUM(CASE WHEN status = 'cancelado' THEN 1 ELSE 0 END) / COUNT(*), 1)
         AS taxa_cancelamento
FROM pedidos
GROUP BY forma_pagamento
ORDER BY taxa_cancelamento DESC;

-- @ex 3.17 xp=20
SELECT CASE MONTH(data_pedido)
         WHEN 11 THEN 'Black Friday'
         WHEN 12 THEN 'Natal'
         ELSE 'Resto do ano'
       END AS periodo,
       COUNT(*) AS pedidos
FROM pedidos
GROUP BY periodo;

-- @ex 3.18 xp=20
SELECT CASE
         WHEN nota = 5 THEN 'Promotor'
         WHEN nota = 4 THEN 'Neutro'
         ELSE 'Detrator'
       END AS perfil,
       COUNT(*) AS avaliacoes
FROM avaliacoes
GROUP BY perfil;

-- ================= BOSS FIGHT 3 =================

-- @ex B3.1 xp=30
SELECT pr.categoria,
       SUM(CASE WHEN YEAR(p.data_pedido) = 2024 THEN i.quantidade * i.preco_unitario ELSE 0 END) AS receita_2024,
       SUM(CASE WHEN YEAR(p.data_pedido) = 2025 THEN i.quantidade * i.preco_unitario ELSE 0 END) AS receita_2025
FROM itens_pedido AS i
JOIN pedidos AS p ON p.pedido_id = i.pedido_id
JOIN produtos AS pr ON pr.produto_id = i.produto_id
WHERE p.status <> 'cancelado'
GROUP BY pr.categoria
ORDER BY pr.categoria;

-- @ex B3.2 xp=30
SELECT DISTINCT c.cliente_id, c.nome
FROM clientes AS c
JOIN pedidos AS p ON p.cliente_id = c.cliente_id
JOIN itens_pedido AS i ON i.pedido_id = p.pedido_id
JOIN produtos AS pr ON pr.produto_id = i.produto_id
WHERE c.estado = 'RJ' AND pr.nome LIKE 'Smart TV%'
ORDER BY c.cliente_id;

-- @ex B3.3 xp=30
SELECT pr.categoria, COUNT(DISTINCT a.pedido_id) AS avaliacoes_negativas
FROM avaliacoes AS a
JOIN itens_pedido AS i ON i.pedido_id = a.pedido_id
JOIN produtos AS pr ON pr.produto_id = i.produto_id
WHERE a.nota <= 2
GROUP BY pr.categoria
HAVING COUNT(DISTINCT a.pedido_id) > 20;

-- @ex B3.4 xp=30
SELECT CASE
         WHEN c.estado IN ('SP', 'RJ', 'MG') THEN 'Sudeste'
         WHEN c.estado IN ('PR', 'SC', 'RS') THEN 'Sul'
         WHEN c.estado IN ('BA', 'PE', 'CE') THEN 'Nordeste'
         ELSE 'Centro-Oeste'
       END AS regiao,
       ROUND(AVG(p.frete), 2) AS frete_medio
FROM pedidos AS p
JOIN clientes AS c ON c.cliente_id = p.cliente_id
GROUP BY regiao
ORDER BY regiao;
