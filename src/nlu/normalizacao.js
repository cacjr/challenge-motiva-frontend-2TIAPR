// Normalização da fala, portada do normalizacao.py do projeto de PLN do grupo:
// minúsculas, correções de transcrição, números por extenso e km/hora.
// Quando o NLU passar a rodar no backend, este arquivo sai.
import glossario from './glossario.json' with { type: 'json' }
import { re, escapar } from './regex.js'

const UNIDADES = { zero: 0, um: 1, uma: 1, dois: 2, duas: 2, três: 3, tres: 3,
  quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9 }
const DEZ_A_DEZENOVE = { dez: 10, onze: 11, doze: 12, treze: 13, quatorze: 14,
  catorze: 14, quinze: 15, dezesseis: 16, dezessete: 17, dezoito: 18, dezenove: 19 }
const DEZENAS = { vinte: 20, trinta: 30, quarenta: 40, cinquenta: 50, cinqüenta: 50,
  sessenta: 60, setenta: 70, oitenta: 80, noventa: 90 }
const CENTENAS = { cem: 100, cento: 100, duzentos: 200, duzentas: 200, trezentos: 300,
  trezentas: 300, quatrocentos: 400, quatrocentas: 400, quinhentos: 500,
  quinhentas: 500, seiscentos: 600, seiscentas: 600, setecentos: 700,
  setecentas: 700, oitocentos: 800, oitocentas: 800, novecentos: 900, novecentas: 900 }
const NUMEROS = { ...UNIDADES, ...DEZ_A_DEZENOVE, ...DEZENAS, ...CENTENAS }
const tem = (obj, k) => Object.prototype.hasOwnProperty.call(obj, k)

// "um/uma" sozinhos são artigo; só viram 1 depois destes gatilhos
const GATILHOS_UM = new Set(['km', 'faixa', 'às', 'ocorrência', 'número'])

function classe(v) {
  if (v < 10) return 'unidade'
  if (v < 20) return 'dez_a_dezenove'
  if (v < 100) return 'dezena'
  return 'centena'
}

function permite(ultima, nova) {
  if (ultima === 'centena') return ['dezena', 'dez_a_dezenove', 'unidade'].includes(nova)
  if (ultima === 'dezena') return nova === 'unidade'
  if (ultima === 'mil') return ['centena', 'dezena', 'dez_a_dezenove', 'unidade'].includes(nova)
  return false
}

function valor(tokens, i) {
  const w = tokens[i]
  if (tem(NUMEROS, w)) return NUMEROS[w]
  if (w === 'mil') return 1000
  if (w === 'meia') {
    const ant = i > 0 ? tokens[i - 1] : ''
    const prox = i + 1 < tokens.length ? tokens[i + 1] : ''
    if (ant !== 'e' && (tem(UNIDADES, ant) || tem(UNIDADES, prox))) return 6
  }
  return null
}

export function converterNumeros(tokens) {
  const saida = [] // [texto, ehDigitoUnico, palavraOriginal]
  let i = 0
  const n = tokens.length
  while (i < n) {
    const v = valor(tokens, i)
    if (v === null) {
      saida.push([tokens[i], false, tokens[i]])
      i += 1
      continue
    }
    const inicio = i
    let total, atual, ultima
    if (v === 1000) [total, atual, ultima] = [1000, 0, 'mil']
    else [total, atual, ultima] = [0, v, classe(v)]
    let j = i + 1
    while (j < n) {
      let k = j
      if (tokens[k] === 'e' && k + 1 < n && valor(tokens, k + 1) !== null) k += 1
      const v2 = valor(tokens, k)
      if (v2 === null) break
      if (v2 === 1000 && ultima !== 'mil' && k === j) {
        total += (atual || 1) * 1000
        atual = 0
        ultima = 'mil'
        j = k + 1
        continue
      }
      const c2 = v2 !== 1000 ? classe(v2) : 'mil'
      if (permite(ultima, c2)) {
        atual += v2
        ultima = c2
        j = k + 1
      } else break
    }
    const val = total + atual
    const unico = j - inicio === 1 && val < 10
    saida.push([String(val), unico, tokens[inicio]])
    i = j
  }

  const final = []
  i = 0
  while (i < saida.length) {
    const [txt, unico, orig] = saida[i]
    if (unico) {
      let j = i
      while (j + 1 < saida.length && saida[j + 1][1]) j += 1
      if (j > i) {
        final.push(saida.slice(i, j + 1).map((s) => s[0]).join(''))
        i = j + 1
        continue
      }
      if (orig === 'um' || orig === 'uma') {
        const anterior = final.length ? final[final.length - 1] : ''
        final.push(GATILHOS_UM.has(anterior) ? txt : orig)
        i += 1
        continue
      }
    }
    final.push(txt)
    i += 1
  }
  return final
}

