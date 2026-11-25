// Números do Início e do Dashboard, calculados a partir do estado (não há mais
// recorte fixo, como na Sprint 1). Mesmo formato que os gráficos já liam.
import { CANAIS, GRAVIDADES, ROTAS, STATUS, TIPOS } from '../data/dominio.js'
import { cores } from './cores.js'
import { minutosAteAtendimento, minutosDeSilencio } from './ocorrencias.js'

const FAIXAS = [[0, 100], [100, 200], [200, 300], [300, 400], [400, 500], [500, 600], [600, 700], [700, 845]]
export const LIMITE_SILENCIO_MIN = 10

const media = (lista) => (lista.length ? Math.round(lista.reduce((s, v) => s + v, 0) / lista.length) : 0)
const pct = (parte, todo) => (todo ? Math.round((parte / todo) * 100) : 0)

function contarPor(ocorrencias, campo, dominio) {
  const valores = dominio.map((d) => ocorrencias.filter((o) => o[campo] === (d.id ?? d)).length)
  return { labels: dominio.map((d) => d.rotulo ?? d), valores }
}

// km da ocorrência; se ninguém informou, o meio do trecho dela.
function kmDe(ocorrencia, trechos) {
  if (typeof ocorrencia.km === 'number') return ocorrencia.km
  const t = trechos.find((x) => x.id === ocorrencia.trechoId)
  return t ? (t.kmInicial + t.kmFinal) / 2 : null
}

export function calcularResumo(trechos, ocorrencias) {
  const total = ocorrencias.length

  const valoresMapa = FAIXAS.map(([a, b]) => media(ocorrencias
    .filter((o) => {
      const km = kmDe(o, trechos)
      return km !== null && km >= a && (km < b || (b === 845 && km <= b))
    })
    .map(minutosDeSilencio)))
  const labelsMapa = FAIXAS.map(([a, b]) => `${a}–${b}`)
  const pior = Math.max(...valoresMapa)
  const mapaSilencio = {
    titulo: 'Mapa do Silêncio · minutos entre o fato e a central, por faixa de km',
    labels: labelsMapa,
    valores: valoresMapa,
    limiteMin: LIMITE_SILENCIO_MIN,
    leitura: pior > 0
      ? `A faixa do km ${labelsMapa[valoresMapa.indexOf(pior)]} é a mais muda: ${pior} min, em média, entre o fato e a central saber.`
      : 'Sem ocorrências registradas ainda.',
  }

  const porCanal = contarPor(ocorrencias, 'canal', CANAIS)
  const ocorrenciasPorEntrada = {
    titulo: 'Como o registro começou',
    ...porCanal,
    leitura: `${pct(porCanal.valores[0], total)}% dos registros começaram pela voz.`,
  }

  const porRota = contarPor(ocorrencias, 'rota', ROTAS)
  const ocorrenciasPorRota = {
    titulo: 'Por onde o registro chegou à central',
    ...porRota,
    leitura: `${total - porRota.valores[0]} de ${total} ocorrências dependeram de algo além do 4G.`,
  }

  const atendidas = ocorrencias.map(minutosAteAtendimento).filter((m) => m !== null)
  const resolvidas = ocorrencias.filter((o) => o.status === 'resolvida').length
  const velocimetros = [
    {
      id: 'dentro15',
      titulo: 'Atendimento em até 15 min, contando do fato',
      valor: pct(atendidas.filter((m) => m <= 15).length, atendidas.length),
      maximo: 100,
      detalhe: `% de ${atendidas.length} atendimentos (a ANTT conta do acionamento)`,
      cor: cores.ambar,
    },
    {
      id: 'silencioMedio',
      titulo: 'Silêncio médio',
      valor: media(ocorrencias.map(minutosDeSilencio)),
      maximo: 30,
      detalhe: 'minutos entre o fato e a central · meta do Elo: até 5',
      cor: cores.ambar,
    },
    {
      id: 'resolvidas',
      titulo: 'Ocorrências resolvidas',
      valor: resolvidas,
      maximo: Math.max(total, 1),
      detalhe: `de ${total} registradas`,
      cor: cores.indigo,
    },
    {
      id: 'voz',
      titulo: 'Registros que começaram pela voz',
      valor: porCanal.valores[0],
      maximo: Math.max(total, 1),
      detalhe: `de ${total} registradas`,
      cor: cores.azul,
    },
  ]

  return {
    total,
    mapaSilencio,
    ocorrenciasPorEntrada,
    ocorrenciasPorRota,
    velocimetros,
    porTipo: { titulo: 'Ocorrências por tipo', ...contarPor(ocorrencias, 'tipo', TIPOS) },
    porGravidade: { titulo: 'Ocorrências por gravidade', ...contarPor(ocorrencias, 'gravidade', GRAVIDADES) },
    porStatus: { titulo: 'Ocorrências por status', ...contarPor(ocorrencias, 'status', STATUS) },
  }
}
