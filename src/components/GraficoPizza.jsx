import { Pie } from 'react-chartjs-2'
import { registrarCharts } from '../utils/charts.js'
import { descreverSerie } from '../utils/formatar.js'

registrarCharts()

const CORES = ['#1f2366', '#3f4bb8', '#c26a12', '#9aa1c9']

// Pizza mostra parte de um todo (aqui, a rota de chegada das ocorrências).
// CORES segue a paleta índigo e âmbar do index.css.
export default function GraficoPizza({ titulo, labels, valores, leitura }) {
  const dados = {
    labels,
    datasets: [
      {
        data: valores,
        backgroundColor: labels.map((_, indice) => CORES[indice % CORES.length]),
        borderWidth: 0,
      },
    ],
  }

  const opcoes = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          padding: 14,
          color: '#3a3f55',
        },
      },
    },
  }

  return (
    <figure className="grafico">
      <figcaption>{titulo}</figcaption>
      <div className="grafico-area">
        <Pie
          data={dados}
          options={opcoes}
          role="img"
          aria-label={`${titulo}. ${descreverSerie(labels, valores)}`}
        />
      </div>
      {leitura && <p className="grafico-leitura">{leitura}</p>}
    </figure>
  )
}