const fmt = (x) => x.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')
const dois = (x) => String(x).padStart(2, '0')

function hora(h, m = '0') {
  const hh = parseInt(h, 10)
  const mm = parseInt(m, 10)
  return hh < 24 && mm < 60 ? `${dois(hh)}:${dois(mm)}` : null
}

export function regrasDominio(texto) {
  let t = texto
  t = t.replace(re('\\bkm de (\\d)', 'g'), 'km $1')
  t = t.replace(re('\\bkm (\\d+),(\\d+)\\b', 'g'), 'km $1.$2')
  t = t.replace(re('\\bkm (\\d+)\\s*\\+\\s*(\\d{1,3})\\b', 'g'),
    (_, a, b) => 'km ' + fmt(parseInt(a, 10) + parseInt(b, 10) / 1000))
  t = t.replace(re('\\bkm (\\d+) mais (\\d{1,3})\\b', 'g'),
    (_, a, b) => 'km ' + fmt(parseInt(a, 10) + parseInt(b, 10) / 1000))
  t = t.replace(re('\\bkm (\\d+) e meio\\b', 'g'), (_, a) => 'km ' + fmt(parseInt(a, 10) + 0.5))
  t = t.replace(/(?<![\d.,])(\d{1,2}),(\d{2})(?![\d,])/gu, (m0, h, m) => hora(h, m) ?? m0)
  t = t.replace(re('\\b(\\d{1,2})h(\\d{2})\\b', 'g'), (m0, h, m) => hora(h, m) ?? m0)
  t = t.replace(re('\\bàs (\\d{1,2}) e (\\d{1,2})( minutos)?\\b', 'g'),
    (m0, h, m) => (hora(h, m) ? 'às ' + hora(h, m) : m0))
  t = t.replace(re('\\bàs (\\d{1,2}) horas?\\b', 'g'), (m0, h) => (hora(h) ? 'às ' + hora(h) : m0))
  return t
}

const verbos = glossario.verbos_comando
const hesitacoes = new Set(glossario.hesitacoes)
const marcadores = new Set(glossario.marcadores_discurso_removidos)
const correcoes = [...glossario.correcoes_asr]
  .sort((a, b) => b.errado.length - a.errado.length)
  .map((c) => [re(`\\b${escapar(c.errado)}\\b`, 'g'), c.certo])
const kmVariantes = [...glossario.termos.find((t) => t.canonico === 'km').variantes]
  .sort((a, b) => b.length - a.length)
  .map((v) => re(`\\b${escapar(v)}\\b`, 'g'))

export function normalizar(texto) {
  let t = texto.normalize('NFC').toLowerCase()
  t = t.replace(re('\\bé\\s*(\\.\\.\\.|…)', 'g'), ' ')
  t = t.replace(/(\.\.\.|…)/g, ' ')
  t = t.replace(/(?<!\d)[.,]|[.,](?!\d)/g, ' ')
  t = t.replace(/[!?;:"“”()[\]]/g, ' ')
  t = t.replace(/\s+/g, ' ').trim()
  for (const [rx, certo] of correcoes) t = t.replace(rx, () => certo)
  for (const rx of kmVariantes) t = t.replace(rx, 'km')
  let tokens = t.split(/\s+/).filter((w) => w && !hesitacoes.has(w) && !marcadores.has(w))
  tokens = tokens.map((w) => (tem(verbos, w) ? verbos[w] : w))
  tokens = converterNumeros(tokens)
  return regrasDominio(tokens.join(' '))
}
