// Persistência: UM objeto no localStorage, lido ao abrir e gravado a cada mudança.
//
// {
//   versao: 2,
//   trechos: [...],          // cadastrados pelo FormTrecho
//   trechoAtualId: 't-...',  // trecho selecionado (ou null)
//   ocorrencias: [...],      // cada uma carimbada com trechoId
//   elo: { comandos, log },  // contador e últimas falas do agente de voz
// }
import { ocorrenciasExemplo, trechoAtualExemplo, trechosExemplo } from '../data/exemplo.js'
import { codigoElo } from './ocorrencias.js'
import { atualizarSugestoes } from './encaminhamento.js'
import { rotuloCanal } from '../data/dominio.js'

export const CHAVE = 'elo:motiva:v2'
const VERSAO = 2

// Completa uma ocorrência de exemplo com código, histórico e encaminhamentos,
// do mesmo jeito que uma ocorrência nova seria montada.
function montarExemplo(o) {
  const base = {
    sentido: null, atendimentoEm: null, resolvidaEm: null, recursos: [], condicoes: [], ...o,
  }
  const historico = [{ em: base.registradoEm, evento: `Aberta por ${rotuloCanal(base.canal).toLowerCase()} · enviada por ${base.rota}` }]
  if (base.atendimentoEm) historico.push({ em: base.atendimentoEm, evento: 'Status: Em atendimento' })
  if (base.resolvidaEm) historico.push({ em: base.resolvidaEm, evento: 'Status: Resolvida' })
  const comSugestoes = atualizarSugestoes({ ...base, codigo: codigoElo(base), historico, encaminhamentos: [] })
  // Nas que a equipe já atendeu, a central já tinha encaminhado e o setor confirmado.
  if (base.status !== 'aberta') {
    comSugestoes.encaminhamentos = comSugestoes.encaminhamentos.map((e) => ({ ...e, estado: 'recebido' }))
  }
  return comSugestoes
}

export function estadoExemplo() {
  return {
    versao: VERSAO,
    trechos: trechosExemplo.map((t) => ({ ...t })),
    trechoAtualId: trechoAtualExemplo,
    ocorrencias: ocorrenciasExemplo.map(montarExemplo),
    elo: { comandos: 0, log: [] },
  }
}

export function estadoVazio() {
  return { versao: VERSAO, trechos: [], trechoAtualId: null, ocorrencias: [], elo: { comandos: 0, log: [] } }
}

// Lê o objeto salvo. Primeira visita (nada salvo) abre com o exemplo;
// objeto corrompido ou de outra versão também volta para o exemplo.
export function lerEstado() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE))
    if (!salvo) return estadoExemplo()
    const valido = salvo.versao === VERSAO && Array.isArray(salvo.trechos) && Array.isArray(salvo.ocorrencias)
    if (!valido) return estadoExemplo()
    const existe = salvo.trechos.some((t) => t.id === salvo.trechoAtualId)
    return {
      ...estadoVazio(),
      ...salvo,
      trechoAtualId: existe ? salvo.trechoAtualId : null,
      elo: { comandos: salvo.elo?.comandos ?? 0, log: salvo.elo?.log ?? [] },
    }
  } catch {
    return estadoExemplo()
  }
}

export function salvarEstado(estado) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify({ versao: VERSAO, ...estado }))
  } catch {
    // Sem armazenamento (aba anônima bloqueada): a plataforma segue só na memória.
  }
}
