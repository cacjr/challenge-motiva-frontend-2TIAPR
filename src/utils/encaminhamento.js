// Sugestão de setores para uma ocorrência e mudanças de estado do encaminhamento.
// Estados: sugerido (a central ainda decide) → encaminhado → recebido (setor confirmou).
import { setores } from '../data/setores.js'
import { rotuloTermo } from '../data/dominio.js'
import { isoLocal } from './formatar.js'

export const setorPorId = Object.fromEntries(setores.map((s) => [s.id, s]))

export function setorDoRecurso(recurso) {
  return setores.find((s) => s.recursos.includes(recurso))?.id ?? null
}

export function sugerirSetores(ocorrencia) {
  const motivos = {}
  const anotar = (id, motivo) => { (motivos[id] ??= []).push(motivo) }
  for (const s of setores) {
    if (ocorrencia.tipo && s.tipos.includes(ocorrencia.tipo)) anotar(s.id, rotuloTermo(ocorrencia.tipo))
    for (const r of ocorrencia.recursos ?? []) if (s.recursos.includes(r)) anotar(s.id, `pedido: ${rotuloTermo(r)}`)
    for (const c of ocorrencia.condicoes ?? []) if (s.condicoes.includes(c)) anotar(s.id, rotuloTermo(c))
  }
  // Gravidade alta sempre avisa a supervisão; sem setor reconhecido, ninguém fica sem dono.
  if (ocorrencia.gravidade === 'alta') anotar('supervisao', 'gravidade alta')
  if (!Object.keys(motivos).length) anotar('supervisao', 'triagem')
  return motivos
}

// Junta as sugestões novas sem desfazer o que a central já encaminhou.
export function atualizarSugestoes(ocorrencia) {
  const atuais = ocorrencia.encaminhamentos ?? []
  const novos = [...atuais]
  for (const [setor, motivos] of Object.entries(sugerirSetores(ocorrencia))) {
    const i = novos.findIndex((e) => e.setor === setor)
    if (i < 0) novos.push({ setor, estado: 'sugerido', motivos })
    else novos[i] = { ...novos[i], motivos: [...new Set([...novos[i].motivos, ...motivos])] }
  }
  return { ...ocorrencia, encaminhamentos: novos }
}

export function mudarEncaminhamento(ocorrencia, setor, estado, agoraIso = isoLocal(), origem = 'central') {
  const lista = ocorrencia.encaminhamentos ?? []
  const existe = lista.some((e) => e.setor === setor)
  const encaminhamentos = existe
    ? lista.map((e) => (e.setor === setor ? { ...e, estado } : e))
    : [...lista, { setor, estado, motivos: [`decisão da ${origem}`] }]
  const verbo = { encaminhado: 'Encaminhada a', recebido: 'Recebida por', descartado: 'Sugestão descartada:' }[estado]
  return {
    ...ocorrencia,
    encaminhamentos,
    historico: [...ocorrencia.historico, { em: agoraIso, evento: `${verbo} ${setorPorId[setor].nome}` }],
  }
}

export const pendentesDeEncaminhar = (ocorrencias) =>
  ocorrencias.filter((o) => o.status !== 'resolvida' && (o.encaminhamentos ?? []).some((e) => e.estado === 'sugerido'))
