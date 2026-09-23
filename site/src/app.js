(function () {
  "use strict";

  /* ================= dados embutidos ================= */
  const lerJSON = (id) => JSON.parse(document.getElementById(id).textContent);
  const DADOS = lerJSON("dados-loja");
  const GAB = lerJSON("dados-gabarito");
  const CARTOES = lerJSON("dados-cartoes");
  const CURSO = window.CURSO;
  const SQLJS_URL = "https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/sql-asm.js";

  const LICOES = [];
  const EXERCICIOS = {};
  CURSO.forEach((u, ui) => {
    u.num = ui + 1;
    u.cor = `var(--u${ui + 1})`;
    u.corFundo = `var(--u${ui + 1}-fundo)`;
    u.licoes.forEach((l) => {
      l.unidade = u;
      LICOES.push(l);
      l.exercicios.forEach((e) => Object.assign(e, GAB[e.id], { origem: l }));
      l.exercicios.forEach((e) => (EXERCICIOS[e.id] = e));
    });
    u.boss.unidade = u;
    u.boss.exercicios.forEach((e) => { Object.assign(e, GAB[e.id], { origem: u.boss, boss: true }); EXERCICIOS[e.id] = e; });
  });
  const TOTAL_EX = Object.keys(EXERCICIOS).length;

  /* ================= utilidades ================= */
  function h(tag, attrs, ...filhos) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else if (k === "text") el.textContent = v;
      else if (k === "style") el.setAttribute("style", v);
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else if (v === true) el.setAttribute(k, "");
      else el.setAttribute(k, v);
    }
    for (const f of filhos.flat()) if (f != null && f !== false) el.append(f.nodeType ? f : document.createTextNode(String(f)));
    return el;
  }
  const svg = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; };
  const I = {
    chama: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c1 3.5-1.3 5.2-2.4 7.1C8.4 11 8 12.3 8 13.5 8 15.99 10 18 12 18s4-2 4-4.5c0-1.5-.6-2.5-1.3-3.4 2.6.7 4.3 3.3 4.3 6.2A7 7 0 0 1 12 23a7 7 0 0 1-7-6.7C5 10 12 7.5 12 2z"/></svg>',
    raio: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 2 4 13.5h6.5L9.5 22 20 9.5h-6.6L13.5 2z"/></svg>',
    check: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    coroa: '<svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 7.5 7.5 11 12 4l4.5 7L21 7.5 19.5 18h-15L3 7.5zM4.5 19.5h15V21h-15z"/></svg>',
    cadeado: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 10 0v3h1.5A1.5 1.5 0 0 1 20 11.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 20.5v-9A1.5 1.5 0 0 1 5.5 10H7zm2 0h6V7a3 3 0 0 0-6 0v3z"/></svg>',
    fechar: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    tabela: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9.5h18M9 9.5V20"/></svg>',
    trilha: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/></svg>',
    alvo: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/></svg>',
    cartas: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="3" width="13" height="16" rx="2"/><path d="M4 7v11a3 3 0 0 0 3 3h9"/></svg>',
    pessoa: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    relogio: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/></svg>',
    logo: '<svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="var(--azul)"/><ellipse cx="16" cy="10" rx="8" ry="3.2" fill="none" stroke="#fff" stroke-width="2.2"/><path d="M8 10v11c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2V10M8 15.5c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2" fill="none" stroke="#fff" stroke-width="2.2"/></svg>',
  };

  const pad = (n) => String(n).padStart(2, "0");
  const dataStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const hoje = () => dataStr(new Date());
  function addDias(s, n) { const [a, m, d] = s.split("-").map(Number); return dataStr(new Date(a, m - 1, d + n)); }
  function semanaISO(s) {
    const [a, m, d] = s.split("-").map(Number);
    const dt = new Date(Date.UTC(a, m - 1, d));
    const dia = dt.getUTCDay() || 7;
    dt.setUTCDate(dt.getUTCDate() + 4 - dia);
    const inicio = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
    return dt.getUTCFullYear() + "-" + Math.ceil(((dt - inicio) / 864e5 + 1) / 7);
  }
  const chave = (id) => id.replace(/\./g, "_");
  const embaralhar = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ================= estado e persistência ================= */
  const CHAVE_LOCAL = "trilha-analista-v1";
  const INTERVALO = { 1: 1, 2: 3, 3: 7, 4: 21 };
  const NIVEIS = [
    [0, "Estagiário de Planilha"], [500, "Aprendiz de SELECT"], [1500, "Domador de JOINs"],
    [3000, "Mestre dos Agregados"], [5000, "Treinador de Pandas"], [8000, "Contador de Histórias com Dados"],
    [12000, "Analista Júnior Pronto"],
  ];

  const novoEstado = () => ({ v: 1, dias: {}, ex: {}, boss: {}, cartoes: {}, cartoesDia: null, cartoesTotal: 0, revisoes: 0, meta: 30, atualizado: 0 });
  function normalizar(e) { return Object.assign(novoEstado(), e || {}); }
  function carregarLocal() { try { const s = localStorage.getItem(CHAVE_LOCAL); return s ? normalizar(JSON.parse(s)) : null; } catch { return null; } }
  function salvarLocal() { try { localStorage.setItem(CHAVE_LOCAL, JSON.stringify(estado)); } catch { /* sem armazenamento local */ } }

  function mesclar(a, b) {
    const [novo, velho] = (a.atualizado || 0) >= (b.atualizado || 0) ? [a, b] : [b, a];
    const r = normalizar(JSON.parse(JSON.stringify(novo)));
    const v = normalizar(velho);
    for (const [d, xp] of Object.entries(v.dias)) r.dias[d] = Math.max(r.dias[d] || 0, xp);
    for (const [k, e] of Object.entries(v.ex)) if (!r.ex[k] || (r.ex[k].status !== "ok" && e.status === "ok")) r.ex[k] = e;
    for (const [k, bo] of Object.entries(v.boss)) if (!r.boss[k] || bo.melhor > r.boss[k].melhor) r.boss[k] = bo;
    for (const [k, c] of Object.entries(v.cartoes)) if (!r.cartoes[k]) r.cartoes[k] = c;
    r.cartoesTotal = Math.max(r.cartoesTotal, v.cartoesTotal);
    r.revisoes = Math.max(r.revisoes, v.revisoes);
    return r;
  }

  let estado = carregarLocal() || novoEstado();
  const nuvem = { ref: null, status: "local", salvando: false, pendente: false, timer: null };

  function salvar() {
    estado.atualizado = Date.now();
    salvarLocal();
    clearTimeout(nuvem.timer);
    nuvem.timer = setTimeout(salvarNuvem, 1200);
  }
  async function salvarNuvem() {
    if (!nuvem.ref) return;
    if (nuvem.salvando) { nuvem.pendente = true; return; }
    nuvem.salvando = true;
    try {
      await nuvem.ref.set(JSON.parse(JSON.stringify(estado)));
      nuvem.status = "nuvem";
    } catch (e) {
      const codigo = e && e.code;
      if (codigo === "unavailable") setTimeout(salvarNuvem, 2500 + Math.random() * 2500);
      else { nuvem.ref = null; nuvem.status = "local"; }
    } finally {
      nuvem.salvando = false;
      if (nuvem.pendente) { nuvem.pendente = false; salvarNuvem(); }
    }
  }
  async function iniciarNuvem() {
    try {
      if (!window.claude || !window.claude.use) return;
      const [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
      if (!db || !user) return;
      const id = await user.id();
      if (!id) return;
      const ref = db.doc("data/users/" + id + "/progresso");
      const snap = await ref.get();
      nuvem.ref = ref;
      nuvem.status = "nuvem";
      if (snap.exists) {
        const antes = JSON.stringify(estado);
        estado = mesclar(estado, snap.data());
        salvarLocal();
        if (JSON.stringify(estado) !== antes && !sessao) render();
        if ((estado.atualizado || 0) > (snap.data().atualizado || 0)) salvarNuvem();
      } else if (estado.atualizado) {
        salvarNuvem();
      }
      if (vista === "perfil" && !sessao) render();
    } catch { nuvem.ref = null; nuvem.status = "local"; }
  }

  /* ================= regras do jogo ================= */
  const xpTotal = () => Object.values(estado.dias).reduce((a, b) => a + b, 0);
  const xpHoje = () => estado.dias[hoje()] || 0;
  function ganharXP(n) { if (n <= 0) return; const d = hoje(); estado.dias[d] = (estado.dias[d] || 0) + n; }
  function ofensiva() {
    const dias = new Set(Object.keys(estado.dias).filter((d) => estado.dias[d] > 0));
    if (!dias.size) return 0;
    const primeiro = [...dias].sort()[0];
    let dia = dias.has(hoje()) ? hoje() : addDias(hoje(), -1);
    let n = 0;
    const folgas = new Set();
    for (;;) {
      if (dias.has(dia)) n++;
      else {
        const s = semanaISO(dia);
        if (folgas.has(s) || dia < primeiro) break;
        folgas.add(s);
      }
      dia = addDias(dia, -1);
    }
    return n;
  }
  function nivel(xp = xpTotal()) {
    let i = 0;
    while (i + 1 < NIVEIS.length && xp >= NIVEIS[i + 1][0]) i++;
    return { i, nome: NIVEIS[i][1], base: NIVEIS[i][0], proximo: NIVEIS[i + 1] || null };
  }
  const exEstado = (id) => estado.ex[chave(id)];
  const exFeito = (id) => !!exEstado(id);
  const licaoFeita = (l) => l.exercicios.every((e) => exFeito(e.id));
  const unidadeFeita = (u) => u.licoes.every(licaoFeita);
  function licaoLiberada(l) { const i = LICOES.indexOf(l); return i === 0 || licaoFeita(LICOES[i - 1]); }
  const licaoAtual = () => LICOES.find((l) => !licaoFeita(l));
  const exCorretos = () => Object.values(estado.ex).filter((e) => e.status === "ok").length;
  function vencidos() {
    const d = hoje();
    return Object.keys(EXERCICIOS).filter((id) => { const e = exEstado(id); return e && e.prox && e.prox <= d; });
  }
  function cartoesLiberados() { return CARTOES.map((c, i) => ({ ...c, i })).filter((c) => { const l = LICOES.find((x) => x.id === c.licao); return l && licaoFeita(l); }); }
  function cartoesVencidos() { const d = hoje(); return cartoesLiberados().filter((c) => { const s = estado.cartoes["c" + c.i]; return !s || (s.prox && s.prox <= d); }); }

  function conquistas() {
    const corretos = exCorretos();
    const st = ofensiva();
    const bosses = CURSO.filter((u) => estado.boss[u.boss.id] && estado.boss[u.boss.id].passou).length;
    return [
      [corretos >= 1, "Primeira consulta certa", "Acertou o primeiro desafio"],
      [corretos >= 25, "25 desafios", "Acertou 25 desafios"],
      [LICOES.every(licaoFeita), "Mês 1 concluído", "Terminou todas as 18 lições"],
      [bosses >= 1, "Derrotou um chefão", "Passou em um desafio de sábado"],
      [bosses >= 4, "Prova do Mês", "Passou nos 4 chefões"],
      [st >= 7, "Ofensiva de 7 dias", "Uma semana sem quebrar a corrente"],
      [st >= 30, "Ofensiva de 30 dias", "Um mês inteiro de hábito"],
      [estado.revisoes >= 1, "Primeira revisão", "Refez um desafio antigo no Treino"],
      [estado.cartoesTotal >= 100, "100 cartões", "Revisou 100 cartões de memória"],
    ];
  }

  /* ================= motor SQL ================= */
  const motor = { SQL: null, bytes: null, erro: null, cache: {} };
  function carregarMotor() {
    const s = document.createElement("script");
    s.src = SQLJS_URL;
    s.onload = async () => {
      try {
        motor.SQL = await window.initSqlJs();
        motor.bytes = window.Motor.montarBanco(motor.SQL, DADOS);
      } catch (e) { motor.erro = String(e && e.message || e); }
      if (sessao) render();
    };
    s.onerror = () => { motor.erro = "Não foi possível baixar o motor SQL. Verifique a conexão e recarregue a página."; if (sessao) render(); };
    document.head.append(s);
  }
  function rodar(sql) {
    const db = window.Motor.abrirBanco(motor.SQL, motor.bytes);
    try { return window.Motor.executar(db, sql); } finally { db.close(); }
  }
  function esperado(ex) {
    if (!motor.cache[ex.id]) motor.cache[ex.id] = rodar(ex.sql).linhas;
    return motor.cache[ex.id];
  }

  /* ================= navegação e sessões ================= */
  let vista = "trilha";
  let sessao = null;
  let gavetaAberta = false;
  let relogioBoss = null;

  function novoPasso(ex) { return { tipo: "ex", ex, tentativas: 0, status: "aberto", sql: "", resultado: null, erro: null, dica: false, solucao: false }; }

  function iniciarLicao(l) {
    sessao = { tipo: "licao", titulo: l.titulo, licao: l, passos: [{ tipo: "conceito", licao: l, sql: l.exemplo, resultado: null, erro: null }, ...l.exercicios.map(novoPasso)], i: 0, xp: 0, acertosPrimeira: 0, retorno: null, fim: false };
    render(true);
  }
  function iniciarBoss(b) {
    sessao = { tipo: "boss", titulo: b.titulo, boss: b, passos: [{ tipo: "intro", boss: b }, ...b.exercicios.map(novoPasso)], i: 0, xp: 0, retorno: null, fim: false, prazo: null };
    render(true);
  }
  function iniciarRevisao(ids, titulo) {
    sessao = { tipo: "revisao", titulo, passos: ids.map((id) => novoPasso(EXERCICIOS[id])), i: 0, xp: 0, retorno: null, fim: false };
    render(true);
  }
  function iniciarCartoes() {
    const fila = embaralhar(cartoesVencidos()).slice(0, 12);
    sessao = { tipo: "cartoes", titulo: "Cartões de memória", fila, i: 0, virado: false, acertos: 0, total: fila.length, fim: false, xp: 0 };
    render(true);
  }
  function sair() {
    clearInterval(relogioBoss); relogioBoss = null;
    sessao = null;
    render(true);
  }

  /* ---- verificação de um desafio ---- */
  function executarPasso(p) {
    p.erro = null; p.resultado = null;
    if (!p.sql.trim()) { p.erro = "Escreva uma consulta primeiro."; return; }
    try { p.resultado = rodar(p.sql); } catch (e) { p.erro = String(e.message || e); }
  }

  function registrarAcerto(p) {
    const id = p.ex.id;
    const atual = exEstado(id);
    const d = hoje();
    let ganho = 0;
    if (sessao.tipo === "revisao") {
      ganho = 10;
      estado.revisoes++;
      const caixa = Math.min((atual && atual.caixa || 1) + 1, 5);
      estado.ex[chave(id)] = { ...(atual || {}), status: "ok", caixa, prox: caixa < 5 ? addDias(d, INTERVALO[caixa]) : null };
    } else {
      const primeira = p.tentativas === 0;
      if (!atual || atual.status !== "ok") ganho = p.ex.xp;
      if (!atual || atual.status !== "ok") {
        const caixa = primeira ? 2 : 1;
        estado.ex[chave(id)] = { status: "ok", em: d, caixa, prox: addDias(d, INTERVALO[caixa]) };
      }
      if (primeira && sessao.tipo === "licao") sessao.acertosPrimeira++;
    }
    ganharXP(ganho);
    sessao.xp += ganho;
    salvar();
    return ganho;
  }

  function registrarVisto(p) {
    const id = p.ex.id;
    const atual = exEstado(id);
    const d = hoje();
    if (!atual || atual.status !== "ok" || sessao.tipo === "revisao")
      estado.ex[chave(id)] = { ...(atual || {}), status: atual && atual.status === "ok" ? "ok" : "visto", em: (atual && atual.em) || d, caixa: 1, prox: addDias(d, 1) };
    salvar();
  }

  function verificar(p) {
    executarPasso(p);
    if (p.erro) {
      p.tentativas++;
      sessao.retorno = { ok: false, titulo: "A consulta deu erro", msg: "Leia a mensagem abaixo do editor, corrija e tente de novo." };
      render(); return;
    }
    let esp;
    try { esp = esperado(p.ex); } catch (e) { p.erro = "Erro interno no gabarito: " + e.message; render(); return; }
    const c = window.Motor.comparar(esp, p.resultado.linhas, window.Motor.ehOrdenado(p.ex.sql));
    if (c.ok) {
      const ganho = registrarAcerto(p);
      p.status = "ok";
      const frases = ["Mandou bem!", "Perfeito!", "É isso aí!", "Consulta certeira!", "Excelente!"];
      sessao.retorno = { ok: true, titulo: frases[Math.floor(Math.random() * frases.length)], msg: ganho ? `+${ganho} XP` : "Você já tinha ganhado o XP deste desafio." };
    } else {
      p.tentativas++;
      sessao.retorno = { ok: false, titulo: "Quase!", msg: c.msg, esperado: c.esperado, obtido: c.obtido };
    }
    render();
  }

  function avancar() {
    sessao.retorno = null;
    if (sessao.i < sessao.passos.length - 1) {
      sessao.i++;
      if (sessao.tipo === "boss" && sessao.passos[sessao.i].tipo === "ex" && !sessao.prazo) iniciarRelogio();
    } else terminar();
    render(true);
  }

  function terminar() {
    sessao.fim = true;
    clearInterval(relogioBoss); relogioBoss = null;
    if (sessao.tipo === "boss") {
      const b = sessao.boss;
      const acertos = sessao.passos.filter((p) => p.tipo === "ex" && p.status === "ok").length;
      const total = b.exercicios.length;
      const passou = acertos >= Math.ceil(total * 0.6);
      const antes = estado.boss[b.id];
      estado.boss[b.id] = { melhor: Math.max(acertos, antes ? antes.melhor : 0), total, passou: passou || !!(antes && antes.passou) };
      sessao.resultadoBoss = { acertos, total, passou };
      salvar();
    }
    if (sessao.xp > 0) setTimeout(soltarConfete, 60);
  }

  function iniciarRelogio() {
    sessao.prazo = Date.now() + sessao.boss.minutos * 60000;
    clearInterval(relogioBoss);
    relogioBoss = setInterval(() => {
      const el = document.getElementById("cronometro");
      if (!sessao || sessao.tipo !== "boss" || sessao.fim) { clearInterval(relogioBoss); return; }
      const resta = sessao.prazo - Date.now();
      if (resta <= 0) { sessao.retorno = null; terminar(); render(true); return; }
      if (el) { el.lastChild.textContent = formatarTempo(resta); el.classList.toggle("urgente", resta < 5 * 60000); }
    }, 1000);
  }
  const diasTxt = (n) => `${n} dia${n === 1 ? "" : "s"}`;
  const formatarTempo = (ms) => { const s = Math.max(0, Math.round(ms / 1000)); return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; };

  /* ================= componentes ================= */
  function barraTopo() {
    const st = ofensiva();
    const pct = Math.min(1, xpHoje() / estado.meta);
    const circ = 2 * Math.PI * 14;
    const anel = svg(`<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="14" fill="none" stroke="var(--linha)" stroke-width="4"/><circle cx="17" cy="17" r="14" fill="none" stroke="${pct >= 1 ? "var(--ok)" : "var(--ouro)"}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - pct)}"/></svg>`);
    return h("header", { class: "topo" },
      h("div", { class: "topo-interno" },
        h("div", { class: "marca" }, svg(I.logo), h("span", { text: "Trilha do Analista" })),
        h("span", { class: "stat fogo" + (xpHoje() ? "" : " apagado"), title: "Ofensiva: dias seguidos estudando" }, svg(I.chama), st),
        h("span", { class: "stat xp", title: "XP total" }, svg(I.raio), xpTotal()),
        h("span", { class: "anel", title: `Meta diária: ${xpHoje()}/${estado.meta} XP` }, anel, h("b", { text: Math.round(pct * 100) + "%" })),
        h("button", { class: "btn-tabelas", onclick: () => { gavetaAberta = true; render(); }, "aria-label": "Ver tabelas do banco" }, svg(I.tabela), "Tabelas")));
  }

  function navegacao() {
    const n = vencidos().length + (cartoesVencidos().length ? 1 : 0);
    const abas = [["trilha", "Trilha", I.trilha], ["treino", "Treino", I.alvo], ["cartoes", "Cartões", I.cartas], ["perfil", "Perfil", I.pessoa]];
    return h("nav", { class: "navegacao", "aria-label": "Seções" },
      h("div", { class: "navegacao-interna" }, abas.map(([id, nome, icone]) =>
        h("button", { "aria-current": vista === id ? "page" : null, onclick: () => { vista = id; render(true); } },
          svg(icone), nome,
          id === "treino" && vencidos().length ? h("span", { class: "bolinha num", text: vencidos().length }) : null,
          id === "cartoes" && cartoesVencidos().length ? h("span", { class: "bolinha num", text: cartoesVencidos().length }) : null))));
  }

  function gaveta() {
    const descricoes = {
      clientes: "Quem compra: cadastro, localização e canal de aquisição.",
      produtos: "O catálogo: categoria, preço de venda e custo.",
      pedidos: "Cada compra: data, status, pagamento e frete.",
      itens_pedido: "O que foi comprado em cada pedido (1 pedido → N itens).",
      avaliacoes: "Nota de 1 a 5 dada após a entrega (nem todo pedido tem).",
    };
    const chaves = { clientes: ["cliente_id"], produtos: ["produto_id"], pedidos: ["pedido_id", "cliente_id"], itens_pedido: ["pedido_id", "produto_id"], avaliacoes: ["pedido_id"] };
    const fechar = () => { gavetaAberta = false; render(); };
    return [
      h("div", { class: "fundo-gaveta", onclick: fechar }),
      h("aside", { class: "gaveta", role: "dialog", "aria-label": "Tabelas do banco LojaData" },
        h("div", { class: "gaveta-cab" }, h("h2", { class: "titulo-secao", text: "Banco LojaData" }), h("button", { class: "fechar", onclick: fechar, "aria-label": "Fechar" }, svg(I.fechar))),
        h("p", { class: "sub", text: "E-commerce fictício de eletrônicos, pedidos de 2024 e 2025. Datas no formato 'AAAA-MM-DD'." }),
        Object.entries(DADOS).map(([t, { colunas, linhas }]) =>
          h("section", { class: "esquema" },
            h("h3", {}, t, h("span", { text: linhas.length.toLocaleString("pt-BR") + " linhas" })),
            h("p", { class: "sub", style: "padding: 8px 12px 0; font-size: 13px", text: descricoes[t] }),
            h("ul", {}, colunas.map(([c, tipo]) => h("li", {}, h("span", {}, c, chaves[t].includes(c) ? h("em", { text: " · chave" }) : null), h("em", { text: tipo.replace("VARCHAR", "texto").replace(/DECIMAL.*/, "decimal").replace("INTEGER", "inteiro").replace("DATE", "data") }))))))),
    ];
  }

  function tabelaResultado(r) {
    const max = 200;
    const linhas = r.linhas.slice(0, max);
    return h("div", { class: "resultado" },
      h("div", { class: "resultado-cab" }, h("span", { text: "Resultado" }), h("span", { class: "num", text: `${r.linhas.length} linha${r.linhas.length === 1 ? "" : "s"}${r.linhas.length > max ? ` (mostrando ${max})` : ""}` })),
      r.colunas.length ? h("div", { class: "tabela-rolagem" },
        h("table", {},
          h("thead", {}, h("tr", {}, r.colunas.map((c) => h("th", { text: c })))),
          h("tbody", {}, linhas.map((l) => h("tr", {}, l.map((v) => h("td", { class: v == null ? "nulo" : typeof v === "number" ? "numero" : null, text: v == null ? "NULL" : typeof v === "number" && !Number.isInteger(v) ? String(Math.round(v * 10000) / 10000) : String(v) }))))))) : h("p", { class: "sub", style: "padding: 12px", text: "A consulta rodou, mas não devolveu linhas." }));
  }

  const ATALHOS = ["SELECT", "FROM", "WHERE", "*", ",", "=", "'", "(", ")", "AND", "OR", "GROUP BY", "ORDER BY", "DESC", "LIMIT", "AS", "COUNT(*)", "SUM(", "AVG(", "ROUND(", "HAVING", "DISTINCT", "JOIN", "LEFT JOIN", "ON", "IS NULL", "IN (", "LIKE", "BETWEEN", "CASE WHEN", "THEN", "ELSE", "END", "WITH", ";"];

  function editor(passo, aoExecutar, aoVerificar) {
    const ta = h("textarea", { id: "editor-sql", spellcheck: "false", autocapitalize: "off", autocomplete: "off", autocorrect: "off", "aria-label": "Editor SQL", placeholder: "Escreva sua consulta SQL aqui…" });
    ta.value = passo.sql;
    ta.addEventListener("input", () => { passo.sql = ta.value; });
    ta.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && !e.shiftKey) { e.preventDefault(); inserir("  ", false); }
      else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); (e.shiftKey && aoVerificar ? aoVerificar : aoExecutar)(); }
    });
    function inserir(txt, espaco = true) {
      const ini = ta.selectionStart, fim = ta.selectionEnd;
      const antes = ta.value.slice(0, ini);
      const precisaEspaco = espaco && /\w$/.test(antes) && /^\w/.test(txt);
      const extra = espaco && /[\w*)]$/.test(txt) && !/^[,;]$/.test(txt) ? " " : "";
      const ins = (precisaEspaco ? " " : "") + txt + extra;
      ta.setRangeText(ins, ini, fim, "end");
      passo.sql = ta.value;
      ta.focus();
    }
    return h("div", { class: "editor" }, ta,
      h("div", { class: "atalhos", "aria-label": "Inserir palavra-chave" }, ATALHOS.map((a) => h("button", { type: "button", onmousedown: (e) => e.preventDefault(), onclick: () => inserir(a) , text: a }))));
  }

  function blocoResultado(p) {
    if (p.erro) return h("div", { class: "erro-sql", role: "alert", text: p.erro });
    if (p.resultado) return tabelaResultado(p.resultado);
    return null;
  }

  function motorPronto() {
    if (motor.erro) return h("div", { class: "erro-sql", text: motor.erro });
    if (!motor.bytes) return h("div", { class: "carregando", style: "min-height: 120px" }, h("div", { class: "spinner" }), h("p", { text: "Preparando o banco de dados…" }));
    return null;
  }

  /* ================= telas ================= */
  function telaTrilha() {
    const atual = licaoAtual();
    const padrao = [0, 1, 1.6, 1, 0, -1, -1.6, -1];
    let k = 0;
    const d = hoje();
    return h("div", {},
      h("section", { class: "saudacao" },
        h("p", { class: "eyebrow", text: "Mês 1 · SQL e estatística descritiva" }),
        h("h1", { text: atual ? (xpHoje() ? "Continue de onde parou" : "Bora estudar hoje?") : "Mês 1 concluído!" }),
        h("p", { text: atual ? `Próxima lição: ${atual.titulo} (${atual.tema}). Cada lição leva de 30 a 60 minutos.` : "Você terminou todas as lições. Revise no Treino e encare os chefões que faltarem." })),
      CURSO.map((u) => {
        const feitas = u.licoes.filter(licaoFeita).length;
        const bossLiberado = unidadeFeita(u);
        const bossEst = estado.boss[u.boss.id];
        return h("section", { class: "unidade", style: `--cor: ${u.cor}; --cor-fundo: ${u.corFundo}` },
          h("div", { class: "faixa-unidade" },
            h("div", {}, h("p", { class: "rotulo", text: `Unidade ${u.num} · Semana ${u.num}` }), h("h2", { text: u.nome }), h("p", { text: u.resumo })),
            h("span", { class: "progresso-unidade num", text: `${feitas}/${u.licoes.length}` })),
          h("div", { class: "caminho" },
            u.licoes.map((l) => {
              const feita = licaoFeita(l), liberada = licaoLiberada(l), eAtual = l === atual;
              const x = padrao[k++ % padrao.length];
              return h("div", { class: "no" + (feita ? " feito" : "") + (eAtual ? " atual" : ""), style: `--x: ${x * 40}px` },
                eAtual ? h("span", { class: "balao", text: xpHoje() ? "Continuar" : "Começar" }) : null,
                h("button", { class: "no-botao", disabled: !liberada, onclick: () => iniciarLicao(l), "aria-label": `${l.titulo}${feita ? " (concluída)" : liberada ? "" : " (bloqueada)"}` },
                  feita ? svg(I.check) : liberada ? l.id : svg(I.cadeado)),
                h("span", { class: "no-nome", text: l.titulo }),
                h("span", { class: "no-tema", text: l.tema }));
            }),
            (() => {
              const x = padrao[k++ % padrao.length];
              return h("div", { class: "no boss" + (bossEst && bossEst.passou ? " feito" : "") + (bossLiberado && !(bossEst && bossEst.passou) && !atual ? " atual" : ""), style: `--x: ${x * 40}px` },
                h("button", { class: "no-botao", disabled: !bossLiberado, onclick: () => iniciarBoss(u.boss), "aria-label": `Chefão: ${u.boss.titulo}${bossLiberado ? "" : " (termine as lições da unidade)"}` }, bossLiberado ? svg(I.coroa) : svg(I.cadeado)),
                h("span", { class: "no-nome", text: u.boss.titulo }),
                h("span", { class: "no-tema", text: bossEst ? `Melhor: ${bossEst.melhor}/${bossEst.total} · ${u.boss.minutos} min` : `Chefão · ${u.boss.minutos} min` }));
            })()));
      }),
      h("p", { class: "sub", style: "text-align:center; margin-top: 10px", text: `Revisões pendentes hoje: ${vencidos().length} · ${d.split("-").reverse().join("/")}` }));
  }

  function telaTreino() {
    const v = vencidos();
    const resolvidos = Object.keys(EXERCICIOS).filter((id) => exFeito(id));
    const porCaixa = [1, 2, 3, 4, 5].map((c) => resolvidos.filter((id) => (exEstado(id).caixa || 1) === c).length);
    return h("div", { class: "pilha" },
      h("div", {}, h("h1", { class: "titulo-secao", text: "Treino" }), h("p", { class: "sub", text: "Repetição espaçada: refaça do zero os desafios que estão para vencer. Acertou, ele volta mais tarde; errou, volta amanhã." })),
      h("div", { class: "painel pilha" },
        h("h2", { style: "font-size: 19px", text: v.length ? `${v.length} desafio${v.length > 1 ? "s" : ""} para revisar hoje` : "Nenhuma revisão vencida hoje" }),
        h("p", { class: "sub", text: v.length ? "Cada revisão certa vale +10 XP e avança o desafio para a próxima caixa." : resolvidos.length ? "Volte amanhã, ou faça um treino livre agora." : "Faça a primeira lição na Trilha para começar a acumular revisões." }),
        h("div", { class: "acoes" },
          h("button", { class: "botao", disabled: !v.length, onclick: () => iniciarRevisao(embaralhar(v).slice(0, 6), "Revisão do dia") }, "Revisar agora"),
          h("button", { class: "botao secundario", disabled: resolvidos.length < 1, onclick: () => iniciarRevisao(embaralhar(resolvidos).slice(0, 5), "Treino livre") }, "Treino livre"))),
      h("div", {}, h("h2", { style: "font-size: 17px; margin-bottom: 8px", text: "Suas caixas" }),
        h("div", { class: "caixinhas" }, ["1 dia", "3 dias", "7 dias", "21 dias", "Dominado"].map((n, i) => h("div", { class: "caixinha" }, h("b", { text: porCaixa[i] }), h("span", { text: i < 4 ? `Caixa ${i + 1} · ${n}` : n }))))),
      v.length ? h("div", { class: "lista" }, v.map((id) => h("div", { class: "item" }, h("span", { class: "rotulo-id", text: id }), h("div", { class: "item-texto", html: EXERCICIOS[id].texto })))) : null);
  }

  function telaCartoes() {
    const lib = cartoesLiberados();
    const venc = cartoesVencidos();
    const porCaixa = [1, 2, 3, 4, 5].map((c) => lib.filter((x) => { const s = estado.cartoes["c" + x.i]; return s && s.caixa === c; }).length);
    return h("div", { class: "pilha" },
      h("div", {}, h("h1", { class: "titulo-secao", text: "Cartões de memória" }), h("p", { class: "sub", text: "Conceitos que caem em entrevista. Cada lição concluída libera novos cartões. A primeira sessão do dia vale +5 XP." })),
      h("div", { class: "painel pilha" },
        h("h2", { style: "font-size: 19px", text: venc.length ? `${venc.length} cartão${venc.length > 1 ? "ões" : ""} para hoje` : lib.length ? "Tudo revisado por hoje" : "Nenhum cartão liberado ainda" }),
        h("p", { class: "sub", text: `${lib.length} de ${CARTOES.length} cartões liberados.` }),
        h("button", { class: "botao", disabled: !venc.length, onclick: iniciarCartoes }, "Revisar cartões")),
      h("div", { class: "caixinhas" }, ["Novo/1 dia", "3 dias", "7 dias", "21 dias", "Dominado"].map((n, i) => h("div", { class: "caixinha" }, h("b", { text: i === 0 ? lib.length - porCaixa.slice(1).reduce((a, b) => a + b, 0) : porCaixa[i] }), h("span", { text: n })))));
  }

  function telaPerfil() {
    const xp = xpTotal();
    const nv = nivel(xp);
    const pctNivel = nv.proximo ? (xp - nv.base) / (nv.proximo[0] - nv.base) : 1;
    const dias = [];
    const d0 = hoje();
    const offset = (new Date().getDay() + 6) % 7;
    for (let i = 34 - (6 - offset); i >= -(6 - offset); i--) dias.push(addDias(d0, -i));
    const cls = (d) => { const x = estado.dias[d] || 0; return (x === 0 ? "" : x < estado.meta / 2 ? "n1" : x < estado.meta ? "n2" : "n3") + (d === d0 ? " hoje" : ""); };
    let confirmando = false;
    const btnApagar = h("button", { class: "link", style: "color: var(--erro)" }, "Apagar meu progresso");
    btnApagar.addEventListener("click", () => {
      if (!confirmando) { confirmando = true; btnApagar.textContent = "Toque de novo para apagar tudo (não dá para desfazer)"; return; }
      estado = novoEstado(); estado.atualizado = Date.now(); salvar(); salvarNuvem(); render(true);
    });
    return h("div", { class: "pilha" },
      h("div", { class: "painel pilha" },
        h("p", { class: "eyebrow", text: `Nível ${nv.i + 1} de ${NIVEIS.length}` }),
        h("h1", { class: "titulo-secao", text: nv.nome }),
        h("div", { class: "nivel-barra" }, h("i", { style: `width: ${Math.round(pctNivel * 100)}%` })),
        h("p", { class: "sub num", text: nv.proximo ? `${xp} XP · faltam ${nv.proximo[0] - xp} XP para ${nv.proximo[1]}` : `${xp} XP · nível máximo!` })),
      h("div", { class: "grade-2" },
        h("div", { class: "metrica" }, h("b", { text: ofensiva() }), h("span", { text: "dias de ofensiva" })),
        h("div", { class: "metrica" }, h("b", { text: xp }), h("span", { text: "XP total" })),
        h("div", { class: "metrica" }, h("b", { text: `${exCorretos()}/${TOTAL_EX}` }), h("span", { text: "desafios certos" })),
        h("div", { class: "metrica" }, h("b", { text: `${LICOES.filter(licaoFeita).length}/${LICOES.length}` }), h("span", { text: "lições concluídas" }))),
      h("div", { class: "painel pilha" },
        h("h2", { style: "font-size: 17px", text: "Últimas 5 semanas" }),
        h("div", { class: "calendario" }, dias.map((d) => h("i", { class: cls(d), title: `${d.split("-").reverse().join("/")}: ${estado.dias[d] || 0} XP` }))),
        h("p", { class: "sub", text: "Você tem 1 folga por semana que não quebra a ofensiva." })),
      h("div", { class: "painel pilha" },
        h("h2", { style: "font-size: 17px", text: "Meta diária" }),
        h("div", { class: "opcoes", role: "group", "aria-label": "Meta diária de XP" }, [[20, "Leve"], [30, "Regular"], [50, "Puxado"], [80, "Intenso"]].map(([m, n]) =>
          h("button", { "aria-pressed": estado.meta === m ? "true" : "false", onclick: () => { estado.meta = m; salvar(); render(); } }, `${n} · ${m} XP`)))),
      h("div", { class: "pilha" }, h("h2", { style: "font-size: 17px", text: "Conquistas" }),
        conquistas().map(([ok, nome, desc]) => h("div", { class: "conquista" + (ok ? "" : " bloqueada") }, h("span", { class: "medalha" }, svg(I.coroa)), h("div", {}, h("b", { text: nome }), h("span", { text: desc }))))),
      h("p", { class: "status-salvo", text: nuvem.status === "nuvem" ? "Progresso salvo na sua conta do Claude: continua de onde parou em qualquer aparelho." : "Progresso salvo neste navegador." }),
      btnApagar);
  }

  /* ---- sessão ---- */
  function telaSessao() {
    const s = sessao;
    if (s.tipo === "cartoes") return telaSessaoCartoes();
    if (s.fim) return telaFim();
    const p = s.passos[s.i];
    const progresso = (s.i + (p.status && p.status !== "aberto" ? 1 : 0)) / s.passos.length;
    const topo = h("div", { class: "licao-topo" },
      h("button", { class: "fechar", onclick: sair, "aria-label": "Sair da lição" }, svg(I.fechar)),
      h("div", { class: "barra", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": Math.round(progresso * 100) }, h("i", { style: `width: ${Math.max(4, progresso * 100)}%` })),
      s.tipo === "boss" && s.prazo ? h("span", { class: "cronometro", id: "cronometro" }, svg(I.relogio), h("span", { text: formatarTempo(s.prazo - Date.now()) })) : null);

    let corpo;
    if (p.tipo === "conceito") corpo = passoConceito(p);
    else if (p.tipo === "intro") corpo = passoIntroBoss(p);
    else corpo = passoExercicio(p);
    return h("div", {}, topo, corpo, s.retorno ? retorno() : null);
  }

  function passoConceito(p) {
    const l = p.licao;
    const rodarExemplo = () => { if (!motor.bytes) return; executarPasso(p); render(); };
    return h("div", { class: "pilha" },
      h("p", { class: "eyebrow", text: `${l.id} · ${l.tema}` }),
      h("h1", { class: "titulo-secao", style: "font-size: 28px", text: l.titulo }),
      h("div", { class: "conceito", html: l.conceito }),
      h("div", { class: "pilha", style: "gap: 10px" },
        h("p", { style: "font-weight: 700", text: "Experimente: rode o exemplo e mude o que quiser." }),
        motorPronto() || [editor(p, rodarExemplo), h("div", { class: "acoes" }, h("button", { class: "botao secundario", onclick: rodarExemplo }, "Executar")), blocoResultado(p)]),
      h("button", { class: "botao largo", onclick: avancar }, `Começar os ${l.exercicios.length} desafios`));
  }

  function passoIntroBoss(p) {
    const b = p.boss;
    return h("div", { class: "celebracao" },
      h("span", { style: `color: ${b.unidade.cor}` }, svg(I.coroa.replace('width="34" height="34"', 'width="96" height="96"'))),
      h("p", { class: "eyebrow", text: `Chefão da unidade ${b.unidade.num}` }),
      h("h1", { text: b.titulo }),
      h("p", { class: "sub", style: "max-width: 52ch", text: b.historia }),
      h("div", { class: "caixas-fim" },
        h("div", { class: "caixa-fim", style: "--c: var(--azul)" }, h("span", { text: "Questões" }), h("b", { text: b.exercicios.length })),
        h("div", { class: "caixa-fim", style: "--c: var(--fogo)" }, h("span", { text: "Tempo" }), h("b", { text: `${b.minutos} min` })),
        h("div", { class: "caixa-fim", style: "--c: var(--ok)" }, h("span", { text: "Para passar" }), h("b", { text: `${Math.ceil(b.exercicios.length * 0.6)} acertos` }))),
      h("p", { class: "sub", text: "Sem dicas nem gabarito durante a prova. Você pode tentar cada questão quantas vezes quiser, ou pular." }),
      h("button", { class: "botao largo", style: "max-width: 460px", onclick: avancar }, "Começar a prova"));
  }

  function passoExercicio(p) {
    const s = sessao;
    const ex = p.ex;
    const eBoss = s.tipo === "boss";
    const resolvido = p.status === "ok" || p.status === "visto";
    const exec = () => { if (!motor.bytes) return; executarPasso(p); render(); };
    const verif = () => { if (!motor.bytes || resolvido) return; verificar(p); };
    const numero = s.passos.filter((x) => x.tipo === "ex").indexOf(p) + 1;
    const qtd = s.passos.filter((x) => x.tipo === "ex").length;
    const jaFeito = exEstado(ex.id);
    return h("div", { class: "pilha" },
      h("p", { class: "enunciado-id" }, `${s.tipo === "revisao" ? s.titulo : eBoss ? "Questão" : "Desafio"} ${numero} de ${qtd} · ${ex.id}`,
        h("span", { class: "xp-pilula num", text: s.tipo === "revisao" ? "+10 XP" : jaFeito && jaFeito.status === "ok" ? "feito" : `+${ex.xp} XP` })),
      h("div", { class: "enunciado", html: ex.texto }),
      motorPronto() || [
        editor(p, exec, verif),
        h("div", { class: "acoes" },
          h("button", { class: "botao secundario", onclick: exec }, "Executar"),
          h("button", { class: "botao", disabled: resolvido, onclick: verif }, "Verificar")),
        h("p", { class: "tecla", text: "Atalhos: Ctrl+Enter executa · Ctrl+Shift+Enter verifica" }),
        blocoResultado(p),
        !eBoss ? h("div", { class: "ajuda" },
          ex.dica && !p.dica ? h("button", { class: "link", onclick: () => { p.dica = true; render(); } }, "Ver dica") : null,
          p.tentativas >= 2 && !p.solucao && p.status !== "ok" ? h("button", { class: "link", onclick: () => { p.solucao = true; p.status = "visto"; registrarVisto(p); sessao.retorno = null; render(); } }, "Ver solução") : null) : null,
        p.dica ? h("p", { class: "dica" }, h("b", { text: "Dica: " }), ex.dica) : null,
        p.solucao ? h("div", { class: "solucao" },
          h("p", { style: "font-weight: 700", text: "Uma solução possível (sem XP desta vez; ele volta amanhã no Treino):" }),
          h("pre", { class: "codigo", text: ex.sql }),
          h("div", { class: "acoes" },
            h("button", { class: "botao secundario", onclick: () => { p.sql = ex.sql; executarPasso(p); render(); } }, "Copiar para o editor"),
            h("button", { class: "botao", onclick: avancar }, "Continuar"))) : null,
        eBoss ? h("button", { class: "link", onclick: () => { if (p.status === "aberto") p.status = "pulado"; avancar(); } }, numero < qtd ? "Pular para a próxima questão" : "Entregar a prova") : null,
      ]);
  }

  function retorno() {
    const r = sessao.retorno;
    const p = sessao.passos[sessao.i];
    const fechar = () => { sessao.retorno = null; render(); document.getElementById("editor-sql")?.focus(); };
    const fmt = (linha) => "(" + linha.map((v) => (v == null ? "NULL" : typeof v === "string" ? `'${v}'` : v)).join(", ") + ")";
    return h("div", { class: "retorno " + (r.ok ? "ok" : "erro"), role: "status" },
      h("div", { class: "retorno-interno" },
        h("h3", { text: r.titulo }),
        h("p", { class: "num", style: r.ok ? "font-weight: 800" : null, text: r.msg }),
        !r.ok && r.esperado ? h("div", { class: "comparacao" },
          h("span", {}, "esperado: ", fmt(r.esperado)),
          h("span", {}, "obtido:   ", fmt(r.obtido))) : null,
        r.ok ? h("button", { class: "botao ok largo", id: "btn-continuar", onclick: avancar }, "Continuar")
          : h("div", { class: "acoes" },
            h("button", { class: "botao erro", id: "btn-continuar", onclick: fechar }, "Tentar de novo"),
            sessao.tipo === "boss" ? null : p.tentativas >= 2 ? h("button", { class: "botao secundario", onclick: () => { p.solucao = true; p.status = "visto"; registrarVisto(p); sessao.retorno = null; render(); } }, "Ver solução") : null)));
  }

  function telaFim() {
    const s = sessao;
    let titulo, texto, caixas;
    if (s.tipo === "boss") {
      const r = s.resultadoBoss;
      titulo = r.passou ? "Chefão derrotado!" : "Não foi dessa vez";
      texto = r.passou ? "Você resolveu problemas de negócio sob pressão, sem consulta. É exatamente isso que um teste técnico cobra." : `Precisava de ${Math.ceil(r.total * 0.6)} acertos. Revise no Treino por alguns dias e tente de novo: o XP que você ganhou fica.`;
      caixas = [["Acertos", `${r.acertos}/${r.total}`, "var(--ok)"], ["XP ganho", `+${s.xp}`, "var(--ouro)"], ["Ofensiva", diasTxt(ofensiva()), "var(--fogo)"]];
    } else if (s.tipo === "licao") {
      const n = s.licao.exercicios.length;
      titulo = "Lição concluída!";
      texto = licaoAtual() ? `Próxima: ${licaoAtual().titulo}. Novos cartões de memória foram liberados.` : "Você concluiu todas as lições do Mês 1!";
      caixas = [["XP ganho", `+${s.xp}`, "var(--ouro)"], ["De primeira", `${Math.round((s.acertosPrimeira / n) * 100)}%`, "var(--ok)"], ["Ofensiva", diasTxt(ofensiva()), "var(--fogo)"]];
    } else {
      titulo = "Revisão feita!";
      texto = "Os desafios que você acertou voltam daqui a mais tempo. Os outros, amanhã.";
      caixas = [["XP ganho", `+${s.xp}`, "var(--ouro)"], ["Acertos", `${s.passos.filter((p) => p.status === "ok").length}/${s.passos.length}`, "var(--ok)"], ["Ofensiva", diasTxt(ofensiva()), "var(--fogo)"]];
    }
    const metaBatida = xpHoje() >= estado.meta;
    const perdidas = s.tipo === "boss" ? s.passos.filter((p) => p.tipo === "ex" && p.status !== "ok") : [];
    return h("div", { class: "celebracao" },
      h("span", { style: "color: var(--ouro)" }, svg(I.coroa.replace('width="34" height="34"', 'width="110" height="110"'))),
      h("h1", { text: titulo }),
      h("p", { class: "sub", style: "max-width: 52ch", text: texto }),
      h("div", { class: "caixas-fim" }, caixas.map(([r, v, c]) => h("div", { class: "caixa-fim", style: `--c: ${c}` }, h("span", { text: r }), h("b", { class: "num", text: v })))),
      metaBatida ? h("p", { style: "font-weight: 800; color: var(--ok)", text: "Meta diária batida!" }) : h("p", { class: "sub num", text: `Meta de hoje: ${xpHoje()}/${estado.meta} XP` }),
      perdidas.length ? h("details", { class: "painel", style: "width: 100%; text-align: left" },
        h("summary", { style: "font-weight: 800; cursor: pointer", text: `Ver gabarito das ${perdidas.length} questões que faltaram` }),
        h("div", { class: "pilha", style: "margin-top: 12px" }, perdidas.map((p) => h("div", { class: "pilha", style: "gap: 6px" }, h("div", { class: "enunciado", style: "font-size: 15px", html: `<b>${p.ex.id}</b> · ${p.ex.texto}` }), h("pre", { class: "codigo", text: p.ex.sql }))))) : null,
      h("button", { class: "botao largo", style: "max-width: 460px", onclick: sair }, "Continuar"));
  }

  function telaSessaoCartoes() {
    const s = sessao;
    if (s.fim || s.i >= s.fila.length) {
      if (!s.fim) {
        s.fim = true;
        if (estado.cartoesDia !== hoje() && s.total) { estado.cartoesDia = hoje(); ganharXP(5); s.xp = 5; }
        salvar();
      }
      return h("div", { class: "celebracao" },
        h("span", { style: "color: var(--azul)" }, svg(I.cartas.replace('width="24" height="24"', 'width="96" height="96"'))),
        h("h1", { text: "Cartões revisados!" }),
        h("div", { class: "caixas-fim" },
          h("div", { class: "caixa-fim", style: "--c: var(--ok)" }, h("span", { text: "Lembrou" }), h("b", { class: "num", text: `${s.acertos}/${s.total}` })),
          h("div", { class: "caixa-fim", style: "--c: var(--ouro)" }, h("span", { text: "XP" }), h("b", { class: "num", text: `+${s.xp}` }))),
        h("button", { class: "botao largo", style: "max-width: 460px", onclick: sair }, "Continuar"));
    }
    const c = s.fila[s.i];
    const responder = (lembrou) => {
      const k = "c" + c.i;
      const atual = estado.cartoes[k];
      const caixa = lembrou ? Math.min((atual ? atual.caixa : 0) + 1, 5) : 1;
      estado.cartoes[k] = { caixa, prox: caixa < 5 ? addDias(hoje(), lembrou ? INTERVALO[caixa] : 1) : null };
      estado.cartoesTotal++;
      if (lembrou) s.acertos++;
      s.i++; s.virado = false;
      salvar();
      render(true);
    };
    return h("div", { class: "pilha" },
      h("div", { class: "licao-topo" },
        h("button", { class: "fechar", onclick: sair, "aria-label": "Sair" }, svg(I.fechar)),
        h("div", { class: "barra" }, h("i", { style: `width: ${Math.max(4, (s.i / s.total) * 100)}%` })),
        h("span", { class: "cronometro num", text: `${s.i + 1}/${s.total}` })),
      h("div", { class: "flash" },
        h("p", { class: "frente", text: c.f }),
        s.virado ? h("p", { class: "verso", text: c.v }) : null),
      s.virado
        ? h("div", { class: "acoes" },
          h("button", { class: "botao erro", onclick: () => responder(false) }, "Não lembrei"),
          h("button", { class: "botao ok", onclick: () => responder(true) }, "Lembrei"))
        : h("button", { class: "botao largo", onclick: () => { s.virado = true; render(); } }, "Mostrar resposta"));
  }

  /* ================= confete ================= */
  function soltarConfete() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = h("canvas", { class: "confete", "aria-hidden": "true" });
    document.body.append(cv);
    const ctx = cv.getContext("2d");
    const W = (cv.width = innerWidth), H = (cv.height = innerHeight);
    const cores = ["#2b59e0", "#e9a800", "#178a4f", "#f2611d", "#7d4bd6", "#0d8b7d"];
    const ps = Array.from({ length: 120 }, () => ({ x: W / 2 + (Math.random() - 0.5) * 80, y: H * 0.35, vx: (Math.random() - 0.5) * 12, vy: -Math.random() * 12 - 4, r: Math.random() * 6 + 4, c: cores[Math.floor(Math.random() * cores.length)], a: Math.random() * 6 }));
    let t = 0;
    (function quadro() {
      ctx.clearRect(0, 0, W, H);
      ps.forEach((p) => { p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.a += 0.2; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
      if (++t < 110) requestAnimationFrame(quadro); else cv.remove();
    })();
  }

  /* ================= render ================= */
  const raiz = document.getElementById("app");
  function render(rolarTopo) {
    const foco = document.activeElement && document.activeElement.id;
    const sel = foco === "editor-sql" ? [document.activeElement.selectionStart, document.activeElement.selectionEnd] : null;
    raiz.replaceChildren();
    if (!sessao) raiz.append(barraTopo());
    const main = h("main", { style: sessao ? "padding-bottom: 200px" : null });
    if (sessao) main.append(telaSessao());
    else main.append(vista === "treino" ? telaTreino() : vista === "cartoes" ? telaCartoes() : vista === "perfil" ? telaPerfil() : telaTrilha());
    raiz.append(main);
    if (!sessao) raiz.append(navegacao());
    if (gavetaAberta) raiz.append(...gaveta());
    if (rolarTopo) window.scrollTo(0, 0);
    if (foco === "editor-sql" && !(sessao && sessao.retorno)) {
      const ta = document.getElementById("editor-sql");
      if (ta) { ta.focus({ preventScroll: true }); if (sel) ta.setSelectionRange(sel[0], sel[1]); }
    }
    if (sessao && sessao.retorno) document.getElementById("btn-continuar")?.focus({ preventScroll: true });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && gavetaAberta) { gavetaAberta = false; render(); }
  });

  render();
  carregarMotor();
  iniciarNuvem();
})();
