// Diálogo do Elo: recebe a frase, o estado da plataforma (trechos, trecho atual,
// ocorrências) e devolve a fala de resposta e as mudanças. Função pura, sem React.
// A voz grava na MESMA lista de ocorrências do formulário, sempre com trechoId.
import { interpretar } from './index.js'
import {
  TIPO_DO_GLOSSARIO, rotuloGravidade, rotuloStatus, rotuloTermo, rotuloTipo, tipoPorId,
} from '../data/dominio.js'
import { criarOcorrencia, mudarStatus, ordenarRecentes, trechoDoKm } from '../utils/ocorrencias.js'
import { atualizarSugestoes, mudarEncaminhamento, setorDoRecurso, setorPorId } from '../utils/encaminhamento.js'
import { formatarKm, isoLocal } from '../utils/formatar.js'

const ROTULO_INTENCAO = {
  registrar_ocorrencia: 'Registrar ocorrência',
  confirmar: 'Confirmar',
  negar_corrigir: 'Negar ou corrigir',
  cancelar: 'Cancelar',
  atualizar_status: 'Atualizar status',
  solicitar_apoio: 'Solicitar apoio',
  encerrar_atendimento: 'Encerrar atendimento',
  relatar_condicoes: 'Relatar condições',
  consultar_panorama: 'Consultar panorama',
  registrar_direcionamento: 'Direcionar para setor',
  fora_de_escopo: 'Fora de escopo',
}
export const rotuloIntencao = (i) => ROTULO_INTENCAO[i] ?? i.replaceAll('_', ' ')

// Intenções que o Elo já executa no front. As demais do NLU (resumo, procedimento,
// indicadores...) são reconhecidas, mas respondidas como "ainda não disponível".
const EXECUTA = new Set([
  'registrar_ocorrencia', 'confirmar', 'negar_corrigir', 'cancelar', 'atualizar_status',
  'encerrar_atendimento', 'solicitar_apoio', 'relatar_condicoes', 'registrar_direcionamento',
  'consultar_panorama',
])

const primeira = (ents, tipo) => ents.find((e) => e.tipo === tipo)?.valor
const todas = (ents, tipo) => ents.filter((e) => e.tipo === tipo).map((e) => e.valor)
const ativas = (ocorrencias) => ordenarRecentes(ocorrencias.filter((o) => o.status !== 'resolvida'))

// Gravidade dita na frase. "grave" vale alta; vítima (sem "sem") também.
function gravidadeFalada(normalizado) {
  const m = normalizado.match(/gravidade (alta|média|media|baixa)/)
  if (m) return m[1] === 'baixa' ? 'baixa' : m[1] === 'alta' ? 'alta' : 'media'
  if (/\b(grave|gravíssim\w*)\b/u.test(normalizado)) return 'alta'
  if (/(?<!guincho )\bleve\b/u.test(normalizado)) return 'baixa'
  return null
}
const temVitima = (normalizado) => /vítima/u.test(normalizado) && !/sem vítima/u.test(normalizado)

// "às 14:10" vira data/hora de hoje; se o horário ainda não chegou, foi ontem.
function horaDoFato(horario, agoraIso) {
  if (!horario) return agoraIso
  const agora = new Date(agoraIso)
  const [h, m] = horario.split(':').map(Number)
  const fato = new Date(agora)
  fato.setHours(h, m, 0, 0)
  if (fato > agora) fato.setDate(fato.getDate() - 1)
  return isoLocal(fato)
}

// Lê da frase tudo o que serve para montar (ou corrigir) uma ocorrência.
function lerCampos(analise) {
  const { entidades, normalizado } = analise
  const tipoGlossario = primeira(entidades, 'tipo_ocorrencia')
  const recursos = todas(entidades, 'recurso')
  const condicoes = todas(entidades, 'condicao_observada')
  const presa = tipoGlossario === 'vitima_presa' || /\bpres[ao]s? nas ferragens\b|vítima presa/u.test(normalizado)
  if (presa) recursos.push('bombeiros')
  if (tipoGlossario === 'incendio_veiculo') condicoes.push('fumaca')
  return {
    km: primeira(entidades, 'km'),
    sentido: primeira(entidades, 'sentido'),
    tipo: tipoGlossario ? TIPO_DO_GLOSSARIO[tipoGlossario] ?? 'outro' : undefined,
    gravidade: gravidadeFalada(normalizado) ?? (temVitima(normalizado) || presa ? 'alta' : undefined),
    horario: primeira(entidades, 'horario'),
    recursos,
    condicoes,
  }
}

function lerRascunho(r, trechos) {
  const trecho = trechos.find((t) => t.id === r.trechoId)
  return `${rotuloTipo(r.tipo).toLowerCase()}, gravidade ${rotuloGravidade(r.gravidade).toLowerCase()}, `
    + `km ${formatarKm(r.km)}${r.kmDoGps ? ' pelo GPS' : ''}, ${trecho?.referencia ?? trecho?.rodovia}`
}

