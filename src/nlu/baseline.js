// Classificador de intenção e extrator de entidades, portados do baseline.py do
// projeto de PLN do grupo (regras v2). Mesmo critério: soma dos pesos, vence a maior pontuação,
// empate desfeito pela ordem de prioridade; sem regra -> fora_de_escopo.
import glossario from './glossario.json' with { type: 'json' }
import { re, escapar } from './regex.js'

const REGRAS = {
  confirmar: [['^(sim|confirmo|confirmar|positivo|correto|isso mesmo)\\b', 3],
    ['^pode (registrar|enviar|encaminhar|mandar|seguir)\\b', 3]],
  negar_corrigir: [['^(não|negativo)\\b', 3], ['\\b(errado|errada)\\b', 1]],
  cancelar: [['\\b(cancelar|esquece|deixa para lá)\\b', 3]],
  registrar_direcionamento: [['\\bdirecionamento\\b', 4]],
  validar_registro: [['\\b(validar|aprovar)\\b', 4]],
  consultar_historico: [['\\bhistórico\\b', 4]],
  consultar_procedimento: [['\\b(procedimento|protocolo)\\b', 3], ['\\bo que (eu )?faço\\b', 2]],
  registrar_dados_atendimento: [['\\bpressão\\b', 3],
    ['\\b(consciente|inconsciente|fratura|sangramento|corte no|lesão)\\b', 2]],
  gerar_resumo: [['\\bgerar\\b', 2], ['\\b(passagem de turno|síntese|relatório para)\\b', 3],
    ['\\bresumo do atendimento\\b', 3]],
  encerrar_atendimento: [['\\b(encerrar|finalizar)\\b', 3]],
  consultar_pendencias: [['\\b(incomplet\\w*|pendente\\w*|falta preencher|desvio\\w*)\\b', 3]],
  consultar_indicadores: [['\\b(tempo médio|comparar|desempenho|recorrent\\w*|repetid\\w*|volume)\\b', 3]],
  consultar_prioridades: [['\\b(crític\\w*|prioridade\\w*|fora do prazo|atrasad\\w*|há mais tempo)\\b', 3]],
  solicitar_apoio: [['\\b(solicitar|preciso de|precisar de|apoio|reforço)\\b', 2], ['\\bmandar\\b', 1]],
  consultar_recursos: [['\\b(acionad\\w*|disponíve\\w*|em uso)\\b', 2],
    ['\\b(onde est[áã]o?|quant[oa]s|quais|qual)\\b.*\\b(guinchos?|recursos?|viaturas?|ambulâncias?)\\b', 2]],
  consultar_dados_ocorrencia: [['\\b(acesso|rota|risco\\w*|como chego|interditad\\w*)\\b', 2],
    ['\\b(status|situação) da ocorrência\\b', 3], ['\\bresumo da ocorrência\\b', 3]],
  consultar_panorama: [['\\b(resumo|panorama)\\b', 2], ['\\bcomo (tá|está) a operação\\b', 3],
    ['\\bquantas ocorrências\\b', 2], ['\\bocorrências abertas\\b', 2]],
  relatar_condicoes: [['\\binformar\\b', 2],
    ['\\b(neblina|chuva|pista molhada|vazando|carga|visibilidade|destruíd\\w*)\\b', 1]],
  atualizar_status: [['\\b(atualizar|mudar)\\b.*\\bstatus\\b', 3],
    ['\\b(cheguei|chegando|chegada|a caminho|saindo|missão recebida|em atendimento|iniciando|removid\\w*|liberad\\w*|marcar)\\b', 2]],
  registrar_ocorrencia: [['\\b(registrar|abrir)\\b.*\\bocorrência\\b', 3], ['\\b(registrar|abrir)\\b', 1],
    ['\\b(acidente|sinistro|batida|colisão|pane|animal na pista|veículo parado|carro parado)\\b', 1]],
}
const PRIORIDADE = Object.keys(REGRAS)

const V2 = Object.fromEntries(Object.entries(REGRAS).map(([k, v]) => [k, [...v]]))
V2.registrar_ocorrencia.push(
  ['\\b(registro|registrei|registra|abro|abri)\\b.*\\bocorrência\\b', 3],
  ['\\b(tombamento|tombad\\w*|capotamento|capotad\\w*|animal morto|atropelamento|incêndio|furad\\w*|quebrad\\w*)\\b', 1],
  ['\\b(carro|veículo|caminhão|moto|ônibus)\\b.*\\bacostamento\\b', 1])
