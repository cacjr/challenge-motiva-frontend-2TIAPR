import { useEffect, useMemo, useState } from 'react'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Trechos from './pages/Trechos.jsx'
import Ocorrencias from './pages/Ocorrencias.jsx'
import Interacoes from './pages/Interacoes.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ComoFunciona from './pages/ComoFunciona.jsx'
import FalarComElo from './pages/FalarComElo.jsx'
import Encaminhamentos from './pages/Encaminhamentos.jsx'
import { interacoes } from './data/interacoes.js'
import { plataforma } from './data/plataforma.js'
import {
  autopreenchimento,
  cascata,
  codigoElo,
  comandosVoz,
  planoB,
  principios,
} from './data/comoFunciona.js'
import { CHAVE, estadoExemplo, estadoVazio, lerEstado, salvarEstado } from './utils/persistencia.js'
import { criarOcorrencia, gerarId, mudarStatus } from './utils/ocorrencias.js'
import { mudarEncaminhamento, pendentesDeEncaminhar } from './utils/encaminhamento.js'
import { calcularResumo } from './utils/indicadores.js'
import './App.css'

const conteudoComoFunciona = { comandosVoz, planoB, autopreenchimento, codigoElo, cascata, principios }

const TITULOS = {
  inicio: '',
  elo: 'Falar com o Elo',
  trechos: 'Trechos',
  ocorrencias: 'Ocorrências',
  dashboard: 'Dashboard',
  encaminhar: 'Encaminhamentos',
  interacoes: 'Interações',
  sobre: 'Como funciona',
}

