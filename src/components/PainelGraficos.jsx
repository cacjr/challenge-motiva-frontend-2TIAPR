import GraficoBarras from './GraficoBarras.jsx'
import GraficoPizza from './GraficoPizza.jsx'
import GraficoGauge from './GraficoGauge.jsx'
import { coresPorLimite } from '../utils/formatar.js'

// Recebe o resumo por prop. Quem importa src/data/resumoDashboard.js é o App.
// completo = false (Início): barras de entrada, pizza e velocímetros.
// completo = true (Dashboard): acrescenta o Mapa do Silêncio em destaque
// e a leitura de cada gráfico.
export default function PainelGraficos({ resumo, completo = false }) {
  const { mapaSilencio, ocorrenciasPorEntrada, ocorrenciasPorRota, velocimetros } = resumo

  const coresMapa = coresPorLimite(
    mapaSilencio.valores,
    mapaSilencio.limiteMin,
    '#1f2366',
    '#c26a12',
  )

  return (
    <div className="grade-graficos">
      {completo && (
        <GraficoBarras
          titulo={mapaSilencio.titulo}
          labels={mapaSilencio.labels}
          valores={mapaSilencio.valores}
          cor={coresMapa}
          rotuloValor="Minutos de silêncio"
          leitura={mapaSilencio.leitura}
          largo
          unidade=" min"
        />
      )}
      <GraficoBarras
        titulo={ocorrenciasPorEntrada.titulo}
        labels={ocorrenciasPorEntrada.labels}
        valores={ocorrenciasPorEntrada.valores}
        cor="#3f4bb8"
        leitura={completo ? ocorrenciasPorEntrada.leitura : undefined}
      />
      <GraficoPizza
        titulo={ocorrenciasPorRota.titulo}
        labels={ocorrenciasPorRota.labels}
        valores={ocorrenciasPorRota.valores}
        leitura={completo ? ocorrenciasPorRota.leitura : undefined}
      />
      <div className="faixa-gauges">
        {velocimetros.map((item) => (
          <GraficoGauge
            key={item.id}
            titulo={item.titulo}
            valor={item.valor}
            maximo={item.maximo}
            detalhe={item.detalhe}
            cor={item.cor}
          />
        ))}
      </div>
    </div>
  )
}
