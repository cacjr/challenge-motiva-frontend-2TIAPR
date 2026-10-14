import { Bar } from 'react-chartjs-2'
import { registrarCharts } from '../utils/charts.js'
import { descreverSerie } from '../utils/formatar.js'

registrarCharts()

// Componente genérico: cada gráfico de barras da plataforma é um uso dele,
// com outros labels e valores.
// cor aceita uma cor só ou um array (uma cor por barra).
export default function GraficoBarras({
  titulo,
  labels,
  valores,
  cor = '#1f2366',
  rotuloValor = 'Quantidade',
  leitura,
  largo = false,
}) {
  const dados = {
    labels,
    datasets: [
      {
        label: rotuloValor,
        data: valores,
        backgroundColor: cor,
        borderRadius: 3,
        maxBarThickness: 46,
      },
    ],
  }

  const opcoes = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#5b6075' },
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0, color: '#5b6075' },
        grid: { color: '#e6e8f2' },
        border: { display: false },
      },
    },
  }

  return (
    <figure className={largo ? 'grafico grafico-largo' : 'grafico'}>
      <figcaption>{titulo}</figcaption>
      <div className="grafico-area">
        <Bar
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
