import { Bar, Doughnut } from 'react-chartjs-2'
import Icone from '../components/Icone.jsx'
import AcaoRapida from '../components/AcaoRapida.jsx'
import { registrarCharts } from '../utils/charts.js'
import { coresPorLimite, descreverSerie, formatarHora, somar } from '../utils/formatar.js'
import { cores } from '../utils/cores.js'

registrarCharts()

const EIXOS = {
  x: { grid: { display: false }, ticks: { color: '#3B3C44', font: { size: 13 } } },
  y: {
    beginAtZero: true,
    ticks: { precision: 0, color: '#6B6B8A' },
    grid: { color: '#E6E5F3' },
    border: { display: false },
  },
}

function Barras({ labels, valores, cor, titulo, unidade = '', eixoY }) {
  const dados = {
    labels,
    datasets: [{ data: valores, backgroundColor: cor, borderRadius: 4, maxBarThickness: 86 }],
  }
  const y = eixoY ? { ...EIXOS.y, title: { display: true, text: eixoY, color: '#6B6B8A' } } : EIXOS.y
  return (
    <Bar
      data={dados}
      options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { ...EIXOS, y } }}
      role="img"
      aria-label={`${titulo}. ${descreverSerie(labels, valores, unidade)}`}
    />
  )
}

const CORES_ROTA = [cores.indigo, cores.azul, cores.ambar, cores.lavanda]

