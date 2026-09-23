// Confere se cada gabarito, rodando no motor do navegador (SQLite + funções extras),
// dá o mesmo resultado que no DuckDB. Uso: node site/testar_motor.js <caminho/sql-asm.js>
const path = require("path");
const fs = require("fs");
const Motor = require("./src/motor.js");
const initSqlJs = require(process.argv[2]);
const ler = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, "build", f), "utf8"));

initSqlJs().then((SQL) => {
  const bytes = Motor.montarBanco(SQL, ler("dados.json"));
  const gabarito = ler("gabarito.json");
  const esperado = ler("esperado.json");
  let falhas = 0;
  for (const [id, { sql }] of Object.entries(gabarito)) {
    const db = Motor.abrirBanco(SQL, bytes);
    try {
      const r = Motor.executar(db, sql);
      const c = Motor.comparar(esperado[id], r.linhas, Motor.ehOrdenado(sql));
      if (!c.ok) { falhas++; console.log("DIFERE", id, c.msg, c.esperado, c.obtido); }
    } catch (e) { falhas++; console.log("ERRO", id, e.message); }
    db.close();
  }
  console.log(`${Object.keys(gabarito).length - falhas}/${Object.keys(gabarito).length} gabaritos idênticos ao DuckDB`);
  process.exit(falhas ? 1 : 0);
});
