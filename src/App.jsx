import { useEffect, useState } from 'react'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Consultas from './pages/Consultas.jsx'
import Interacoes from './pages/Interacoes.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ComoFunciona from './pages/ComoFunciona.jsx'
import { trechos as trechosFixos } from './data/trechos.js'
import { interacoes as interacoesFixas } from './data/interacoes.js'
import { plataforma } from './data/plataforma.js'
import {
  mapaSilencio,
  ocorrenciasPorEntrada,
  ocorrenciasPorRota,
  velocimetros,
} from './data/resumoDashboard.js'
import {
  autopreenchimento,
  cascata,
  codigoElo,
  comandosVoz,
  planoB,
  principios,
} from './data/comoFunciona.js'
import './App.css'

// Um dono só: o App importa todos os arrays e repassa por props.
// Nenhuma página ou componente importa de src/data/ sozinho.
const resumo = { mapaSilencio, ocorrenciasPorEntrada, ocorrenciasPorRota, velocimetros }
const conteudoComoFunciona = {
  comandosVoz,
  planoB,
  autopreenchimento,
  codigoElo,
  cascata,
  principios,
}

export default function App() {
  const [pagina, setPagina] = useState('inicio')

  // TODO Sprint 2: os arrays fixos saem daqui e passam a viver no estado.
  // const [trechos, setTrechos] = useState(trechosFixos)
  // const [trechoAtualId, setTrechoAtualId] = useState(null)
  // const [ocorrencias, setOcorrencias] = useState([])
  // Um único objeto no localStorage, lido ao abrir e gravado a cada mudança,
  // para o F5 não apagar nada. Formulário, filtro, status e painel calculado
  // entram junto, na Sprint 2.
  const trechos = trechosFixos
  const interacoes = interacoesFixas

  useEffect(() => {
    const titulos = {
      inicio: plataforma.marca,
      consultas: `Consultas | ${plataforma.marca}`,
      interacoes: `Interações | ${plataforma.marca}`,
      dashboard: `Dashboard | ${plataforma.marca}`,
      sobre: `Como funciona | ${plataforma.marca}`,
    }
    document.title = titulos[pagina] ?? plataforma.marca
  }, [pagina])

  return (
    <Layout plataforma={plataforma} paginaAtual={pagina} onNavegar={setPagina}>
      {pagina === 'inicio' && (
        <Home
          plataforma={plataforma}
          trechos={trechos}
          interacoes={interacoes}
          resumo={resumo}
          onNavegar={setPagina}
        />
      )}
      {pagina === 'consultas' && <Consultas trechos={trechos} />}
      {pagina === 'interacoes' && <Interacoes interacoes={interacoes} />}
      {pagina === 'dashboard' && <Dashboard resumo={resumo} />}
      {pagina === 'sobre' && <ComoFunciona conteudo={conteudoComoFunciona} />}
    </Layout>
  )
}
