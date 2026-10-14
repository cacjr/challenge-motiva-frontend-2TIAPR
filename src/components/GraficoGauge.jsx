import { Doughnut } from 'react-chartjs-2'
import { registrarCharts } from '../utils/charts.js'
import { cores } from '../utils/cores.js'

registrarCharts()

// Velocímetro: meia rosca. valor / maximo preenche o arco.
// Cada índice novo é um objeto em velocimetros (resumoDashboard.js).
export default function GraficoGauge({
  titulo,
  valor,
  maximo,
  detalhe,
  cor = cores.indigo,
}) {
  const resto = Math.max(maximo - valor, 0)

  const dados = {
    datasets: [
      {
        data: [valor, resto],
        backgroundColor: [cor, '#e5e7f2'],
        borderWidth: 0,
      },
    ],
  }

  const opcoes = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: -90,
    circumference: 180,
    cutout: '76%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  }

  return (
    <figure className="gauge">
      <div className="gauge-arco">
        <Doughnut data={dados} options={opcoes} aria-hidden="true" />
        <p className="gauge-valor">
          {valor}
          <span aria-hidden="true">/{maximo}</span>
          <span className="sr-only"> de {maximo}</span>
        </p>
      </div>
      <figcaption>
        <strong>{titulo}</strong>
        <span>{detalhe}</span>
      </figcaption>
    </figure>
  )
}
