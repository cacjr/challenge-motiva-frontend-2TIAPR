// Dados de exemplo: carregados na primeira vez que a plataforma abre (ou pelo
// botão "Restaurar exemplo"). Depois disso, quem manda é o localStorage.
// Trechos da BR-163/MS com km aproximados; ocorrências, horários e cobertura
// são simulados para a aula, não são boletim oficial da Motiva Pantanal.

export const trechosExemplo = [
  { id: 't-br163-000', rodovia: 'BR-163/MS', referencia: 'Mundo Novo · Eldorado', kmInicial: 0, kmFinal: 40, cobertura: 'sinal' },
  { id: 't-br163-300', rodovia: 'BR-163/MS', referencia: 'Rio Brilhante', kmInicial: 300, kmFinal: 345, cobertura: 'sombra parcial' },
  { id: 't-br163-455', rodovia: 'BR-163/MS', referencia: 'Campo Grande (perímetro)', kmInicial: 455, kmFinal: 490, cobertura: 'sinal' },
  { id: 't-br163-540', rodovia: 'BR-163/MS', referencia: 'Bandeirantes · São Gabriel do Oeste', kmInicial: 540, kmFinal: 600, cobertura: 'sombra total' },
  { id: 't-br163-670', rodovia: 'BR-163/MS', referencia: 'Rio Verde de Mato Grosso', kmInicial: 670, kmFinal: 710, cobertura: 'sombra total' },
  { id: 't-br163-720', rodovia: 'BR-163/MS', referencia: 'Coxim (ponte do rio Taquari)', kmInicial: 720, kmFinal: 760, cobertura: 'sombra parcial' },
  { id: 't-br163-770', rodovia: 'BR-163/MS', referencia: 'Pedro Gomes · Sonora', kmInicial: 770, kmFinal: 845, cobertura: 'sombra parcial' },
]

// O trecho que abre selecionado: Rio Verde tem duas graves abertas e mostra o alerta.
export const trechoAtualExemplo = 't-br163-670'

