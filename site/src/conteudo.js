/* Conteúdo do Mês 1: unidades, lições, desafios e dicas.
   Os gabaritos vêm de mes-01/gabarito/*.sql (injetados no build). */
window.CURSO = [
  {
    id: "u1", nome: "Fundamentos do SELECT", resumo: "Fazer perguntas simples a um banco e receber respostas certas.",
    licoes: [
      {
        id: "L1", titulo: "Sua primeira pergunta", tema: "SELECT e FROM",
        conceito: `
<p>Um <b>banco relacional</b> é um conjunto de <b>tabelas</b>, com linhas e colunas, como planilhas que conversam entre si. <b>SQL</b> é a língua usada para fazer perguntas a ele.</p>
<p>A <b>LojaData</b>, um e-commerce de eletrônicos, tem 5 tabelas: <code>clientes</code>, <code>produtos</code>, <code>pedidos</code>, <code>itens_pedido</code> e <code>avaliacoes</code>. Toque em <b>Tabelas</b> no topo para ver as colunas de cada uma.</p>
<pre>SELECT nome, preco   -- QUAIS colunas eu quero
FROM produtos;       -- DE QUAL tabela</pre>
<ul><li><code>SELECT *</code> traz todas as colunas. Bom para explorar, ruim em produção.</li>
<li>Palavras-chave podem ser minúsculas, mas a convenção é MAIÚSCULAS.</li></ul>`,
        exemplo: "SELECT nome, preco\nFROM produtos;",
        exercicios: [
          { id: "1.1", texto: "Traga <b>todas</b> as colunas da tabela <code>produtos</code>.", dica: "O asterisco (*) significa “todas as colunas”." },
          { id: "1.2", texto: "Traga apenas <code>nome</code>, <code>categoria</code> e <code>preco</code> dos produtos, nessa ordem.", dica: "Liste as colunas separadas por vírgula depois do SELECT." },
          { id: "1.3", texto: "Traga <code>nome</code>, <code>estado</code> e <code>canal_aquisicao</code> de todos os clientes.", dica: "A tabela agora é clientes." },
        ],
      },
      {
        id: "L2", titulo: "Só o que importa", tema: "Filtros com WHERE",
        conceito: `
<p><code>WHERE</code> filtra <b>linhas</b>: só passam as que atendem à condição.</p>
<pre>SELECT nome, preco
FROM produtos
WHERE preco > 1000;</pre>
<ul><li>Comparações: <code>=</code>, <code>&lt;&gt;</code> (diferente), <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code></li>
<li>Texto e datas vão entre <b>aspas simples</b>: <code>WHERE status = 'cancelado'</code></li>
<li>Combine condições com <code>AND</code> e <code>OR</code>. <b>Cuidado:</b> o <code>AND</code> é avaliado antes do <code>OR</code>. Na dúvida, use parênteses.</li></ul>
<pre>-- ERRADO: traz TODOS de SP + só os do RJ vindos do Instagram
WHERE estado = 'SP' OR estado = 'RJ' AND canal_aquisicao = 'instagram'
-- CERTO
WHERE (estado = 'SP' OR estado = 'RJ') AND canal_aquisicao = 'instagram'</pre>`,
        exemplo: "SELECT nome, preco\nFROM produtos\nWHERE preco > 1000;",
        exercicios: [
          { id: "1.4", texto: "<code>nome</code> e <code>preco</code> dos produtos da categoria <code>'Periféricos'</code>.", dica: "WHERE categoria = 'Periféricos' (com acento, igual ao dado)." },
          { id: "1.5", texto: "<code>nome</code> e <code>preco</code> dos produtos com preço <b>acima de</b> R$ 1.000.", dica: "Números vão sem aspas: preco > 1000." },
          { id: "1.6", texto: "<code>pedido_id</code> e <code>data_pedido</code> dos pedidos <b>cancelados</b> pagos via <code>'pix'</code>.", dica: "Duas condições ao mesmo tempo: use AND." },
          { id: "1.7", texto: "<code>cliente_id</code>, <code>nome</code> e <code>estado</code> dos clientes de SP <b>ou</b> RJ que vieram do <code>'instagram'</code>.", dica: "Coloque o OR entre parênteses, senão o AND é avaliado primeiro." },
        ],
      },
      {
        id: "L3", titulo: "Filtros ninja", tema: "IN, BETWEEN, LIKE, NULL",
        conceito: `
<pre>WHERE estado IN ('PR', 'SC', 'RS')                        -- lista de valores
WHERE data_pedido BETWEEN '2025-11-01' AND '2025-11-30'  -- intervalo (inclui as pontas)
WHERE nome LIKE 'Smart%'   -- % = qualquer sequência · _ = um caractere
WHERE email IS NULL        -- nunca use "= NULL"</pre>
<p><b>NULL</b> significa “valor desconhecido ou ausente”. Dados reais vêm cheios deles, e saber lidar com isso separa quem já trabalhou com dados de quem não trabalhou.</p>
<p>Aqui (como no PostgreSQL e no DuckDB) o <code>LIKE</code> <b>diferencia maiúsculas</b>: <code>'%tv%'</code> não acha “Smart TV”. Para ignorar, use <code>LOWER(nome) LIKE '%tv%'</code>.</p>`,
        exemplo: "SELECT nome, cidade, estado\nFROM clientes\nWHERE cidade IS NULL;",
        exercicios: [
          { id: "1.8", texto: "<code>cliente_id</code>, <code>nome</code> e <code>estado</code> dos clientes da <b>Região Sul</b> (PR, SC, RS). Use <code>IN</code>.", dica: "estado IN ('PR', 'SC', 'RS')" },
          { id: "1.9", texto: "<code>pedido_id</code> e <code>data_pedido</code> dos pedidos de <b>novembro de 2025</b>. Use <code>BETWEEN</code>.", dica: "Datas no formato 'AAAA-MM-DD', entre aspas." },
          { id: "1.10", texto: "<code>nome</code> dos produtos que <b>começam</b> com <code>'Smart'</code>.", dica: "LIKE 'Smart%'" },
          { id: "1.11", texto: "<code>cliente_id</code> e <code>nome</code> dos clientes <b>sem e-mail</b> cadastrado.", dica: "IS NULL" },
        ],
      },
      {
        id: "L4", titulo: "Rankings", tema: "ORDER BY, LIMIT, DISTINCT",
        conceito: `
<pre>SELECT nome AS produto, preco   -- AS = apelido (alias) da coluna
FROM produtos
ORDER BY preco DESC, nome       -- DESC = maior→menor; 2º critério = desempate
LIMIT 5;                        -- só as 5 primeiras linhas

SELECT DISTINCT categoria FROM produtos;  -- remove repetições</pre>
<p><b>Ordem de escrita:</b> <code>SELECT → FROM → WHERE → ORDER BY → LIMIT</code></p>
<p><b>Por que desempatar?</b> Vários pedidos têm a mesma data. Sem um 2º critério, o “top 10” pode mudar a cada execução. Em entrevista, isso é observado.</p>`,
        exemplo: "SELECT nome, preco\nFROM produtos\nORDER BY preco DESC\nLIMIT 5;",
        exercicios: [
          { id: "1.12", texto: "Os <b>5 produtos mais caros</b>: <code>nome</code> e <code>preco</code>.", dica: "ORDER BY preco DESC + LIMIT 5" },
          { id: "1.13", texto: "Lista de <b>categorias distintas</b>, em ordem alfabética.", dica: "SELECT DISTINCT ... ORDER BY categoria" },
          { id: "1.14", texto: "Os <b>10 pedidos mais recentes</b>: <code>pedido_id</code> e <code>data_pedido</code>. Desempate: <code>pedido_id</code> decrescente.", dica: "ORDER BY data_pedido DESC, pedido_id DESC" },
          { id: "1.15", texto: "Quais <b>canais de aquisição</b> distintos existem?", dica: "DISTINCT canal_aquisicao" },
        ],
      },
      {
        id: "L5", titulo: "Gerando métricas", tema: "Colunas calculadas",
        conceito: `
<p>Dá para fazer contas dentro do <code>SELECT</code>:</p>
<pre>SELECT nome,
       preco - custo                           AS margem,
       ROUND((preco - custo) / preco * 100, 1) AS margem_pct
FROM produtos;</pre>
<ul><li><code>ROUND(valor, casas)</code> arredonda.</li>
<li>Você pode <b>ordenar</b> pelo alias (<code>ORDER BY margem</code>), mas no SQL padrão <b>não pode usá-lo no WHERE</b>: repita a expressão, porque o WHERE roda antes do SELECT.</li></ul>`,
        exemplo: "SELECT nome, preco, custo, preco - custo AS margem\nFROM produtos\nORDER BY margem DESC;",
        exercicios: [
          { id: "1.16", texto: "<code>nome</code>, <code>preco</code>, <code>custo</code> e <code>margem</code> (preço − custo) dos <b>10 produtos de maior margem</b>.", dica: "Calcule preco - custo AS margem e ordene por ela." },
          { id: "1.17", texto: "<code>nome</code> e <code>margem_pct</code> (arredondada, 1 casa) de <b>todos</b> os produtos, da maior para a menor margem. Desempate: <code>nome</code>.", dica: "ROUND((preco - custo) / preco * 100, 1)" },
          { id: "1.18", texto: "Para o <code>pedido_id = 10</code>: <code>pedido_id</code>, <code>produto_id</code> e <code>valor_total</code> (quantidade × preço unitário).", dica: "Tabela itens_pedido; quantidade * preco_unitario." },
          { id: "1.19", texto: "<code>nome</code> e <code>margem_pct</code> (1 casa) dos produtos com margem <b>acima de 60%</b>.", dica: "No WHERE, repita a conta: (preco - custo) / preco > 0.60" },
        ],
      },
    ],
    boss: {
      id: "B1", titulo: "O Gerente Apressado", minutos: 45,
      historia: "Sexta, 17h55. Seu gestor manda 5 pedidos no chat e quer tudo antes de ir embora. Sem consultar as lições.",
      exercicios: [
        { id: "B1.1", texto: "“Quero <code>nome</code>, <code>cidade</code> e <code>data_cadastro</code> dos clientes de <b>MG</b> cadastrados a partir de <b>2025</b> que <b>têm e-mail</b>. Ordena pela data de cadastro (desempate: <code>cliente_id</code>).”" },
        { id: "B1.2", texto: "“Pedidos de <b>dezembro de 2024</b> com <b>frete grátis</b> (frete = 0) pagos no <b>boleto ou cartão de débito</b> (<code>'cartao_debito'</code>): <code>pedido_id</code>, <code>data_pedido</code>, <code>forma_pagamento</code>, ordenados por <code>pedido_id</code>.”" },
        { id: "B1.3", texto: "“Os <b>3 acessórios mais baratos</b> (categoria <code>'Acessórios'</code>): <code>nome</code> e <code>preco</code>.”" },
        { id: "B1.4", texto: "“Itens vendidos <b>com desconto</b> e <b>quantidade ≥ 2</b>: <code>pedido_id</code>, <code>produto_id</code>, <code>quantidade</code>, <code>desconto_pct</code> e <code>valor</code> (qtd × preço unitário). Só os <b>10 maiores valores</b> (desempate: <code>pedido_id</code>).”" },
        { id: "B1.5", texto: "“Clientes que têm <b>Silva</b> no nome e <b>não são de SP</b>: <code>cliente_id</code>, <code>nome</code>, <code>estado</code>.”" },
      ],
    },
  },
  {
    id: "u2", nome: "Agregações e estatística", resumo: "Transformar milhares de linhas em números que respondem perguntas de negócio.",
    licoes: [
      {
        id: "L6", titulo: "Resumindo a tabela", tema: "COUNT, SUM, AVG, MIN, MAX",
        conceito: `
<pre>SELECT COUNT(*)               AS linhas,     -- conta linhas
       COUNT(email)           AS com_email,  -- conta valores NÃO nulos
       COUNT(DISTINCT estado) AS estados     -- conta valores distintos
FROM clientes;

SELECT SUM(preco), AVG(preco), MIN(preco), MAX(preco) FROM produtos;</pre>
<p>Agregações <b>ignoram NULL</b> (menos o <code>COUNT(*)</code>). Isso cai em entrevista.</p>`,
        exemplo: "SELECT COUNT(*) AS linhas,\n       COUNT(email) AS com_email,\n       COUNT(DISTINCT estado) AS estados\nFROM clientes;",
        exercicios: [
          { id: "2.1", texto: "Quantos clientes existem?", dica: "COUNT(*)" },
          { id: "2.2", texto: "Em uma só consulta: o total de clientes e quantos <b>têm e-mail</b>.", dica: "COUNT(*) e COUNT(email) lado a lado." },
          { id: "2.3", texto: "Preço mínimo, máximo e médio (2 casas) dos produtos, nessa ordem.", dica: "MIN, MAX e ROUND(AVG(preco), 2)" },
          { id: "2.4", texto: "Faturamento bruto total: soma de <code>quantidade × preco_unitario</code> de todos os itens (2 casas).", dica: "ROUND(SUM(quantidade * preco_unitario), 2)" },
        ],
      },
      {
        id: "L7", titulo: "Resumindo por grupo", tema: "GROUP BY",
        conceito: `
<pre>SELECT estado, COUNT(*) AS clientes
FROM clientes
GROUP BY estado          -- uma linha de resultado por estado
ORDER BY clientes DESC;</pre>
<p><b>Regra de ouro:</b> toda coluna do <code>SELECT</code> que <b>não</b> está dentro de uma agregação precisa estar no <code>GROUP BY</code>.</p>`,
        exemplo: "SELECT estado, COUNT(*) AS clientes\nFROM clientes\nGROUP BY estado\nORDER BY clientes DESC;",
        exercicios: [
          { id: "2.5", texto: "Número de clientes por <code>estado</code>, do maior para o menor (desempate: <code>estado</code>).", dica: "GROUP BY estado ORDER BY 2 DESC, estado" },
          { id: "2.6", texto: "Número de pedidos por <code>status</code>.", dica: "Tabela pedidos, GROUP BY status." },
          { id: "2.7", texto: "Por <code>categoria</code>: quantidade de produtos e preço médio (2 casas), do maior preço médio para o menor.", dica: "COUNT(*), ROUND(AVG(preco), 2) ... GROUP BY categoria" },
          { id: "2.8", texto: "Os <b>5 <code>produto_id</code></b> com maior receita (quantidade × preço unitário) em <code>itens_pedido</code>, com a receita.", dica: "SUM(quantidade * preco_unitario), agrupado por produto_id." },
        ],
      },
      {
        id: "L8", titulo: "Filtrando grupos", tema: "HAVING",
        conceito: `
<ul><li><code>WHERE</code> filtra <b>linhas</b> antes de agrupar.</li><li><code>HAVING</code> filtra <b>grupos</b> depois de agrupar.</li></ul>
<pre>SELECT cliente_id, COUNT(*) AS pedidos
FROM pedidos
WHERE status &lt;&gt; 'cancelado'   -- antes de agrupar
GROUP BY cliente_id
HAVING COUNT(*) >= 5;         -- depois de agrupar</pre>
<p><b>Ordem de execução</b> (pergunta clássica): <code>FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</code></p>`,
        exemplo: "SELECT cliente_id, COUNT(*) AS pedidos\nFROM pedidos\nWHERE status <> 'cancelado'\nGROUP BY cliente_id\nHAVING COUNT(*) >= 15;",
        exercicios: [
          { id: "2.9", texto: "Categorias com <b>mais de 4</b> produtos: <code>categoria</code> e a quantidade.", dica: "HAVING COUNT(*) > 4" },
          { id: "2.10", texto: "Clientes com <b>20 ou mais</b> pedidos: <code>cliente_id</code> e a quantidade, do maior para o menor (desempate: <code>cliente_id</code>).", dica: "HAVING COUNT(*) >= 20" },
          { id: "2.11", texto: "Pedidos com <b>4 ou mais</b> itens (linhas em <code>itens_pedido</code>): <code>pedido_id</code> e a quantidade de itens, ordenados por <code>pedido_id</code>.", dica: "Agrupe itens_pedido por pedido_id." },
        ],
      },
      {
        id: "L9", titulo: "Analisando o tempo", tema: "Funções de data",
        conceito: `
<pre>YEAR(data_pedido)                 -- 2025
MONTH(data_pedido)                -- 11
QUARTER(data_pedido)              -- 4 (trimestre)
ISODOW(data_pedido)               -- 1 = segunda … 7 = domingo
DATE_TRUNC('month', data_pedido)  -- '2025-11-01': ótimo para séries mensais</pre>
<p>Cada banco tem suas funções de data (<code>EXTRACT</code>, <code>DATEPART</code>, <code>strftime</code>…). Não decore todas: entenda o <b>conceito</b> e consulte a documentação, como os analistas fazem no dia a dia.</p>`,
        exemplo: "SELECT YEAR(data_pedido) AS ano, COUNT(*) AS pedidos\nFROM pedidos\nGROUP BY ano\nORDER BY ano;",
        exercicios: [
          { id: "2.12", texto: "Pedidos por <b>ano</b> (<code>ano</code>, quantidade), em ordem de ano.", dica: "YEAR(data_pedido) AS ano ... GROUP BY ano" },
          { id: "2.13", texto: "Pedidos por <b>mês de 2025</b> (<code>mes</code> numérico, quantidade), em ordem de mês.", dica: "Filtre YEAR(data_pedido) = 2025 e agrupe por MONTH." },
          { id: "2.14", texto: "Pedidos por <b>dia da semana</b> (use <code>ISODOW</code>), em ordem de dia.", dica: "ISODOW(data_pedido) AS dia_semana" },
          { id: "2.15", texto: "Série mensal de 2024 com <code>DATE_TRUNC('month', …)</code>: <code>mes</code> e quantidade, em ordem.", dica: "DATE_TRUNC('month', data_pedido) AS mes" },
        ],
      },
      {
        id: "L10", titulo: "A média mente", tema: "Estatística descritiva",
        conceito: `
<table class="mini"><tr><th>Medida</th><th>O que diz</th><th>SQL</th></tr>
<tr><td>Média</td><td>“centro”, sensível a extremos</td><td><code>AVG(x)</code></td></tr>
<tr><td>Mediana</td><td>valor do meio, robusta a outliers</td><td><code>MEDIAN(x)</code></td></tr>
<tr><td>Moda</td><td>valor mais frequente</td><td><code>MODE(x)</code></td></tr>
<tr><td>Desvio padrão</td><td>quão espalhados estão os dados</td><td><code>STDDEV_SAMP(x)</code></td></tr>
<tr><td>Quartis</td><td>cortes em 25%, 50%, 75%</td><td><code>QUANTILE_CONT(x, 0.25)</code></td></tr></table>
<p><b>Insight de negócio:</b> quando a média é muito maior que a mediana, poucos valores altos estão “puxando” a média. Relatar só a média de ticket, salário ou prazo de entrega pode enganar a diretoria.</p>`,
        exemplo: "SELECT ROUND(AVG(preco), 2) AS media,\n       ROUND(MEDIAN(preco), 2) AS mediana\nFROM produtos;",
        exercicios: [
          { id: "2.16", texto: "Média e mediana (2 casas) do valor por item (quantidade × preço unitário). Pense: o que a diferença entre elas significa?", dica: "ROUND(AVG(...), 2) e ROUND(MEDIAN(...), 2)" },
          { id: "2.17", texto: "Para pedidos com frete pago (<code>frete > 0</code>): média, mediana e desvio padrão amostral do frete (2 casas).", dica: "STDDEV_SAMP(frete)" },
          { id: "2.18", texto: "Distribuição das notas das avaliações: <code>nota</code> e quantidade, em ordem de nota.", dica: "GROUP BY nota ORDER BY nota" },
          { id: "2.19", texto: "Qual a forma de pagamento mais usada (a moda)? <code>forma_pagamento</code> e quantidade.", dica: "Agrupe, ordene pela contagem decrescente e LIMIT 1." },
        ],
      },
    ],
    boss: {
      id: "B2", titulo: "Reunião de Resultados", minutos: 50,
      historia: "A diretoria quer números para a reunião de segunda. Sem consulta.",
      exercicios: [
        { id: "B2.1", texto: "Pedidos por <code>forma_pagamento</code> <b>e</b> <code>status</code>, só combinações com <b>20 ou mais</b> pedidos. Ordene por forma de pagamento e depois pela quantidade, decrescente." },
        { id: "B2.2", texto: "Qual <b>mês de 2025</b> teve mais pedidos? (<code>mes</code>, quantidade)" },
        { id: "B2.3", texto: "Por <code>canal_aquisicao</code>: número de clientes, primeira e última data de cadastro. Do maior canal para o menor." },
        { id: "B2.4", texto: "Os <b>3 <code>produto_id</code></b> com mais <b>unidades</b> vendidas (soma da quantidade)." },
        { id: "B2.5", texto: "Q1, mediana e Q3 (2 casas) do preço dos produtos." },
      ],
    },
  },
  {
    id: "u3", nome: "JOINs e CASE WHEN", resumo: "Cruzar tabelas: a habilidade mais cobrada em testes técnicos.",
    licoes: [
      {
        id: "L11", titulo: "Como as tabelas conversam", tema: "Chaves e cardinalidade",
        conceito: `
<ul><li><b>Chave primária (PK):</b> identifica cada linha de forma única (<code>clientes.cliente_id</code>).</li>
<li><b>Chave estrangeira (FK):</b> aponta para a PK de outra tabela (<code>pedidos.cliente_id → clientes.cliente_id</code>).</li>
<li><b>Cardinalidade:</b> 1 cliente → N pedidos · 1 pedido → N itens · 1 pedido → 0 ou 1 avaliação.</li></ul>
<pre>clientes 1───N pedidos 1───N itens_pedido N───1 produtos
                  │
                  1───0..1 avaliacoes</pre>
<p><b>Por que importa:</b> quase todo bug de análise júnior é um JOIN que <b>duplica linhas</b>. Saber a cardinalidade evita isso.</p>`,
        exemplo: "SELECT pedido_id, COUNT(*) AS itens\nFROM itens_pedido\nGROUP BY pedido_id\nORDER BY itens DESC\nLIMIT 5;",
        exercicios: [
          { id: "3.1", texto: "Em <code>itens_pedido</code>: número de linhas e número de <code>pedido_id</code> <b>distintos</b>. O que a diferença revela?", dica: "COUNT(*) e COUNT(DISTINCT pedido_id)" },
          { id: "3.2", texto: "Quantos clientes <b>distintos</b> já fizeram pedido? Compare com o total (500).", dica: "COUNT(DISTINCT cliente_id) na tabela pedidos." },
        ],
      },
      {
        id: "L12", titulo: "Só o que casa", tema: "INNER JOIN",
        conceito: `
<pre>SELECT p.pedido_id, p.data_pedido, c.nome
FROM pedidos AS p
INNER JOIN clientes AS c              -- "JOIN" sozinho = INNER JOIN
        ON c.cliente_id = p.cliente_id;   -- a regra de ligação (FK = PK)</pre>
<ul><li>Use <b>apelidos curtos</b> (<code>p</code>, <code>c</code>) e <b>sempre</b> prefixe as colunas (<code>c.nome</code>).</li>
<li><code>INNER JOIN</code> descarta linhas sem par do outro lado.</li></ul>`,
        exemplo: "SELECT p.pedido_id, p.data_pedido, c.nome, c.estado\nFROM pedidos AS p\nJOIN clientes AS c ON c.cliente_id = p.cliente_id\nLIMIT 10;",
        exercicios: [
          { id: "3.3", texto: "Pedidos 1 a 5: <code>pedido_id</code>, <code>data_pedido</code> e <code>nome</code> do cliente, em ordem de pedido.", dica: "JOIN clientes ... WHERE p.pedido_id <= 5 ORDER BY p.pedido_id" },
          { id: "3.4", texto: "Itens do pedido <b>42</b>: <code>nome</code> do produto, <code>quantidade</code> e <code>preco_unitario</code>.", dica: "itens_pedido JOIN produtos ON produto_id." },
          { id: "3.5", texto: "<b>Receita por categoria</b> (quantidade × preço unitário), da maior para a menor.", dica: "JOIN produtos para ter a categoria, depois GROUP BY." },
          { id: "3.6", texto: "<b>Pedidos por estado</b> do cliente, do maior para o menor (desempate: <code>estado</code>).", dica: "pedidos JOIN clientes, GROUP BY c.estado." },
        ],
      },
      {
        id: "L13", titulo: "Encontrando o que falta", tema: "LEFT JOIN",
        conceito: `
<p><code>LEFT JOIN</code> mantém <b>todas</b> as linhas da tabela da esquerda. Quando não há par, as colunas da direita vêm <code>NULL</code>.</p>
<pre>-- "anti-join": produtos que NUNCA foram vendidos
SELECT pr.nome
FROM produtos AS pr
LEFT JOIN itens_pedido AS i ON i.produto_id = pr.produto_id
WHERE i.produto_id IS NULL;</pre>
<p>Perguntas típicas: clientes que nunca compraram, produtos encalhados, pedidos sem avaliação. <code>COALESCE(x, 0)</code> troca NULL por 0.</p>`,
        exemplo: "SELECT c.nome, p.pedido_id\nFROM clientes AS c\nLEFT JOIN pedidos AS p ON p.cliente_id = c.cliente_id\nWHERE p.pedido_id IS NULL\nLIMIT 10;",
        exercicios: [
          { id: "3.7", texto: "<code>nome</code> dos produtos que <b>nunca</b> foram vendidos.", dica: "LEFT JOIN itens_pedido + WHERE i.produto_id IS NULL" },
          { id: "3.8", texto: "<b>Quantos</b> clientes nunca fizeram pedido?", dica: "Mesmo padrão, com COUNT(*)." },
          { id: "3.9", texto: "Quantos pedidos <b>entregues</b> <b>não</b> têm avaliação?", dica: "pedidos LEFT JOIN avaliacoes, filtrando status = 'entregue'." },
          { id: "3.10", texto: "Os <b>5 produtos que menos venderam</b> em unidades (mostre 0 para quem nunca vendeu): <code>nome</code> e unidades. Desempate: <code>nome</code>.", dica: "COALESCE(SUM(i.quantidade), 0)" },
        ],
      },
      {
        id: "L14", titulo: "A pergunta completa", tema: "JOIN de 3+ tabelas",
        conceito: `
<p>Siga o “caminho” do diagrama: <code>clientes → pedidos → itens_pedido → produtos</code>.</p>
<pre>SELECT c.estado, SUM(i.quantidade * i.preco_unitario) AS receita
FROM clientes AS c
JOIN pedidos      AS p ON p.cliente_id = c.cliente_id
JOIN itens_pedido AS i ON i.pedido_id  = p.pedido_id
WHERE p.status = 'entregue'
GROUP BY c.estado;</pre>
<p><b>Armadilha:</b> ao juntar <code>pedidos</code> com <code>itens_pedido</code>, o <code>frete</code> do pedido se repete em cada item, e <code>SUM(p.frete)</code> fica inflado. Some cada métrica no nível certo.</p>`,
        exemplo: "SELECT c.estado, SUM(i.quantidade * i.preco_unitario) AS receita\nFROM clientes AS c\nJOIN pedidos AS p ON p.cliente_id = c.cliente_id\nJOIN itens_pedido AS i ON i.pedido_id = p.pedido_id\nGROUP BY c.estado\nORDER BY receita DESC;",
        exercicios: [
          { id: "3.11", texto: "<b>Top 5 estados</b> por receita de pedidos <b>entregues</b>: <code>estado</code> e receita.", dica: "Veja o exemplo e adicione o filtro, ORDER BY e LIMIT." },
          { id: "3.12", texto: "<b>Nota média</b> (2 casas) das avaliações por <b>categoria</b> de produto, da maior para a menor (desempate: categoria).", dica: "avaliacoes → itens_pedido → produtos" },
          { id: "3.13", texto: "<b>Top 5 clientes</b> por valor gasto em pedidos entregues: <code>cliente_id</code>, <code>nome</code> e total.", dica: "GROUP BY c.cliente_id, c.nome" },
          { id: "3.14", texto: "Receita de <b>2025</b> por <b>canal de aquisição</b>, sem pedidos cancelados, da maior para a menor.", dica: "YEAR(p.data_pedido) = 2025 AND p.status <> 'cancelado'" },
        ],
      },
      {
        id: "L15", titulo: "Criando segmentos", tema: "CASE WHEN",
        conceito: `
<p><code>CASE</code> é o “SE” do SQL: cria categorias que não existem na base.</p>
<pre>SELECT CASE
         WHEN preco &lt; 100  THEN 'Barato'
         WHEN preco &lt; 1000 THEN 'Médio'  -- o 1º verdadeiro vence
         ELSE 'Caro'
       END AS faixa,
       COUNT(*)
FROM produtos
GROUP BY faixa;</pre>
<p><b>Truque de entrevista:</b> taxa com CASE dentro da agregação:</p>
<pre>100.0 * SUM(CASE WHEN status = 'cancelado' THEN 1 ELSE 0 END) / COUNT(*)</pre>`,
        exemplo: "SELECT status,\n       CASE WHEN status = 'cancelado' THEN 'perdido' ELSE 'válido' END AS situacao\nFROM pedidos\nLIMIT 10;",
        exercicios: [
          { id: "3.15", texto: "Número de produtos por faixa: <code>'Barato'</code> (&lt; 100), <code>'Médio'</code> (100 a 999,99), <code>'Caro'</code> (≥ 1000).", dica: "Veja o exemplo da explicação." },
          { id: "3.16", texto: "<b>Taxa de cancelamento (%)</b> por forma de pagamento (1 casa), da maior para a menor.", dica: "ROUND(100.0 * SUM(CASE ...) / COUNT(*), 1)" },
          { id: "3.17", texto: "Pedidos por período: <code>'Black Friday'</code> (novembro), <code>'Natal'</code> (dezembro), <code>'Resto do ano'</code>.", dica: "CASE MONTH(data_pedido) WHEN 11 THEN ..." },
          { id: "3.18", texto: "Avaliações por perfil NPS: nota 5 = <code>'Promotor'</code>, 4 = <code>'Neutro'</code>, 1 a 3 = <code>'Detrator'</code>.", dica: "CASE WHEN nota = 5 THEN ... WHEN nota = 4 THEN ... ELSE ..." },
        ],
      },
    ],
    boss: {
      id: "B3", titulo: "O Diretor Comercial", minutos: 40,
      historia: "O diretor comercial quer comparar anos, regiões e reclamações. Sem consulta.",
      exercicios: [
        { id: "B3.1", texto: "Por <code>categoria</code>: receita de <b>2024</b> e de <b>2025</b> lado a lado (duas colunas), sem pedidos cancelados, ordenado por categoria. Dica: CASE dentro do SUM." },
        { id: "B3.2", texto: "Clientes do <b>RJ</b> que já compraram alguma <b>Smart TV</b>: <code>cliente_id</code> e <code>nome</code> (sem repetição), por <code>cliente_id</code>." },
        { id: "B3.3", texto: "Categorias com <b>mais de 20 pedidos</b> avaliados com nota <b>≤ 2</b>: <code>categoria</code> e o número de pedidos distintos." },
        { id: "B3.4", texto: "<b>Frete médio</b> (2 casas) por região: Sudeste (SP, RJ, MG), Sul (PR, SC, RS), Nordeste (BA, PE, CE), Centro-Oeste (DF, GO). Em ordem alfabética de região." },
      ],
    },
  },
  {
    id: "u4", nome: "Subqueries, CTEs e outliers", resumo: "SQL legível em etapas e a estatística que o negócio entende.",
    licoes: [
      {
        id: "L16", titulo: "Uma pergunta dentro da outra", tema: "Subqueries",
        conceito: `
<pre>-- 1) No WHERE, comparando com um valor único
WHERE preco > (SELECT AVG(preco) FROM produtos)

-- 2) No WHERE, com uma lista
WHERE cliente_id IN (SELECT cliente_id FROM pedidos WHERE ...)

-- 3) No FROM: agregação em DOIS níveis (média do total por pedido)
SELECT AVG(valor_pedido)
FROM (SELECT pedido_id, SUM(quantidade * preco_unitario) AS valor_pedido
      FROM itens_pedido GROUP BY pedido_id) AS t;</pre>
<p>O caso 3 é o <b>ticket médio</b>, uma das métricas mais pedidas em e-commerce. <code>AVG(preco_unitario)</code> <b>não</b> é ticket médio!</p>`,
        exemplo: "SELECT nome, preco\nFROM produtos\nWHERE preco > (SELECT AVG(preco) FROM produtos);",
        exercicios: [
          { id: "4.1", texto: "Produtos com preço <b>acima da média</b>: <code>nome</code> e <code>preco</code>, do mais caro ao mais barato.", dica: "Subquery escalar no WHERE." },
          { id: "4.2", texto: "<b>Quantos clientes</b> fizeram pedido em <b>dezembro de 2025</b>? Use <code>IN (subquery)</code>.", dica: "SELECT COUNT(*) FROM clientes WHERE cliente_id IN (...)" },
          { id: "4.3", texto: "<b>Ticket médio</b> (2 casas) dos pedidos <b>não cancelados</b>.", dica: "Subquery no FROM com o valor por pedido; filtre status <> 'cancelado' lá dentro." },
          { id: "4.4", texto: "Qual pedido teve o <b>maior valor</b>? <code>pedido_id</code> e total.", dica: "Agrupe por pedido, ordene decrescente, LIMIT 1." },
        ],
      },
      {
        id: "L17", titulo: "SQL que se lê como história", tema: "CTEs (WITH)",
        conceito: `
<p>Uma CTE (<code>WITH</code>) dá <b>nome</b> a uma etapa. É a forma profissional de escrever análises complexas, e a que entrevistadores preferem ver.</p>
<pre>WITH valor_por_pedido AS (          -- etapa 1
    SELECT pedido_id, SUM(quantidade * preco_unitario) AS valor
    FROM itens_pedido
    GROUP BY pedido_id
)
SELECT CASE WHEN valor &lt; 200 THEN 'baixo' ELSE 'alto' END AS faixa,
       COUNT(*)
FROM valor_por_pedido               -- etapa final
GROUP BY faixa;</pre>
<p>Isso também resolve a armadilha da duplicação: agregue cada coisa no seu nível numa CTE e <b>depois</b> junte.</p>`,
        exemplo: "WITH valor_por_pedido AS (\n    SELECT pedido_id, SUM(quantidade * preco_unitario) AS valor\n    FROM itens_pedido\n    GROUP BY pedido_id\n)\nSELECT * FROM valor_por_pedido\nORDER BY valor DESC\nLIMIT 5;",
        exercicios: [
          { id: "4.5", texto: "Pedidos por faixa de valor: <code>'1. até R$199'</code> (&lt; 200), <code>'2. R$200 a R$999'</code> (&lt; 1000), <code>'3. R$1000+'</code>. Ordenado pela faixa.", dica: "CTE com o valor por pedido + CASE." },
          { id: "4.6", texto: "<b>Segmentação de clientes:</b> gasto total por cliente (pedidos <b>entregues</b>) → <code>'VIP'</code> (≥ 10.000), <code>'Recorrente'</code> (≥ 3.000), <code>'Ocasional'</code>. Conte clientes por segmento.", dica: "CTE gasto por cliente, depois CASE + GROUP BY." },
          { id: "4.7", texto: "Meses de <b>2025</b> cuja receita (sem cancelados) ficou <b>acima da média mensal</b> de 2025: <code>mes</code> e <code>receita</code>, em ordem.", dica: "CTE receita_mensal; compare com (SELECT AVG(receita) FROM receita_mensal)." },
          { id: "4.8", texto: "<b>Retenção:</b> quantos clientes compraram em 2024 <b>e também</b> em 2025?", dica: "Duas CTEs de clientes distintos por ano, depois JOIN entre elas." },
        ],
      },
      {
        id: "L18", titulo: "Estatística que o negócio entende", tema: "Quartis e outliers",
        conceito: `
<ul><li><b>Quartis:</b> Q1 (25%), Q2 = mediana (50%), Q3 (75%).</li>
<li><b>IQR</b> (intervalo interquartil) = Q3 − Q1: onde estão os 50% “do meio”.</li>
<li><b>Regra do boxplot:</b> outlier se valor &gt; Q3 + 1,5 × IQR (ou &lt; Q1 − 1,5 × IQR).</li></ul>
<pre>SELECT QUANTILE_CONT(preco, 0.25) AS q1,
       QUANTILE_CONT(preco, 0.75) AS q3
FROM produtos;</pre>
<p>Outliers <b>não são lixo automaticamente</b>: podem ser clientes corporativos, fraude ou erro de cadastro. <b>Investigue antes de remover</b>, uma ótima frase para entrevista.</p>`,
        exemplo: "SELECT QUANTILE_CONT(preco, 0.25) AS q1,\n       MEDIAN(preco) AS mediana,\n       QUANTILE_CONT(preco, 0.75) AS q3\nFROM produtos;",
        exercicios: [
          { id: "4.9", texto: "Q1, mediana e Q3 (2 casas) do <b>valor por pedido</b> (todos os pedidos).", dica: "CTE com o valor por pedido, depois QUANTILE_CONT." },
          { id: "4.10", texto: "Q1, Q3, IQR e <b>limite superior</b> de outlier (2 casas), nessa ordem.", dica: "Uma 2ª CTE com q1 e q3 facilita: q3 + 1.5 * (q3 - q1)." },
          { id: "4.11", texto: "<b>Quantos pedidos</b> estão acima do limite superior?", dica: "Junte a CTE de valores com a CTE do limite e conte." },
          { id: "4.12", texto: "Média e mediana (2 casas) do valor por pedido para cada <code>forma_pagamento</code>, em ordem alfabética.", dica: "A CTE precisa trazer a forma de pagamento junto." },
        ],
      },
    ],
    boss: {
      id: "B4", titulo: "Prova do Mês", minutos: 75,
      historia: "Simulado de teste técnico real: 6 questões, 75 minutos. Passando com 4 de 6, você está pronto para o Mês 2.",
      exercicios: [
        { id: "B4.1", texto: "Por <b>trimestre de 2025</b> (pedidos entregues): <code>trimestre</code>, número de pedidos e receita." },
        { id: "B4.2", texto: "<b>Top 3 categorias</b> por <b>margem bruta</b> total, <code>(preco_unitario − custo) × quantidade</code>, em pedidos entregues." },
        { id: "B4.3", texto: "<b>Taxa de recompra (%)</b>: entre clientes com pedido, quantos % têm <b>2 ou mais</b>? (1 casa)" },
        { id: "B4.4", texto: "Por <b>canal de aquisição</b>: número de clientes, de compradores e <b>% de conversão</b> (1 casa), da maior conversão para a menor." },
        { id: "B4.5", texto: "Os <b>3 produtos</b> que mais aparecem em avaliações com nota <b>≤ 2</b>: <code>nome</code> e quantidade (desempate: <code>nome</code>)." },
        { id: "B4.6", texto: "Qual <b>dia da semana</b> (<code>ISODOW</code>) tem o maior <b>ticket médio</b> (pedidos não cancelados)? Dia e ticket (2 casas)." },
      ],
    },
  },
];
