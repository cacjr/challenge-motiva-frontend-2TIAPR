// Recorte simulado de outubro: 40 ocorrências registradas na BR-163/MS.
// Não é a contagem dos trechos da consulta nem das interações.
// Os gráficos leem estes objetos (via App): mudar um número muda o desenho.
// Cada gráfico tem o seu objeto, e o README diz de onde sai cada número.
// leitura: o que o gráfico mostra, em uma frase. Aparece só no Dashboard.

// Mapa do Silêncio: minutos médios entre o fato e a central, por faixa de km.
// Acima de limiteMin a barra pinta em âmbar.
export const mapaSilencio = {
  titulo: 'Mapa do Silêncio · minutos entre o fato e a central, por faixa de km',
  labels: ['0–100', '100–200', '200–300', '300–400', '400–500', '500–600', '600–700', '700–845'],
  valores: [3, 6, 9, 15, 2, 26, 31, 21],
  limiteMin: 10,
  leitura:
    'Do km 500 ao 845 a central passa de 20 min sem saber do fato. É ali que o LoRa e a carona mais encurtam o silêncio, e onde o Elo deve ser implantado primeiro.',
}

// Como o registro começou: a voz é o caminho principal, o resto é plano B.
// 29 + 5 + 3 + 3 = 40.
export const ocorrenciasPorEntrada = {
  titulo: 'Como o registro começou · voz primeiro, plano B quando não dá',
  labels: ['Voz (Elo)', 'Botão do colete', 'Homem caído', 'Toque em tela'],
  valores: [29, 5, 3, 3],
  leitura:
    'Quase 3 em cada 4 registros começam pela voz. O plano B cobre o que a voz não alcança: barulho de máquina e colaborador desacordado.',
}

// Por onde o registro chegou à central. 17 + 8 + 9 + 6 = 40.
export const ocorrenciasPorRota = {
  titulo: 'Por onde o registro chegou à central',
  labels: ['4G', 'SMS (2G)', 'LoRa mesh', 'Carona'],
  valores: [17, 8, 9, 6],
  leitura:
    'Menos da metade chega por 4G. Sem SMS, LoRa e carona, 23 das 40 ocorrências dependeriam de alguém achar sinal.',
}

export const velocimetros = [
  {
    id: 'dentro15',
    titulo: 'Dentro de 15 min, contando do fato',
    valor: 62,
    maximo: 100,
    detalhe: '% das ocorrências (a ANTT conta do acionamento)',
    cor: '#c26a12',
  },
  {
    id: 'silencioMedio',
    titulo: 'Silêncio médio',
    valor: 14,
    maximo: 30,
    detalhe: 'minutos no recorte · meta do Elo: até 5',
    cor: '#c26a12',
  },
  {
    id: 'checkin',
    titulo: 'Equipes com check-in em dia',
    valor: 11,
    maximo: 13,
    detalhe: 'frentes de serviço ativas agora',
    cor: '#1f2366',
  },
]
