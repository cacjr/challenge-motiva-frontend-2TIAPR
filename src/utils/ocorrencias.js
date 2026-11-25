// Regras das ocorrências: criação carimbada com trechoId, mudança de status,
// filtro e tempo de silêncio. Funções puras, sem React.
import { tipoPorId, rotuloStatus } from '../data/dominio.js'
import { atualizarSugestoes } from './encaminhamento.js'
import { isoLocal } from './formatar.js'

export function gerarId(prefixo) {
  const aleatorio = Math.random().toString(36).slice(2, 7)
  return `${prefixo}-${Date.now().toString(36)}-${aleatorio}`
}

export function trechoDoKm(trechos, km) {
  return trechos.find((t) => km >= t.kmInicial && km <= t.kmFinal) ?? null
}

export const nomeTrecho = (trecho) =>
  trecho ? `${trecho.rodovia} · km ${trecho.kmInicial}–${trecho.kmFinal}` : 'trecho removido'

// Primeiro canal da cascata que a cobertura do trecho permite.
export function rotaPrevista(trecho) {
  if (!trecho || trecho.cobertura === 'sinal') return '4G'
  if (trecho.cobertura === 'sombra parcial') return 'SMS (2G)'
  return 'LoRa mesh'
}

// Código Elo: o registro inteiro em ~30 bytes, cabe num SMS ou num pacote LoRa.
export function codigoElo({ km, sentido, tipo, gravidade, horaFato }) {
  const s = sentido ? sentido[0].toUpperCase() : '-'
  const k = typeof km === 'number' ? km.toFixed(1) : '---'
  const g = (gravidade ?? 'media').toUpperCase()
  const hora = new Date(horaFato).toTimeString().slice(0, 5).replace(':', '')
  return `E1|${k}|${s}|${tipoPorId[tipo]?.sigla ?? 'OUT'}|${g}|${hora}`
}

// Minutos entre o fato acontecer e a central receber o registro.
export function minutosDeSilencio(ocorrencia) {
  const ms = new Date(ocorrencia.registradoEm) - new Date(ocorrencia.horaFato)
  return Math.max(0, Math.floor(ms / 60000))
}

// Minutos entre o fato e a equipe começar o atendimento (régua da ANTT, mas
// contada do fato). null enquanto ninguém começou a atender.
export function minutosAteAtendimento(ocorrencia) {
  if (!ocorrencia.atendimentoEm) return null
  const ms = new Date(ocorrencia.atendimentoEm) - new Date(ocorrencia.horaFato)
  return Math.max(0, Math.floor(ms / 60000))
}

// Monta a ocorrência completa a partir do que o formulário ou o Elo coletaram.
// O carimbo trechoId é obrigatório: é ele que isola o histórico de cada trecho.
export function criarOcorrencia(dados, trecho, agoraIso = isoLocal()) {
  const horaFato = dados.horaFato ?? agoraIso
  const rota = dados.rota ?? rotaPrevista(trecho)
  const canal = dados.canal ?? 'formulario'
  const base = {
    id: gerarId('oc'),
    trechoId: trecho.id,
    tipo: dados.tipo,
    descricao: dados.descricao.trim(),
    gravidade: dados.gravidade,
    status: 'aberta',
    canal,
    km: typeof dados.km === 'number' ? dados.km : null,
    sentido: dados.sentido ?? null,
    horaFato,
    registradoEm: agoraIso,
    atendimentoEm: null,
    resolvidaEm: null,
    rota,
    recursos: dados.recursos ?? [],
    condicoes: dados.condicoes ?? [],
    encaminhamentos: [],
    historico: [{ em: agoraIso, evento: `Aberta por ${canal === 'voz' ? 'voz' : 'formulário'} · enviada por ${rota}` }],
  }
  return atualizarSugestoes({ ...base, codigo: codigoElo(base) })
}

// Status oficial: aberta → em atendimento → resolvida (e pode reabrir).
// etapa: o detalhe de campo dito por voz ("equipe no local"), vai só para o histórico.
export function mudarStatus(ocorrencia, status, agoraIso = isoLocal(), etapa) {
  if (ocorrencia.status === status && !etapa) return ocorrencia
  const evento = etapa && ocorrencia.status === status
    ? `Etapa: ${etapa}`
    : `Status: ${rotuloStatus(status)}${etapa ? ` (${etapa})` : ''}`
  return {
    ...ocorrencia,
    status,
    atendimentoEm: status !== 'aberta' ? ocorrencia.atendimentoEm ?? agoraIso : ocorrencia.atendimentoEm,
    resolvidaEm: status === 'resolvida' ? agoraIso : null,
    historico: [...ocorrencia.historico, { em: agoraIso, evento }],
  }
}

export const FILTRO_VAZIO = { gravidade: '', tipo: '', status: '' }

// Campo vazio no filtro = não filtra por ele.
export function filtrarOcorrencias(ocorrencias, filtro) {
  return ocorrencias.filter((o) =>
    (!filtro.gravidade || o.gravidade === filtro.gravidade)
    && (!filtro.tipo || o.tipo === filtro.tipo)
    && (!filtro.status || o.status === filtro.status))
}

// Mais recente primeiro.
export const ordenarRecentes = (ocorrencias) =>
  [...ocorrencias].sort((a, b) => b.registradoEm.localeCompare(a.registradoEm))
