// Vocabulário único da plataforma. Formulário, filtro, Selo, painel, NLU e
// README usam exatamente estes ids e rótulos.

// Tipos de ocorrência: segurança viária (o que o Elo entende por voz) + via
// (conservação: buraco, sinalização, vegetação) + outro.
// gravidadePadrao: sugestão quando ninguém informa a gravidade.
export const TIPOS = [
  { id: 'acidente', rotulo: 'Acidente', sigla: 'COL', gravidadePadrao: 'alta' },
  { id: 'atropelamento', rotulo: 'Atropelamento', sigla: 'ATR', gravidadePadrao: 'alta' },
  { id: 'animal_na_pista', rotulo: 'Animal na pista', sigla: 'ANI', gravidadePadrao: 'media' },
  { id: 'obstaculo', rotulo: 'Obstáculo ou carga na pista', sigla: 'OBS', gravidadePadrao: 'media' },
  { id: 'veiculo_parado', rotulo: 'Veículo parado ou pane', sigla: 'VPA', gravidadePadrao: 'baixa' },
  { id: 'buraco', rotulo: 'Buraco', sigla: 'BUR', gravidadePadrao: 'media' },
  { id: 'sinalizacao', rotulo: 'Sinalização', sigla: 'SIN', gravidadePadrao: 'media' },
  { id: 'vegetacao', rotulo: 'Vegetação', sigla: 'VEG', gravidadePadrao: 'baixa' },
  { id: 'outro', rotulo: 'Outro', sigla: 'OUT', gravidadePadrao: 'media' },
]

export const GRAVIDADES = [
  { id: 'baixa', rotulo: 'Baixa' },
  { id: 'media', rotulo: 'Média' },
  { id: 'alta', rotulo: 'Alta' },
]

export const STATUS = [
  { id: 'aberta', rotulo: 'Aberta' },
  { id: 'em_atendimento', rotulo: 'Em atendimento' },
  { id: 'resolvida', rotulo: 'Resolvida' },
]

export const COBERTURAS = [
  { id: 'sinal', rotulo: 'Com sinal (4G)' },
  { id: 'sombra parcial', rotulo: 'Sombra parcial' },
  { id: 'sombra total', rotulo: 'Sombra total' },
]

// Como o registro começou. Voz é o caminho principal; botão e homem caído são
// o plano B; formulário é o registro digitado na tela Ocorrências.
export const CANAIS = [
  { id: 'voz', rotulo: 'Voz (Elo)' },
  { id: 'formulario', rotulo: 'Formulário' },
  { id: 'botao', rotulo: 'Botão do colete' },
  { id: 'automatico', rotulo: 'Homem caído' },
]

// Por onde o registro chegou à central (cascata de envio).
export const ROTAS = ['4G', 'SMS (2G)', 'LoRa mesh', 'Carona']

// Tipos do glossário do NLU (Sprint 1 de PLN) traduzidos para os tipos da plataforma.
export const TIPO_DO_GLOSSARIO = {
  acidente: 'acidente',
  vitima_presa: 'acidente',
  incendio_veiculo: 'acidente',
  atropelamento: 'atropelamento',
  animal_na_pista: 'animal_na_pista',
  objeto_na_pista: 'obstaculo',
  queda_de_carga: 'obstaculo',
  oleo_na_pista: 'obstaculo',
  pane_mecanica: 'veiculo_parado',
  veiculo_parado: 'veiculo_parado',
  buraco: 'buraco',
  sinalizacao: 'sinalizacao',
  vegetacao: 'vegetacao',
}

const mapa = (lista) => Object.fromEntries(lista.map((item) => [item.id, item]))
export const tipoPorId = mapa(TIPOS)
export const gravidadePorId = mapa(GRAVIDADES)
export const statusPorId = mapa(STATUS)
export const canalPorId = mapa(CANAIS)

export const rotuloTipo = (id) => tipoPorId[id]?.rotulo ?? 'Outro'
export const rotuloGravidade = (id) => gravidadePorId[id]?.rotulo ?? id
export const rotuloStatus = (id) => statusPorId[id]?.rotulo ?? id
export const rotuloCanal = (id) => canalPorId[id]?.rotulo ?? id

// Rótulos de termos do glossário (recursos, condições, etapas) para tela e fala.
const ROTULO_TERMO = {
  pane_mecanica: 'pane mecânica', veiculo_parado: 'veículo parado', oleo_na_pista: 'óleo na pista',
  incendio_veiculo: 'incêndio em veículo', vitima_presa: 'vítima presa nas ferragens',
  guincho_pesado: 'guincho pesado', guincho_leve: 'guincho leve', uti_movel: 'UTI móvel',
  ambulancia: 'ambulância', viatura_sinalizacao: 'viatura de sinalização',
  viatura_inspecao: 'viatura de inspeção', policia: 'polícia', baixa_visibilidade: 'baixa visibilidade',
  vazamento_combustivel: 'vazamento de combustível', fumaca: 'fumaça',
  missao_recebida: 'missão recebida', a_caminho: 'equipe a caminho', no_local: 'equipe no local',
  em_atendimento: 'em atendimento', remocao_iniciada: 'remoção iniciada',
  em_transporte: 'vítima em transporte', via_liberada: 'via liberada',
}
export const rotuloTermo = (t) => ROTULO_TERMO[t] ?? tipoPorId[t]?.rotulo.toLowerCase() ?? String(t).replaceAll('_', ' ')