// Decide o trecho: km falado manda; sem km, o GPS simulado é o meio do trecho atual.
function localizar(campos, trechos, trechoAtualId) {
  if (campos.km !== undefined) {
    const trecho = trechoDoKm(trechos, campos.km)
    return trecho ? { trecho, km: campos.km, kmDoGps: false } : { erro: `O km ${formatarKm(campos.km)} não está em nenhum trecho cadastrado. Cadastre o trecho na tela Trechos ou diga outro km.` }
  }
  const atual = trechos.find((t) => t.id === trechoAtualId)
  if (!atual) return { faltaKm: true }
  return { trecho: atual, km: Math.round(((atual.kmInicial + atual.kmFinal) / 2) * 10) / 10, kmDoGps: true }
}

export function responder(texto, estado, agoraIso = isoLocal()) {
  const analise = interpretar(texto)
  // A intenção vencedora não é uma que o Elo executa (ou nenhuma regra
  // disparou), mas a frase nomeia um tipo de ocorrência ("Elo, atropelamento
  // no km 562, vítima consciente"): é um registro.
  if (!EXECUTA.has(analise.intencao) && analise.entidades.some((e) => e.tipo === 'tipo_ocorrencia')) {
    analise.intencaoOriginal = analise.intencao
    analise.intencao = 'registrar_ocorrencia'
  }
  const { intencao, entidades } = analise
  const { trechos, trechoAtualId, ocorrencias, pendente } = estado
  const comandos = (estado.comandos ?? 0) + 1
  const ultima = ativas(ocorrencias)[0]
  const campos = lerCampos(analise)
  const corrigiu = campos.km !== undefined || campos.tipo || campos.gravidade || campos.sentido
  let fala
  let novo = { ocorrencias, pendente }

  const atualizar = (id, fn) => ocorrencias.map((o) => (o.id === id ? fn(o) : o))
  const comEvento = (o, mudanca, evento) => atualizarSugestoes({
    ...o, ...mudanca, historico: [...o.historico, { em: agoraIso, evento }],
  })

  if (pendente?.faltaKm && campos.km !== undefined) {
    // Resposta à pergunta "Em que km?"
    const onde = localizar(campos, trechos, trechoAtualId)
    if (onde.erro) {
      fala = onde.erro
    } else {
      const rascunho = { ...pendente, faltaKm: false, km: onde.km, kmDoGps: false, trechoId: onde.trecho.id }
      novo = { ocorrencias, pendente: rascunho }
      fala = `Entendi: ${lerRascunho(rascunho, trechos)}. Confirma?`
    }
  } else if (intencao === 'registrar_ocorrencia') {
    const tipo = campos.tipo ?? 'outro'
    const rascunho = {
      tipo,
      gravidade: campos.gravidade ?? tipoPorId[tipo].gravidadePadrao,
      sentido: campos.sentido ?? null,
      descricao: analise.textoBruto,
      horaFato: horaDoFato(campos.horario, agoraIso),
      canal: 'voz',
      recursos: campos.recursos,
      condicoes: campos.condicoes,
    }
    const onde = localizar(campos, trechos, trechoAtualId)
    if (onde.erro) {
      fala = onde.erro
    } else if (onde.faltaKm) {
      novo = { ocorrencias, pendente: { ...rascunho, faltaKm: true } }
      fala = 'Nenhum trecho selecionado e não ouvi o km. Em que km?'
    } else {
      const completo = { ...rascunho, km: onde.km, kmDoGps: onde.kmDoGps, trechoId: onde.trecho.id }
      if (onde.kmDoGps && !completo.sentido) completo.sentido = 'norte'
      novo = { ocorrencias, pendente: completo }
      fala = `Entendi: ${lerRascunho(completo, trechos)}. Confirma?`
    }
  } else if (intencao === 'confirmar' && pendente && !pendente.faltaKm) {
    const trecho = trechos.find((t) => t.id === pendente.trechoId)
    const ocorrencia = criarOcorrencia(pendente, trecho, agoraIso)
    novo = { ocorrencias: [ocorrencia, ...ocorrencias], pendente: null }
    fala = `Registrado em ${trecho.referencia ?? trecho.rodovia}. Trecho em ${trecho.cobertura}: enviando por ${ocorrencia.rota}.`
  } else if (pendente && !pendente.faltaKm && intencao !== 'cancelar' && corrigiu) {
    // "Não, gravidade média" ou "km 690": corrige o rascunho antes de gravar.
    const onde = campos.km !== undefined ? localizar(campos, trechos, trechoAtualId) : null
    if (onde?.erro) {
      fala = onde.erro
    } else {
      const rascunho = {
        ...pendente,
        ...(campos.tipo && { tipo: campos.tipo }),
        ...(campos.gravidade && { gravidade: campos.gravidade }),
        ...(campos.sentido && { sentido: campos.sentido }),
        ...(onde && { km: onde.km, kmDoGps: false, trechoId: onde.trecho.id }),
      }
      novo = { ocorrencias, pendente: rascunho }
      fala = `Corrigido: ${lerRascunho(rascunho, trechos)}. Confirma?`
    }
  } else if ((intencao === 'cancelar' || intencao === 'negar_corrigir') && pendente) {
    novo = { ocorrencias, pendente: null }
    fala = 'Cancelado. Nada foi enviado. Pode repetir a ocorrência.'
  } else if (intencao === 'confirmar' || intencao === 'cancelar' || intencao === 'negar_corrigir') {
    fala = 'Não há nada aguardando confirmação.'
  } else if (pendente) {
    fala = pendente.faltaKm
      ? 'Ainda preciso do km da ocorrência. Em que km?'
      : 'Ainda falta confirmar a ocorrência anterior. Diga confirmo ou cancelar.'
  } else if (intencao === 'atualizar_status' || intencao === 'encerrar_atendimento') {
    if (!ultima) {
      fala = 'Não há ocorrência aberta para atualizar.'
    } else {
      const etapaId = primeira(entidades, 'status')
      const status = intencao === 'encerrar_atendimento' || etapaId === 'via_liberada' ? 'resolvida' : 'em_atendimento'
      const etapa = etapaId ? rotuloTermo(etapaId) : undefined
      novo = { ocorrencias: atualizar(ultima.id, (o) => mudarStatus(o, status, agoraIso, etapa)), pendente }
      fala = `Ocorrência do km ${formatarKm(ultima.km ?? '?')}: ${rotuloStatus(status).toLowerCase()}${etapa ? `, ${etapa}` : ''}.`
    }
  } else if (intencao === 'solicitar_apoio') {
    const recurso = primeira(entidades, 'recurso') ?? 'apoio'
    if (!ultima) {
      fala = `Pedido de ${rotuloTermo(recurso)} anotado, mas não há ocorrência aberta. Registre a ocorrência primeiro.`
    } else {
      novo = {
        ocorrencias: atualizar(ultima.id, (o) => comEvento(o, { recursos: [...o.recursos, recurso] }, `Apoio solicitado: ${rotuloTermo(recurso)}`)),
        pendente,
      }
      fala = `Pedido de ${rotuloTermo(recurso)} enviado para o km ${formatarKm(ultima.km ?? '?')}.`
    }
  } else if (intencao === 'relatar_condicoes') {
    if (!ultima || !campos.condicoes.length) {
      fala = 'Entendi que é um relato de condições, mas não identifiquei a ocorrência ou a condição.'
    } else {
      const lista = campos.condicoes.map(rotuloTermo).join(', ')
      novo = {
        ocorrencias: atualizar(ultima.id, (o) => comEvento(o, { condicoes: [...o.condicoes, ...campos.condicoes] }, `Condição: ${lista}`)),
        pendente,
      }
      fala = `Anotado na ocorrência do km ${formatarKm(ultima.km ?? '?')}: ${lista}.`
    }
  } else if (intencao === 'registrar_direcionamento') {
    const alvo = (campos.km !== undefined && ativas(ocorrencias).find((o) => Math.abs(o.km - campos.km) < 1)) || ultima
    const setor = setorDoRecurso(primeira(entidades, 'recurso'))
    if (!alvo) {
      fala = 'Não há ocorrência aberta para direcionar.'
    } else if (!setor) {
      fala = 'Para qual setor? Diga, por exemplo: direcionamento para o guincho.'
    } else {
      novo = { ocorrencias: atualizar(alvo.id, (o) => mudarEncaminhamento(o, setor, 'encaminhado', agoraIso, 'voz')), pendente }
      fala = `Ocorrência do km ${formatarKm(alvo.km ?? '?')} encaminhada a ${setorPorId[setor].nome}.`
    }
  } else if (intencao === 'consultar_panorama') {
    const lista = ativas(ocorrencias)
    const graves = lista.filter((o) => o.gravidade === 'alta').length
    fala = lista.length === 0
      ? 'Nenhuma ocorrência aberta agora.'
      : `${lista.length} ${lista.length === 1 ? 'ocorrência aberta' : 'ocorrências abertas'}, ${graves} de gravidade alta. `
        + `A mais recente: ${rotuloTipo(ultima.tipo).toLowerCase()} no km ${formatarKm(ultima.km ?? '?')}, ${rotuloStatus(ultima.status).toLowerCase()}.`
  } else if (intencao === 'fora_de_escopo') {
    fala = 'Não entendi. Pode repetir?'
  } else {
    fala = `Entendi a intenção ${rotuloIntencao(intencao).toLowerCase()}. Essa ação ainda não está disponível.`
  }

  const log = [{ em: agoraIso, texto, fala, intencao }, ...(estado.log ?? [])].slice(0, 20)
  return { analise, fala, mudancas: { ...novo, comandos, log } }
}