function Rosca({ rota }) {
  const total = somar(rota.valores)
  return (
    <div className="rosca">
      <div className="rosca-area">
        <Doughnut
          data={{ labels: rota.labels, datasets: [{ data: rota.valores, backgroundColor: CORES_ROTA, borderWidth: 0 }] }}
          options={{ responsive: true, maintainAspectRatio: false, cutout: '58%', plugins: { legend: { display: false } } }}
          role="img"
          aria-label={`${rota.titulo}. ${descreverSerie(rota.labels, rota.valores)}`}
        />
        <p className="rosca-centro"><strong>{total}</strong><span>registros</span></p>
      </div>
      <table className="legenda">
        <caption className="sr-only">{rota.titulo}</caption>
        <tbody>
          {rota.labels.map((l, i) => (
            <tr key={l}>
              <th scope="row"><span className="legenda-cor" style={{ background: CORES_ROTA[i] }} />{l}</th>
              <td>{(total ? (rota.valores[i] / total) * 100 : 0).toFixed(1).replace('.', ',')}%</td>
              <td>({rota.valores[i]})</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const ICONE_GAUGE = { dentro15: 'relogio', silencioMedio: 'relogio', resolvidas: 'ok', voz: 'mic' }

function Medidor({ item }) {
  return (
    <figure className="medidor">
      <div className="medidor-arco">
        <Doughnut
          data={{ datasets: [{ data: [item.valor, Math.max(item.maximo - item.valor, 0)], backgroundColor: [item.cor, '#E6E5F3'], borderWidth: 0 }] }}
          options={{ responsive: true, maintainAspectRatio: false, rotation: -90, circumference: 180, cutout: '72%', plugins: { legend: { display: false }, tooltip: { enabled: false } } }}
          aria-hidden="true"
        />
        <p className="medidor-valor">{item.valor}<span aria-hidden="true">/{item.maximo}</span><span className="sr-only"> de {item.maximo}</span></p>
      </div>
      <figcaption>
        <span className="medidor-icone"><Icone nome={ICONE_GAUGE[item.id] ?? 'grafico'} /></span>
        <span><strong>{item.titulo}</strong><small>{item.detalhe}</small></span>
      </figcaption>
    </figure>
  )
}

function quando(iso) {
  const d = new Date(iso)
  const dois = (n) => String(n).padStart(2, '0')
  return `${dois(d.getDate())}/${dois(d.getMonth() + 1)}, ${dois(d.getHours())}:${dois(d.getMinutes())}`
}

function InteracoesRecentes({ interacoes, log, onNavegar }) {
  const aoVivo = log.map((l, i) => ({ id: `v${i}`, voz: true, texto: l.texto, resposta: l.fala, quando: `ao vivo, ${formatarHora(l.em)}`, vivo: true }))
  const fixas = [...interacoes]
    .sort((a, b) => b.data.localeCompare(a.data))
    .map((i) => ({ id: i.id, voz: i.canal === 'voz', texto: i.texto, resposta: i.resposta, quando: quando(i.data) }))
  const lista = [...aoVivo, ...fixas].slice(0, 5)
  return (
    <section className="lado-cartao" aria-labelledby="recentes">
      <div className="lado-titulo lado-titulo-linha">
        <Icone nome="balao" />
        <h3 id="recentes">Interações recentes</h3>
        <button type="button" className="ver-todas" onClick={() => onNavegar('interacoes')}>
          Ver todas <Icone nome="seta" tamanho={14} />
        </button>
      </div>
      <ul className="recentes">
        {lista.map((i) => (
          <li key={i.id}>
            <span className={`recente-icone ${i.voz ? '' : 'recente-alerta'}`}>
              <Icone nome={i.voz ? 'mic' : 'alerta'} tamanho={18} />
            </span>
            <div className="recente-corpo">
              <p className="recente-texto">{i.texto}</p>
              <p className="recente-resposta">{i.resposta}</p>
            </div>
            <time className={i.vivo ? 'recente-vivo' : ''}>{i.quando}</time>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Dashboard({ resumo, trechos, ocorrencias, interacoes, estadoAgente, onAgente, onNavegar }) {
  const { mapaSilencio, ocorrenciasPorEntrada, ocorrenciasPorRota, velocimetros } = resumo
  const emSombra = trechos.filter((t) => t.cobertura !== 'sinal').length
  const kpis = [
    { rotulo: 'Trechos monitorados', valor: trechos.length, icone: 'estrada', classe: 'kpi-navy' },
    { rotulo: 'Zonas de sombra', valor: emSombra, icone: 'alerta', classe: 'kpi-ambar' },
    { rotulo: 'Ocorrências em aberto', valor: ocorrencias.filter((o) => o.status !== 'resolvida').length, icone: 'camadas', classe: 'kpi-teal' },
    { rotulo: 'Comandos ao Elo', valor: estadoAgente.comandos, icone: 'mic', classe: 'kpi-ceu' },
  ]
  const coresMapa = coresPorLimite(mapaSilencio.valores, mapaSilencio.limiteMin, cores.indigo, '#FF682C')
  const [tituloMapa, subtituloMapa] = mapaSilencio.titulo.split(' · ')

  return (
    <div className="dash">
      <h2 className="sr-only">Dashboard</h2>
      <div className="dash-principal">
        <dl className="kpis">
          {kpis.map((k) => (
            <div key={k.rotulo} className={`kpi ${k.classe}`}>
              <span className="kpi-icone"><Icone nome={k.icone} tamanho={24} /></span>
              <div>
                <dt>{k.rotulo}</dt>
                <dd>{k.valor}</dd>
              </div>
            </div>
          ))}
        </dl>

        <section className="dcartao" aria-labelledby="mapa">
          <div className="dcartao-topo">
            <h3 id="mapa" title={mapaSilencio.leitura}>
              {tituloMapa} <span className="subtitulo">– {subtituloMapa}</span>{' '}
              <Icone nome="info" tamanho={17} className="icone-info" />
            </h3>
            <label className="sr-only" htmlFor="malha">Malha</label>
            <select id="malha" className="seletor" defaultValue="br163">
              <option value="br163">BR-163/MS · Motiva Pantanal</option>
            </select>
          </div>
          <div className="area-mapa">
            <Barras labels={mapaSilencio.labels} valores={mapaSilencio.valores} cor={coresMapa} titulo={tituloMapa} unidade=" min" eixoY="Minutos" />
          </div>
        </section>

        <div className="dash-dupla">
          <section className="dcartao" aria-labelledby="entrada">
            <h3 id="entrada" title={ocorrenciasPorEntrada.leitura}>
              Como o registro começou <Icone nome="info" tamanho={17} className="icone-info" />
            </h3>
            <div className="area-media">
              <Barras labels={ocorrenciasPorEntrada.labels} valores={ocorrenciasPorEntrada.valores} cor={cores.azul} titulo="Como o registro começou" />
            </div>
          </section>
          <section className="dcartao" aria-labelledby="rota">
            <h3 id="rota" title={ocorrenciasPorRota.leitura}>
              Por onde o registro chegou à central <Icone nome="info" tamanho={17} className="icone-info" />
            </h3>
            <Rosca rota={ocorrenciasPorRota} />
          </section>
        </div>

        <div className="medidores">
          {velocimetros.map((v) => <Medidor key={v.id} item={v} />)}
        </div>
      </div>

      <aside className="dash-lado">
        <AcaoRapida estado={estadoAgente} onAgente={onAgente} />
        <InteracoesRecentes interacoes={interacoes} log={estadoAgente.log} onNavegar={onNavegar} />
      </aside>
    </div>
  )
}
