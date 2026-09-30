#!/usr/bin/env python3
"""Gera index.html (arquivo único) a partir de src/."""
import glob, pathlib
d = pathlib.Path(__file__).parent / "src"
mods = "\n".join(open(f, encoding="utf-8").read() for f in sorted(glob.glob(str(d / "mods" / "m*.js"))))
html = f"""<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Estudos Transpetro Ênfase 9</title>
<style>{(d/'style.css').read_text(encoding='utf-8')}</style></head>
<body>
<header><div class="wrap"><h1>Estudos Transpetro: Ênfase 9, Comércio e Suprimentos</h1>
<p>Edital TRANSPETRO/PSP/TERRA Nível Superior 2026.4 · Banca: Fundação Cesgranrio</p></div></header>
<nav><div class="wrap"><a href="#edital">Edital</a><a href="#modulos">Módulos</a><a href="#simulado">Simulado</a><a href="#fontes">Fontes</a></div></nav>
<main class="wrap"></main>
<script>
{(d/'edital.js').read_text(encoding='utf-8')}
{(d/'app.js').read_text(encoding='utf-8')}
{mods}
</script></body></html>"""
(pathlib.Path(__file__).parent / "index.html").write_text(html, encoding="utf-8")
print("index.html", len(html)//1024, "KB")
