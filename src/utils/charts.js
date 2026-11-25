import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'

let registrado = false

export function registrarCharts() {
  if (registrado) return

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
  )

  ChartJS.defaults.font.family = "'Source Sans 3', 'Segoe UI', sans-serif"
  ChartJS.defaults.color = '#6B6B8A'
  ChartJS.defaults.borderColor = '#E6E5F3'

  const menosMovimento = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (menosMovimento) ChartJS.defaults.animation = false

  registrado = true
}
