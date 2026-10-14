import PainelGraficos from '../components/PainelGraficos.jsx'
import { somar } from '../utils/formatar.js'

export default function Dashboard({ resumo }) {
  // Gráfico novo: um objeto em src/data/resumoDashboard.js, repassado pelo App,
  // e uma linha no README dizendo o que ele responde.
  const total = somar(resumo.ocorrenciasPorRota.valores)

  return (
    <section>
      <h2>Dashboard</h2>
      <p className="intro">
        A análise completa do recorte simulado de outubro: {total} ocorrências
        na BR-163/MS. Só aqui aparece o Mapa do Silêncio, que mostra onde a
        malha fica muda (barras em âmbar passam de{' '}
        {resumo.mapaSilencio.limiteMin} min), e a leitura de cada gráfico. Os
        outros dois contam as mesmas {total} ocorrências por canal de entrada e
        por rota de chegada.
      </p>
      <PainelGraficos resumo={resumo} completo />
    </section>
  )
}
