import GraficoBarras from './GraficoBarras.jsx'
import GraficoPizza from './GraficoPizza.jsx'
import GraficoGauge from './GraficoGauge.jsx'
import { cores } from '../utils/cores.js'

// Cores da gravidade: as mesmas do Selo (baixa, média, alta).
const CORES_GRAVIDADE = ['#0b8a5a', '#d18b00', '#dd511a']

// Painel do Início. Recebe o resumo já calculado pelo App (utils/indicadores.js)
// a partir das ocorrências do estado.
export default function PainelGraficos({ resumo }) {
  const { porTipo, porGravidade, velocimetros } = resumo

  return (
    <div className="grade-graficos">
      <GraficoBarras
        titulo={porTipo.titulo}
        labels={porTipo.labels}
        valores={porTipo.valores}
        cor={cores.azul}
      />
      <GraficoPizza
        titulo={porGravidade.titulo}
        labels={porGravidade.labels}
        valores={porGravidade.valores}
        paleta={CORES_GRAVIDADE}
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