export default function App() {
  const [pagina, setPagina] = useState('inicio')

  // O App é o dono do estado. Lê o localStorage UMA vez, na criação do estado
  // (não começa vazio para depois gravar o vazio por cima do que estava salvo).
  const [inicial] = useState(lerEstado)
  const [trechos, setTrechos] = useState(inicial.trechos)
  const [trechoAtualId, setTrechoAtualId] = useState(inicial.trechoAtualId)
  const [ocorrencias, setOcorrencias] = useState(inicial.ocorrencias)
  // Agente de voz: contador e log persistem; o rascunho aguardando "confirmo", não.
  const [elo, setElo] = useState({ ...inicial.elo, pendente: null })

  // Grava o objeto inteiro a cada mudança. F5 lê de volta em lerEstado.
  useEffect(() => {
    salvarEstado({ trechos, trechoAtualId, ocorrencias, elo: { comandos: elo.comandos, log: elo.log } })
  }, [trechos, trechoAtualId, ocorrencias, elo])

  useEffect(() => {
    document.title = TITULOS[pagina] ? `${TITULOS[pagina]} | ${plataforma.marca}` : plataforma.marca
  }, [pagina])

  const trechoAtual = trechos.find((t) => t.id === trechoAtualId) ?? null
  const resumo = useMemo(() => calcularResumo(trechos, ocorrencias), [trechos, ocorrencias])

  // ---- trechos
  const cadastrarTrecho = (dados) => {
    const novo = { id: gerarId('t'), ...dados }
    setTrechos((atuais) => [...atuais, novo].sort((a, b) => a.rodovia.localeCompare(b.rodovia) || a.kmInicial - b.kmInicial))
    if (!trechoAtualId) setTrechoAtualId(novo.id)
  }

  const removerTrecho = (id) => {
    if (ocorrencias.some((o) => o.trechoId === id)) return
    setTrechos((atuais) => atuais.filter((t) => t.id !== id))
    if (trechoAtualId === id) setTrechoAtualId(null)
  }

  const abrirTrecho = (id) => {
    setTrechoAtualId(id)
    setPagina('ocorrencias')
  }

  // ---- ocorrências: o App carimba trechoId, data/hora e status inicial
  const registrarOcorrencia = (dados) => {
    if (!trechoAtual) return
    setOcorrencias((atuais) => [criarOcorrencia(dados, trechoAtual), ...atuais])
  }

  const atualizarStatus = (id, status) => {
    setOcorrencias((atuais) => atuais.map((o) => (o.id === id ? mudarStatus(o, status) : o)))
  }

  const encaminhar = (id, setor, estado) => {
    setOcorrencias((atuais) => atuais.map((o) => (o.id === id ? mudarEncaminhamento(o, setor, estado) : o)))
  }

  // ---- agente de voz: devolve as ocorrências já atualizadas e o novo log
  const estadoAgente = { trechos, trechoAtualId, ocorrencias, ...elo }
  const aplicarAgente = (m) => {
    setOcorrencias(m.ocorrencias)
    setElo({ pendente: m.pendente, comandos: m.comandos, log: m.log })
  }

  // ---- dados de demonstração
  const carregar = (estado) => {
    setTrechos(estado.trechos)
    setTrechoAtualId(estado.trechoAtualId)
    setOcorrencias(estado.ocorrencias)
    setElo({ ...estado.elo, pendente: null })
  }
  const restaurarExemplo = () => {
    if (window.confirm('Substituir todos os trechos e ocorrências pelos dados de exemplo da BR-163/MS?')) carregar(estadoExemplo())
  }
  const comecarDoZero = () => {
    if (window.confirm('Apagar todos os trechos e ocorrências salvos neste navegador? Não dá para desfazer.')) carregar(estadoVazio())
  }

  // Duas abas abertas ficam iguais: quando uma grava no localStorage,
  // a outra recebe o evento "storage" e recarrega o estado salvo.
  useEffect(() => {
    const aoMudarEmOutraAba = (evento) => {
      if (evento.key === CHAVE && evento.newValue) carregar(lerEstado())
    }
    window.addEventListener('storage', aoMudarEmOutraAba)
    return () => window.removeEventListener('storage', aoMudarEmOutraAba)
  }, [])

  return (
    <Layout
      plataforma={plataforma}
      paginaAtual={pagina}
      onNavegar={setPagina}
      alertas={pendentesDeEncaminhar(ocorrencias).length}
    >
      {pagina === 'inicio' && (
        <Home
          plataforma={plataforma}
          trechos={trechos}
          ocorrencias={ocorrencias}
          trechoAtual={trechoAtual}
          resumo={resumo}
          onNavegar={setPagina}
          onAbrirTrecho={abrirTrecho}
        />
      )}
      {pagina === 'elo' && (
        <FalarComElo estado={estadoAgente} onAgente={aplicarAgente} onNavegar={setPagina} />
      )}
      {pagina === 'trechos' && (
        <Trechos
          trechos={trechos}
          ocorrencias={ocorrencias}
          trechoAtualId={trechoAtualId}
          onCadastrar={cadastrarTrecho}
          onSelecionar={setTrechoAtualId}
          onRemover={removerTrecho}
          onAbrir={abrirTrecho}
          onRestaurar={restaurarExemplo}
          onZerar={comecarDoZero}
        />
      )}
      {pagina === 'ocorrencias' && (
        <Ocorrencias
          trechos={trechos}
          trechoAtualId={trechoAtualId}
          ocorrencias={ocorrencias}
          onSelecionar={setTrechoAtualId}
          onRegistrar={registrarOcorrencia}
          onStatus={atualizarStatus}
          onNavegar={setPagina}
        />
      )}
      {pagina === 'encaminhar' && (
        <Encaminhamentos trechos={trechos} ocorrencias={ocorrencias} onEncaminhar={encaminhar} onNavegar={setPagina} />
      )}
      {pagina === 'interacoes' && <Interacoes interacoes={interacoes} log={elo.log} />}
      {pagina === 'dashboard' && (
        <Dashboard
          resumo={resumo}
          trechos={trechos}
          ocorrencias={ocorrencias}
          interacoes={interacoes}
          estadoAgente={estadoAgente}
          onAgente={aplicarAgente}
          onNavegar={setPagina}
        />
      )}
      {pagina === 'sobre' && <ComoFunciona conteudo={conteudoComoFunciona} />}
    </Layout>
  )
}
