/**
 * Convierte docs/respuestas.md en docs/respuestas.html con estilos de impresión.
 * El PDF se genera después con Edge/Chrome headless:
 *   msedge --headless --print-to-pdf=docs/respuestas.pdf file:///.../docs/respuestas.html
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const md = readFileSync(resolve('docs/respuestas.md'), 'utf8')

const escapar = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const inline = (s) =>
  escapar(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')

const html = []
let parrafo = []
let lista = null
let items = []
let enCodigo = false
let codigo = []

const cerrarParrafo = () => {
  if (parrafo.length) {
    html.push(`<p>${inline(parrafo.join(' '))}</p>`)
    parrafo = []
  }
}

const cerrarLista = () => {
  if (lista) {
    html.push(`<${lista}>`)
    for (const item of items) html.push(`<li>${inline(item)}</li>`)
    html.push(`</${lista}>`)
    lista = null
    items = []
  }
}

for (const linea of md.split(/\r?\n/)) {
  if (linea.startsWith('```')) {
    if (enCodigo) {
      html.push(`<pre><code>${escapar(codigo.join('\n'))}</code></pre>`)
      codigo = []
      enCodigo = false
    } else {
      cerrarParrafo()
      cerrarLista()
      enCodigo = true
    }
    continue
  }

  if (enCodigo) {
    codigo.push(linea)
    continue
  }

  if (!linea.trim()) {
    cerrarParrafo()
    cerrarLista()
    continue
  }

  if (/^-{3,}$/.test(linea.trim())) {
    cerrarParrafo()
    cerrarLista()
    html.push('<hr />')
    continue
  }

  const titulo = linea.match(/^(#{1,4})\s+(.*)$/)
  if (titulo) {
    cerrarParrafo()
    cerrarLista()
    const nivel = titulo[1].length
    html.push(`<h${nivel}>${inline(titulo[2])}</h${nivel}>`)
    continue
  }

  const ul = linea.match(/^-\s+(.*)$/)
  if (ul) {
    cerrarParrafo()
    if (lista !== 'ul') {
      cerrarLista()
      lista = 'ul'
    }
    items.push(ul[1])
    continue
  }

  const ol = linea.match(/^\d+\.\s+(.*)$/)
  if (ol) {
    cerrarParrafo()
    if (lista !== 'ol') {
      cerrarLista()
      lista = 'ol'
    }
    items.push(ol[1])
    continue
  }

  // Continuación de un ítem de lista (línea indentada)
  if (lista && /^\s{2,}\S/.test(linea)) {
    items[items.length - 1] += ` ${linea.trim()}`
    continue
  }

  parrafo.push(linea.trim())
}

cerrarParrafo()
cerrarLista()

const documento = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>SenaAccess · Respuestas de la guía Zustand</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.55;
    color: #14201a;
  }
  header.portada {
    border-bottom: 3px solid #39a900;
    padding-bottom: 12px;
    margin-bottom: 22px;
  }
  header.portada small {
    display: block;
    color: #4b5c53;
    font-size: 9pt;
    letter-spacing: .08em;
    text-transform: uppercase;
  }
  h1 { font-size: 20pt; margin: 6px 0 4px; color: #0f1a14; }
  h2 {
    font-size: 14pt;
    margin: 22px 0 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid #d7e2da;
    color: #1f6b00;
    page-break-after: avoid;
  }
  h3 { font-size: 12pt; margin: 16px 0 6px; }
  h4 { font-size: 11pt; margin: 14px 0 4px; }
  p { margin: 0 0 9px; text-align: justify; }
  ul, ol { margin: 0 0 10px; padding-left: 20px; }
  li { margin-bottom: 5px; text-align: justify; }
  strong { color: #0f1a14; }
  code {
    background: #eef4ef;
    border: 1px solid #d7e2da;
    border-radius: 4px;
    padding: 0 4px;
    font-family: Consolas, monospace;
    font-size: 9.5pt;
  }
  pre {
    background: #0f1a14;
    color: #e8f2ec;
    border-radius: 6px;
    padding: 10px 12px;
    font-size: 9.5pt;
    overflow: auto;
    page-break-inside: avoid;
  }
  pre code { background: transparent; border: none; color: inherit; padding: 0; }
  footer.pie {
    margin-top: 26px;
    padding-top: 8px;
    border-top: 1px solid #d7e2da;
    color: #4b5c53;
    font-size: 8.5pt;
  }
</style>
</head>
<body>
<header class="portada">
  <small>SENA · ADSO 228118 · RAP3 · Crear componentes Frontend</small>
  <h1>Zustand en React con Vite</h1>
  <small>Respuestas de la guía · Proyecto: SenaAccess (práctica + transferencia)</small>
</header>
${html.join('\n')}
<footer class="pie">
  Tienda SENA / SenaAccess · Zustand 5 + React 19 + Vite · Respuestas de las actividades 3.1, 3.2 (Parte A) y 3.3.13.
</footer>
</body>
</html>
`

writeFileSync(resolve('docs/respuestas.html'), documento, 'utf8')
console.log('docs/respuestas.html generado')
