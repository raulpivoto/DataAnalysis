-- GABARITO SEMANA 1 — Fundamentos do SELECT
-- Honestidade: só olhe depois de tentar (pelo menos 2 tentativas ou 10 min).

-- @ex 1.1 xp=10
SELECT * FROM produtos;

-- @ex 1.2 xp=10
SELECT nome, categoria, preco FROM produtos;

-- @ex 1.3 xp=10
SELECT nome, estado, canal_aquisicao FROM clientes;

-- @ex 1.4 xp=10
SELECT nome, preco FROM produtos WHERE categoria = 'Periféricos';

-- @ex 1.5 xp=10
SELECT nome, preco FROM produtos WHERE preco > 1000;

-- @ex 1.6 xp=10
SELECT pedido_id, data_pedido
FROM pedidos
WHERE status = 'cancelado' AND forma_pagamento = 'pix';

-- @ex 1.7 xp=20
SELECT cliente_id, nome, estado
FROM clientes
WHERE (estado = 'SP' OR estado = 'RJ') AND canal_aquisicao = 'instagram';

-- @ex 1.8 xp=10
SELECT cliente_id, nome, estado FROM clientes WHERE estado IN ('PR', 'SC', 'RS');

-- @ex 1.9 xp=10
SELECT pedido_id, data_pedido
FROM pedidos
WHERE data_pedido BETWEEN '2025-11-01' AND '2025-11-30';

-- @ex 1.10 xp=10
SELECT nome FROM produtos WHERE nome LIKE 'Smart%';

-- @ex 1.11 xp=10
SELECT cliente_id, nome FROM clientes WHERE email IS NULL;

-- @ex 1.12 xp=10
SELECT nome, preco FROM produtos ORDER BY preco DESC LIMIT 5;

-- @ex 1.13 xp=10
SELECT DISTINCT categoria FROM produtos ORDER BY categoria;

-- @ex 1.14 xp=20
SELECT pedido_id, data_pedido
FROM pedidos
ORDER BY data_pedido DESC, pedido_id DESC
LIMIT 10;

-- @ex 1.15 xp=10
SELECT DISTINCT canal_aquisicao FROM clientes;

-- @ex 1.16 xp=10
SELECT nome, preco, custo, preco - custo AS margem
FROM produtos
ORDER BY margem DESC
LIMIT 10;

-- @ex 1.17 xp=20
SELECT nome, ROUND((preco - custo) / preco * 100, 1) AS margem_pct
FROM produtos
ORDER BY margem_pct DESC, nome;

-- @ex 1.18 xp=10
SELECT pedido_id, produto_id, quantidade * preco_unitario AS valor_total
FROM itens_pedido
WHERE pedido_id = 10;

-- @ex 1.19 xp=20
SELECT nome, ROUND((preco - custo) / preco * 100, 1) AS margem_pct
FROM produtos
WHERE (preco - custo) / preco > 0.60;

-- ================= BOSS FIGHT 1 =================

-- @ex B1.1 xp=30
SELECT nome, cidade, data_cadastro
FROM clientes
WHERE estado = 'MG'
  AND data_cadastro >= '2025-01-01'
  AND email IS NOT NULL
ORDER BY data_cadastro, cliente_id;

-- @ex B1.2 xp=30
SELECT pedido_id, data_pedido, forma_pagamento
FROM pedidos
WHERE data_pedido BETWEEN '2024-12-01' AND '2024-12-31'
  AND frete = 0
  AND forma_pagamento IN ('boleto', 'cartao_debito')
ORDER BY pedido_id;

-- @ex B1.3 xp=30
SELECT nome, preco
FROM produtos
WHERE categoria = 'Acessórios'
ORDER BY preco
LIMIT 3;

-- @ex B1.4 xp=30
SELECT pedido_id, produto_id, quantidade, desconto_pct,
       quantidade * preco_unitario AS valor
FROM itens_pedido
WHERE desconto_pct > 0 AND quantidade >= 2
ORDER BY valor DESC, pedido_id
LIMIT 10;

-- @ex B1.5 xp=30
SELECT cliente_id, nome, estado
FROM clientes
WHERE nome LIKE '%Silva%' AND estado <> 'SP';