// Extensão da Sprint 2 do front (não existe no baseline.py): problemas de via,
// que entram no formulário e no filtro junto com os de segurança.
V2.registrar_ocorrencia.push(
  ['\\b(buracos?|cratera|placa (caída|derrubada|quebrada|encoberta|apagada)|mato alto|capim alto|vegetação|galhos?|árvore caída)\\b', 1])
V2.solicitar_apoio.push(
  ['\\bprecis\\w* d[eoa]s? (mais )?(um |uma )?(ambulância|guincho|helicóptero|equipe|viatura|apoio|reforço|resgate)\\b', 3],
  ['\\bambulância\\b', 1])
V2.encerrar_atendimento.push(['\\b(encerrad\\w*|finalizad\\w*)\\b', 3])
V2.consultar_recursos.push(['\\b(livres?|disponíve\\w*)\\b', 2],
  ['\\b(onde est[áã]o?|quant[oa]s|quais|qual)\\b.*\\bequipes?\\b', 2])
V2.consultar_dados_ocorrencia.push(['\\bjá (resolveram|resolvid\\w*|chegou|foi)\\b', 3])
V2.consultar_indicadores.push(['\\b(quant\\w*|teve|tivemos)\\b.*\\b(semana|mês|meses|dias|período)\\b', 3])
V2.gerar_resumo.push(['\\brelatório\\b', 3])
V2.consultar_panorama.push(['\\bcomo\\b.*\\b(está|tá|anda)\\b.*\\boperação\\b', 3])

const COMPILADAS = Object.entries(V2).map(([intencao, regras]) =>
  [intencao, regras.map(([p, peso]) => [re(p), peso])])

export function classificar(texto) {
  const pontos = {}
  for (const [intencao, regras] of COMPILADAS) {
    const p = regras.reduce((s, [rx, peso]) => s + (rx.test(texto) ? peso : 0), 0)
    if (p) pontos[intencao] = p
  }
  const valores = Object.values(pontos)
  if (!valores.length) return { intencao: 'fora_de_escopo', pontos }
  const melhor = Math.max(...valores)
  return { intencao: PRIORIDADE.find((i) => pontos[i] === melhor), pontos }
}

const VARIANTES = []
for (const t of glossario.termos) {
  if (['tipo_ocorrencia', 'recurso', 'status', 'condicao_observada'].includes(t.tipo)) {
    for (const v of t.variantes) VARIANTES.push([t.tipo, t.canonico, v])
  }
}
VARIANTES.sort((a, b) => b[2].length - a[2].length)
const VARIANTES_RX = VARIANTES.map(([tipo, can, v]) => [tipo, can, re(`\\b${escapar(v)}\\b`, 'g')])

export function extrairEntidades(texto) {
  const ents = []
  const ocupado = []
  const livre = (a, b) => ocupado.every(([x, y]) => b <= x || a >= y)
  const add = (tipo, valor, a, b) => {
    if (livre(a, b)) {
      ents.push({ tipo, valor, span: [a, b] })
      ocupado.push([a, b])
    }
  }
  const varrer = (padrao, fn) => {
    for (const m of texto.matchAll(re(padrao, 'g'))) fn(m, m.index, m.index + m[0].length)
  }
  varrer('\\bkm (\\d+(?:\\.\\d+)?)\\b', (m, a, b) => add('km', parseFloat(m[1]), a, b))
  varrer('\\b(?:sentido|pista) (capital|interior|litoral|norte|sul|leste|oeste|crescente|decrescente)\\b',
    (m, a, b) => add('sentido', m[1], a, b))
  varrer('\\bfaixa (\\d)\\b', (m, a, b) => add('faixa', `faixa_${m[1]}`, a, b))
  varrer('\\bfaixa da (direita|esquerda)\\b', (m, a, b) => add('faixa', `faixa_${m[1]}`, a, b))
  varrer('\\bacostamento\\b', (m, a, b) => add('faixa', 'acostamento', a, b))
  varrer('\\bocorrência (\\d{2,})\\b', (m, a, b) => add('tag_ocorrencia', m[1], a, b))
  varrer('\\b(\\d{2}:\\d{2})\\b', (m, a, b) => add('horario', m[1], a, b))
  for (const [tipo, can, rx] of VARIANTES_RX) {
    for (const m of texto.matchAll(rx)) add(tipo, can, m.index, m.index + m[0].length)
  }
  return ents.sort((x, y) => x.span[0] - y.span[0])
}