// horaFato: quando aconteceu. registradoEm: quando a central recebeu.
// A diferença é o tempo de silêncio. atendimentoEm: quando a equipe começou.
export const ocorrenciasExemplo = [
  {
    id: 'oc-ex-01', trechoId: 't-br163-670', tipo: 'acidente', gravidade: 'alta', status: 'em_atendimento',
    canal: 'voz', rota: 'LoRa mesh', km: 688.2, sentido: 'norte',
    descricao: 'Colisão traseira entre carreta e carro, duas vítimas, uma presa nas ferragens.',
    horaFato: '2026-11-24T14:29:00', registradoEm: '2026-11-24T14:32:00', atendimentoEm: '2026-11-24T14:41:00',
    recursos: ['ambulancia'], condicoes: [],
  },
  {
    id: 'oc-ex-02', trechoId: 't-br163-670', tipo: 'acidente', gravidade: 'alta', status: 'aberta',
    canal: 'voz', rota: 'Carona', km: 702.5, sentido: 'sul',
    descricao: 'Caminhão tombado na descida da serra, carga de grãos espalhada na pista.',
    horaFato: '2026-11-24T21:05:00', registradoEm: '2026-11-24T21:39:00',
    recursos: [], condicoes: ['carga_espalhada'],
  },
  {
    id: 'oc-ex-03', trechoId: 't-br163-670', tipo: 'obstaculo', gravidade: 'media', status: 'resolvida',
    canal: 'formulario', rota: 'LoRa mesh', km: 695, sentido: 'norte',
    descricao: 'Pneu de caminhão na faixa da direita.',
    horaFato: '2026-11-22T09:10:00', registradoEm: '2026-11-22T09:31:00',
    atendimentoEm: '2026-11-22T09:48:00', resolvidaEm: '2026-11-22T10:05:00',
  },
  {
    id: 'oc-ex-04', trechoId: 't-br163-670', tipo: 'atropelamento', gravidade: 'alta', status: 'resolvida',
    canal: 'botao', rota: 'LoRa mesh', km: 676, sentido: 'sul',
    descricao: 'SOS pelo botão do colete: colaborador da roçada atingido de raspão por moto.',
    horaFato: '2026-11-21T05:50:00', registradoEm: '2026-11-21T05:52:00',
    atendimentoEm: '2026-11-21T06:03:00', resolvidaEm: '2026-11-21T07:10:00',
  },
  {
    id: 'oc-ex-05', trechoId: 't-br163-540', tipo: 'animal_na_pista', gravidade: 'media', status: 'resolvida',
    canal: 'voz', rota: 'Carona', km: 571.4, sentido: 'sul',
    descricao: 'Anta na pista, sem vítimas.',
    horaFato: '2026-11-23T23:10:00', registradoEm: '2026-11-23T23:32:00',
    atendimentoEm: '2026-11-23T23:50:00', resolvidaEm: '2026-11-24T00:15:00',
  },
  {
    id: 'oc-ex-06', trechoId: 't-br163-540', tipo: 'animal_na_pista', gravidade: 'alta', status: 'em_atendimento',
    canal: 'formulario', rota: 'LoRa mesh', km: 563, sentido: 'norte',
    descricao: 'Anta atropelada ocupando a faixa; motorista consciente, carro sem condição de seguir.',
    horaFato: '2026-11-24T04:15:00', registradoEm: '2026-11-24T04:24:00', atendimentoEm: '2026-11-24T04:37:00',
    recursos: ['guincho'], condicoes: [],
  },
  {
    id: 'oc-ex-07', trechoId: 't-br163-540', tipo: 'vegetacao', gravidade: 'baixa', status: 'aberta',
    canal: 'formulario', rota: 'LoRa mesh', km: 590, sentido: null,
    descricao: 'Mato alto encobrindo a placa de curva perigosa.',
    horaFato: '2026-11-20T15:00:00', registradoEm: '2026-11-20T15:40:00',
  },
  {
    id: 'oc-ex-08', trechoId: 't-br163-300', tipo: 'obstaculo', gravidade: 'alta', status: 'resolvida',
    canal: 'voz', rota: 'SMS (2G)', km: 318.7, sentido: 'sul',
    descricao: 'Carga tombada no acostamento, invadindo a faixa.',
    horaFato: '2026-11-22T06:46:00', registradoEm: '2026-11-22T06:52:00',
    atendimentoEm: '2026-11-22T07:00:00', resolvidaEm: '2026-11-22T08:30:00',
    condicoes: ['carga_espalhada'],
  },
  {
    id: 'oc-ex-09', trechoId: 't-br163-300', tipo: 'sinalizacao', gravidade: 'media', status: 'em_atendimento',
    canal: 'formulario', rota: 'SMS (2G)', km: 330, sentido: 'sul',
    descricao: 'Neblina forte e painel de mensagens do km 320 apagado.',
    horaFato: '2026-11-24T06:10:00', registradoEm: '2026-11-24T06:15:00', atendimentoEm: '2026-11-24T06:40:00',
    condicoes: ['neblina'],
  },
  {
    id: 'oc-ex-10', trechoId: 't-br163-455', tipo: 'buraco', gravidade: 'media', status: 'aberta',
    canal: 'formulario', rota: '4G', km: 471, sentido: 'norte',
    descricao: 'Buraco de uns 40 cm na faixa da direita, perto do viaduto.',
    horaFato: '2026-11-24T10:02:00', registradoEm: '2026-11-24T10:03:00',
  },
  {
    id: 'oc-ex-11', trechoId: 't-br163-455', tipo: 'veiculo_parado', gravidade: 'baixa', status: 'resolvida',
    canal: 'voz', rota: '4G', km: 482, sentido: 'sul',
    descricao: 'Carro parado no acostamento com pane elétrica.',
    horaFato: '2026-11-23T17:20:00', registradoEm: '2026-11-23T17:21:00',
    atendimentoEm: '2026-11-23T17:35:00', resolvidaEm: '2026-11-23T18:02:00',
  },
  {
    id: 'oc-ex-12', trechoId: 't-br163-720', tipo: 'sinalizacao', gravidade: 'media', status: 'aberta',
    canal: 'formulario', rota: 'SMS (2G)', km: 741, sentido: 'norte',
    descricao: 'Placa de ponte estreita derrubada antes da ponte do rio Taquari.',
    horaFato: '2026-11-23T18:00:00', registradoEm: '2026-11-23T18:09:00',
  },
  {
    id: 'oc-ex-13', trechoId: 't-br163-770', tipo: 'outro', gravidade: 'alta', status: 'resolvida',
    canal: 'automatico', rota: 'SMS (2G)', km: 790.6, sentido: 'norte',
    descricao: 'Homem caído: queda detectada no colaborador da equipe R03, sem resposta em 30 s.',
    horaFato: '2026-11-21T10:14:00', registradoEm: '2026-11-21T10:16:00',
    atendimentoEm: '2026-11-21T10:29:00', resolvidaEm: '2026-11-21T11:00:00',
  },
  {
    id: 'oc-ex-14', trechoId: 't-br163-000', tipo: 'vegetacao', gravidade: 'baixa', status: 'resolvida',
    canal: 'formulario', rota: '4G', km: 22, sentido: null,
    descricao: 'Galhos sobre o acostamento depois da chuva.',
    horaFato: '2026-11-20T08:00:00', registradoEm: '2026-11-20T08:02:00',
    atendimentoEm: '2026-11-20T09:10:00', resolvidaEm: '2026-11-20T10:00:00',
  },
]
