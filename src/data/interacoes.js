// Histórico simulado de comandos ao Elo, o agente de voz do colaborador de campo.
// O agente ainda não existe: ninguém ouve o microfone, nenhum botão está
// pareado e nenhum pacote trafega. A resposta é texto fixo, escrito à mão.
// canal: 'voz' (o caminho principal) | 'botao' | 'automatico' (plano B,
// quando a voz não dá).
// codigo: o Código Elo (~50 bytes) que sairia do aparelho.
// rota: por onde o pacote teria chegado à central (4G, SMS, LoRa ou carona).
// silencioMin: minutos entre o fato e a central receber.
// Todo km citado aqui está dentro de um trecho de src/data/trechos.js.
export const interacoes = [
  {
    id: 'i-1',
    canal: 'voz',
    texto: 'Elo, colisão traseira no km 688, duas vítimas, uma presa nas ferragens.',
    data: '2026-10-06T14:32:00',
    codigo: 'E1|688.2|N|COL|ALTA|V2|P1|1432',
    rota: 'LoRa → base Rio Verde de MT',
    silencioMin: 3,
    resposta:
      'Entendi: colisão, km 688,2, sentido norte, gravidade alta, 2 vítimas, 1 presa. Confirma? (confirmado). Sentido, equipe e hora vieram do autopreenchimento. Central recebeu pré-despacho de APH e resgate.',
  },
  {
    id: 'i-2',
    canal: 'voz',
    texto: 'Elo, como está o sinal até o km 700?',
    data: '2026-10-06T13:58:00',
    codigo: '—',
    rota: 'Consulta no próprio aparelho, sem rede',
    silencioMin: 0,
    resposta:
      'Do km 670 ao 710 é sombra total. Seus registros vão por LoRa (base Rio Verde de MT) ou carona. Ativei check-in a cada 20 min enquanto você estiver nesse trecho.',
  },
  {
    id: 'i-3',
    canal: 'voz',
    texto: 'Elo, anta na pista no km 571, sem vítimas.',
    data: '2026-10-05T23:10:00',
    codigo: 'E1|571.4|S|FAU|MEDIA|V0|2310',
    rota: 'Carona na viatura I-23 até área com 4G',
    silencioMin: 22,
    resposta:
      'Animal na pista, km 571,4, gravidade média, sem vítimas. Sem LoRa no ponto: o registro pegou carona na viatura I-23 e foi entregue quando ela achou sinal. Sem o Elo, a central só saberia quando alguém ligasse.',
  },
  {
    id: 'i-4',
    canal: 'voz',
    texto: 'Elo, carga tombada no acostamento do km 318. Manda a foto depois.',
    data: '2026-10-06T06:52:00',
    codigo: 'E1|318.7|S|CAR|ALTA|V0|0652',
    rota: 'SMS 2G (código) + 4G (foto, depois)',
    silencioMin: 6,
    resposta:
      'Carga tombada, km 318,7, acostamento. O código saiu na frente, por SMS, em 6 min. A foto ficou guardada e subiu 41 min depois, quando a viatura entrou em Rio Brilhante. A central despachou sem esperar a imagem.',
  },
  {
    id: 'i-5',
    canal: 'voz',
    texto: 'Elo, check-in da equipe R03, roçada no km 812.',
    data: '2026-10-07T09:40:00',
    codigo: 'E1|812.3|N|CHK|R03|0940',
    rota: 'LoRa → call box km 815 → base Sonora',
    silencioMin: 1,
    resposta:
      'Check-in da R03 registrado no km 812,3. Próximo check-in esperado às 10:00. Se ele não chegar, eu aviso a base de Sonora.',
  },
  {
    id: 'i-6',
    canal: 'automatico',
    texto: 'Queda detectada no km 562. O Elo pergunta por voz: "Você está bem?" Sem resposta em 30 s.',
    data: '2026-10-05T22:47:00',
    codigo: 'E1|562.0|S|SOS|ALTA|COLAB|C07|2247',
    rota: 'SMS 2G → central',
    silencioMin: 4,
    resposta:
      'Homem caído disparado sozinho. Colaborador C07 da inspeção noturna. O aviso subiu por SMS, que alcança mais longe que o 4G. Viatura mais próxima acionada.',
  },
  {
    id: 'i-7',
    canal: 'botao',
    texto: 'Toque longo no botão do colete, km 790. Roçadeira ligada: a voz não seria entendida.',
    data: '2026-10-07T10:14:00',
    codigo: 'E1|790.6|N|SOS|ALTA|COLAB|R03|1014',
    rota: 'LoRa → call box km 815 → base Sonora',
    silencioMin: 2,
    resposta:
      'SOS da equipe R03. O botão não precisa de tela nem de sinal: o rádio LoRa do colete alcançou o call box do km 815. Assim que o barulho parar, eu chamo por voz para entender o que houve.',
  },
]
