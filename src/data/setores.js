// Setores que recebem as ocorrências da central (Motiva Pantanal, simulado para a aula).
// Os três primeiros são as personas de campo da taxonomia da Sprint 1;
// conservação e os órgãos externos completam o despacho.
// tipos usam os ids de src/data/dominio.js; recursos e condições, o glossário do NLU.
export const setores = [
  {
    id: 'aph',
    nome: 'Atendimento Pré-Hospitalar',
    sigla: 'APH',
    tipos: ['acidente', 'atropelamento'],
    recursos: ['ambulancia', 'uti_movel'],
    condicoes: [],
  },
  {
    id: 'guincho',
    nome: 'Guincho e Recurso Operacional',
    sigla: 'GUI',
    tipos: ['acidente', 'veiculo_parado', 'obstaculo'],
    recursos: ['guincho', 'guincho_leve', 'guincho_pesado'],
    condicoes: [],
  },
  {
    id: 'inspecao',
    nome: 'Inspeção de Tráfego',
    sigla: 'INS',
    tipos: ['acidente', 'atropelamento', 'animal_na_pista', 'obstaculo', 'veiculo_parado', 'sinalizacao'],
    recursos: ['viatura_inspecao', 'viatura_sinalizacao'],
    condicoes: ['neblina', 'baixa_visibilidade', 'faixa_interditada', 'pista_bloqueada', 'congestionamento'],
  },
  {
    id: 'conservacao',
    nome: 'Conservação de Rodovia',
    sigla: 'CON',
    tipos: ['obstaculo', 'buraco', 'sinalizacao', 'vegetacao'],
    recursos: [],
    condicoes: ['carga_espalhada', 'vazamento_combustivel', 'pista_molhada'],
  },
  {
    id: 'bombeiros',
    nome: 'Corpo de Bombeiros',
    sigla: 'CBM',
    externo: true,
    tipos: [],
    recursos: ['bombeiros'],
    condicoes: ['vazamento_combustivel', 'fumaca'],
  },
  {
    id: 'prf',
    nome: 'Polícia Rodoviária Federal',
    sigla: 'PRF',
    externo: true,
    tipos: ['atropelamento'],
    recursos: ['policia'],
    condicoes: ['pista_bloqueada'],
  },
  {
    id: 'supervisao',
    nome: 'Supervisão de Operações',
    sigla: 'SUP',
    tipos: [],
    recursos: [],
    condicoes: [],
  },
]
