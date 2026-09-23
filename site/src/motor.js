/* Motor SQL do site: SQLite (sql.js) + funções no estilo DuckDB/PostgreSQL,
   e o corretor que compara o resultado do aluno com o do gabarito.
   Funciona no navegador (window.Motor) e no Node (module.exports), para teste. */
(function (raiz) {
  "use strict";

  const TIPOS = { INTEGER: "INTEGER", VARCHAR: "TEXT", DATE: "TEXT" };
  const tipoSqlite = (t) => TIPOS[t] || (t.startsWith("DECIMAL") ? "REAL" : "TEXT");

  const texto = (d) => (d == null ? null : String(d));
  const parteData = (d, ini, fim) => (d == null ? null : Number(String(d).slice(ini, fim)));

  function isodow(d) {
    if (d == null) return null;
    const [a, m, dia] = String(d).slice(0, 10).split("-").map(Number);
    const js = new Date(Date.UTC(a, m - 1, dia)).getUTCDay(); // 0 = domingo
    return js === 0 ? 7 : js;
  }

  function dateTrunc(parte, d) {
    if (d == null) return null;
    const s = String(d).slice(0, 10);
    const p = String(parte).toLowerCase();
    if (p === "year") return s.slice(0, 4) + "-01-01";
    if (p === "month") return s.slice(0, 7) + "-01";
    if (p === "quarter") {
      const m = Number(s.slice(5, 7));
      const q = String(Math.floor((m - 1) / 3) * 3 + 1).padStart(2, "0");
      return s.slice(0, 4) + "-" + q + "-01";
    }
    if (p === "week") {
      const [a, m, dia] = s.split("-").map(Number);
      const dt = new Date(Date.UTC(a, m - 1, dia - (isodow(s) - 1)));
      return dt.toISOString().slice(0, 10);
    }
    return s;
  }

  function quantil(valores, q) {
    if (!valores.length) return null;
    const v = valores.slice().sort((a, b) => a - b);
    const pos = (v.length - 1) * q;
    const base = Math.floor(pos);
    const resto = pos - base;
    return v[base + 1] !== undefined ? v[base] + resto * (v[base + 1] - v[base]) : v[base];
  }

  function desvio(valores) {
    const n = valores.length;
    if (n < 2) return null;
    const media = valores.reduce((a, b) => a + b, 0) / n;
    return Math.sqrt(valores.reduce((a, b) => a + (b - media) ** 2, 0) / (n - 1));
  }

  const coleta = { init: () => [], step: (s, v) => { if (v != null) s.push(Number(v)); return s; } };

  function registrarFuncoes(db) {
    db.create_function("year", (d) => parteData(d, 0, 4));
    db.create_function("month", (d) => parteData(d, 5, 7));
    db.create_function("day", (d) => parteData(d, 8, 10));
    db.create_function("quarter", (d) => (d == null ? null : Math.floor((parteData(d, 5, 7) - 1) / 3) + 1));
    db.create_function("isodow", isodow);
    db.create_function("date_trunc", dateTrunc);
    db.create_aggregate("median", { ...coleta, finalize: (s) => quantil(s, 0.5) });
    db.create_aggregate("quantile_cont", {
      init: () => ({ v: [], q: 0.5 }),
      step: (s, v, q) => { if (v != null) s.v.push(Number(v)); s.q = Number(q); return s; },
      finalize: (s) => quantil(s.v, s.q),
    });
    db.create_aggregate("stddev_samp", { ...coleta, finalize: desvio });
    db.create_aggregate("stddev", { ...coleta, finalize: desvio });
    db.create_aggregate("mode", {
      init: () => new Map(),
      step: (s, v) => { if (v != null) s.set(v, (s.get(v) || 0) + 1); return s; },
      finalize: (s) => { let melhor = null, n = 0; s.forEach((c, v) => { if (c > n) { n = c; melhor = v; } }); return melhor; },
    });
    db.run("PRAGMA case_sensitive_like = ON");
  }

  /** Cria o banco a partir do JSON exportado e devolve os bytes (cópia intocada). */
  function montarBanco(SQL, dados) {
    const db = new SQL.Database();
    db.run("BEGIN");
    for (const [tabela, { colunas, linhas }] of Object.entries(dados)) {
      db.run(`CREATE TABLE ${tabela} (${colunas.map(([n, t]) => `${n} ${tipoSqlite(t)}`).join(", ")})`);
      const stmt = db.prepare(`INSERT INTO ${tabela} VALUES (${colunas.map(() => "?").join(",")})`);
      for (const l of linhas) stmt.run(l);
      stmt.free();
    }
    db.run("COMMIT");
    const bytes = db.export();
    db.close();
    return bytes;
  }

  function abrirBanco(SQL, bytes) {
    const db = new SQL.Database(bytes);
    registrarFuncoes(db);
    return db;
  }

  /** Executa e devolve o ÚLTIMO resultado ({colunas, linhas}). Lança em erro. */
  function executar(db, sql) {
    const res = db.exec(sql);
    if (!res.length) return { colunas: [], linhas: [] };
    const r = res[res.length - 1];
    return { colunas: r.columns, linhas: r.values };
  }

  const normalizar = (v) => (typeof v === "number" ? Math.round(v * 100) / 100 + 0 : v);
  const iguais = (a, b) =>
    typeof a === "number" && typeof b === "number" ? Math.abs(a - b) <= 0.0101 : a === b;
  const linhasIguais = (a, b) => a.length === b.length && a.every((v, i) => iguais(v, b[i]));

  function compararValor(a, b) {
    if (a === b) return 0;
    if (a == null) return -1;
    if (b == null) return 1;
    if (typeof a === "number" && typeof b === "number") return iguais(a, b) ? 0 : a - b;
    return String(a) < String(b) ? -1 : 1;
  }
  const compararLinha = (a, b) => {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      const c = compararValor(a[i], b[i]);
      if (c) return c;
    }
    return 0;
  };

  const ehOrdenado = (sql) => /\border\s+by\b/i.test(sql);

  /** Compara resultados. Devolve {ok, msg, esperado?, obtido?}. */
  function comparar(esperado, obtido, ordenado) {
    const e = esperado.map((l) => l.map(normalizar));
    const o = obtido.map((l) => l.map(normalizar));
    if (e.length && o.length && e[0].length !== o[0].length)
      return { ok: false, msg: `Esperava ${e[0].length} coluna(s), sua consulta trouxe ${o[0].length}. Confira quais colunas o enunciado pede, e em que ordem.` };
    if (e.length !== o.length)
      return { ok: false, msg: `Esperava ${e.length} linha(s), sua consulta trouxe ${o.length}. Confira os filtros (WHERE/HAVING) e o LIMIT.` };
    const [ee, oo] = ordenado ? [e, o] : [e.slice().sort(compararLinha), o.slice().sort(compararLinha)];
    for (let i = 0; i < ee.length; i++) {
      if (!linhasIguais(ee[i], oo[i])) {
        const dica = ordenado
          ? "Os valores ou a ORDEM das linhas não batem. Confira o ORDER BY e o critério de desempate."
          : "Os valores não batem. Confira os cálculos, filtros e arredondamentos.";
        return { ok: false, msg: dica, esperado: ee[i], obtido: oo[i] };
      }
    }
    return { ok: true };
  }

  const Motor = { montarBanco, abrirBanco, executar, comparar, ehOrdenado, normalizar };
  if (typeof module !== "undefined" && module.exports) module.exports = Motor;
  else raiz.Motor = Motor;
})(typeof window !== "undefined" ? window : globalThis);
