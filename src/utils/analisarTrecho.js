// Painel do trecho, nos moldes do analisarPerfil do CardioIA: recebe só as
// ocorrências de UM trecho e devolve números prontos para a tela.
import { TIPOS, rotuloTipo } from '../data/dominio.js'
import { minutosDeSilencio } from './ocorrencias.js'

// Alerta quando o trecho acumula esta quantidade de ocorrências de gravidade
// alta ainda não resolvidas.
export const LIMITE_ALERTA = 2

export function analisarTrecho(ocorrencias) {
  const total = ocorrencias.length
  const graves = ocorrencias.filter((o) => o.gravidade === 'alta').length
  const gravesAbertas = ocorrencias.filter((o) => o.gravidade === 'alta' && o.status !== 'resolvida').length
  const abertas = ocorrencias.filter((o) => o.status !== 'resolvida').length

  // Tipo mais frequente; empate desfeito pela ordem da lista TIPOS.
  const contagem = {}
  for (const o of ocorrencias) contagem[o.tipo] = (contagem[o.tipo] ?? 0) + 1
  const maior = Math.max(0, ...Object.values(contagem))
  const idFrequente = TIPOS.find((t) => contagem[t.id] === maior)?.id
  const tipoFrequente = total === 0 ? 'Sem ocorrências' : rotuloTipo(idFrequente)

  const silencioMedio = total === 0
    ? 0
    : Math.round(ocorrencias.reduce((s, o) => s + minutosDeSilencio(o), 0) / total)

  const alerta = gravesAbertas >= LIMITE_ALERTA
  const mensagemAlerta = alerta
    ? `${gravesAbertas} ocorrências graves ainda sem solução neste trecho. Priorize o atendimento.`
    : null

  // Data da ocorrência registrada mais recentemente (ou null).
  const ultimaEm = total === 0
    ? null
    : ocorrencias.reduce((maior, o) => (o.registradoEm > maior ? o.registradoEm : maior), ocorrencias[0].registradoEm)

  return { ultimaEm, total, graves, gravesAbertas, abertas, tipoFrequente, tiposContagem: contagem, silencioMedio, alerta, mensagemAlerta }
  }
