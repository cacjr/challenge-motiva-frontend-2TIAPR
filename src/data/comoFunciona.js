// Textos da tela Como funciona. Descrevem a solução proposta;
// nada aqui está implementado na Sprint 1. Quem importa este arquivo é o App.

// O Elo é um agente de voz. Estes são os comandos que ele entende.
export const comandosVoz = [
  {
    id: 'registrar',
    acao: 'Registrar',
    exemplo: '"Elo, colisão no km 688, duas vítimas, uma presa."',
    oQueFaz: 'Transforma a frase em tipo, km, gravidade e vítimas, lê de volta e pede confirmação.',
  },
  {
    id: 'consultar',
    acao: 'Consultar',
    exemplo: '"Elo, como está o sinal até o km 700?"',
    oQueFaz: 'Responde no próprio aparelho, sem rede: cobertura, base mais próxima, canal provável.',
  },
  {
    id: 'checkin',
    acao: 'Check-in',
    exemplo: '"Elo, check-in da equipe R03."',
    oQueFaz: 'Marca a equipe como segura e agenda o próximo check-in esperado.',
  },
  {
    id: 'anexar',
    acao: 'Anexar',
    exemplo: '"Elo, manda a foto depois."',
    oQueFaz: 'O código sai na frente; a foto segue quando houver banda.',
  },
  {
    id: 'socorro',
    acao: 'Pedir socorro',
    exemplo: '"Elo, socorro."',
    oQueFaz: 'Dispara SOS com a última posição, sem nenhuma pergunta.',
  },
]

// Quando a voz não dá: barulho, colaborador desacordado, cena que exige silêncio.
export const planoB = [
  {
    id: 'botao',
    nome: 'Botão no colete',
    como: '1 toque faz check-in. 2 toques abrem ocorrência. Toque longo é SOS. Rádio LoRa embutido: não depende de tela nem de celular.',
    quando: 'Roçadeira, motor ou vento impedem a voz.',
  },
  {
    id: 'automatico',
    nome: 'Homem caído automático',
    como: 'O acelerômetro detecta queda ou impacto. O Elo pergunta por voz se está tudo bem; sem resposta em 30 s, dispara SOS sozinho.',
    quando: 'Atropelamento ou mal súbito de colaborador.',
  },
  {
    id: 'toque',
    nome: 'Toque em 3 telas',
    como: 'Ícones grandes: tipo › gravidade › vítimas. Três toques e o registro está pronto.',
    quando: 'Cena em que falar não é possível.',
  },
]

export const autopreenchimento = [
  { id: 'gps', origem: 'GPS', preenche: 'km, sentido e trecho da BR-163' },
  { id: 'escala', origem: 'Escala do dia', preenche: 'colaborador, equipe e frente de serviço' },
  { id: 'relogio', origem: 'Relógio do aparelho', preenche: 'hora do fato (não a hora do envio)' },
  { id: 'cobertura', origem: 'Mapa de cobertura', preenche: 'canal de envio mais provável no ponto' },
]

export const cascata = [
  { id: '4g', ordem: 1, canal: '4G', alcance: 'Onde houver sinal', papel: 'Envio imediato, com foto.' },
  { id: 'sms', ordem: 2, canal: 'SMS (2G)', alcance: 'Pega mais longe que o 4G', papel: 'O código cabe em uma mensagem.' },
  { id: 'lora', ordem: 3, canal: 'LoRa mesh', alcance: '2 a 10 km por salto', papel: 'Colete, viaturas, call boxes e bases repassam o pacote.' },
  { id: 'carona', ordem: 4, canal: 'Carona', alcance: 'Qualquer viatura que passe', papel: 'Guarda o pacote e entrega ao achar sinal (store-and-forward).' },
  { id: 'satelite', ordem: 5, canal: 'Satélite no celular', alcance: 'Previsto para 2027 no Brasil', papel: 'Entra na cascata quando for liberado.' },
]

export const codigoElo = [
  { id: 'versao', campo: 'E1', significado: 'Versão do Código Elo' },
  { id: 'km', campo: '688.2', significado: 'km (GPS)' },
  { id: 'sentido', campo: 'N', significado: 'Sentido (GPS)' },
  { id: 'tipo', campo: 'COL', significado: 'Tipo: colisão, SOS, fauna, carga…' },
  { id: 'gravidade', campo: 'ALTA', significado: 'Gravidade' },
  { id: 'vitimas', campo: 'V2|P1', significado: '2 vítimas, 1 presa' },
  { id: 'hora', campo: '1432', significado: 'Hora do fato (14:32)' },
]

export const principios = [
  { id: 'seguranca', valor: 'Segurança', ligacao: 'Acidente zero para usuários e colaboradores: o Elo mede o minuto que hoje ninguém vê.' },
  { id: 'simplicidade', valor: 'Simplicidade', ligacao: 'Registrar falando, sem digitar. Se a voz não der, dois toques ou nenhum gesto.' },
  { id: 'servir', valor: 'Servir a Sociedade', ligacao: 'Onde a malha é mais isolada, o socorro chega mais cedo.' },
  { id: 'excelencia', valor: 'Excelência', ligacao: 'Uma métrica nova, auditável: hora do fato contra hora da central.' },
  { id: 'natureza', valor: 'Cuidar da Natureza', ligacao: 'Atropelamento de fauna também vira registro com km exato: o dado mostra onde a rodovia precisa de passagem de fauna.' },
]
