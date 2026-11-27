// Autor: Gustavo Duarte (GustavoduarteAI) · formulários de trecho e ocorrência e telas Trechos e Ocorrências
import { useState } from 'react'
import PainelTrecho from '../components/PainelTrecho.jsx'
import FormOcorrencia from '../components/FormOcorrencia.jsx'
import ListaOcorrencias from '../components/ListaOcorrencias.jsx'
import FiltroOcorrencias from '../components/FiltroOcorrencias.jsx'
import { analisarTrecho } from '../utils/analisarTrecho.js'
import { FILTRO_VAZIO, filtrarOcorrencias, ordenarRecentes } from '../utils/ocorrencias.js'

export default function Ocorrencias({
  trechos, trechoAtualId, ocorrencias, onSelecionar, onRegistrar, onStatus, onNavegar,
}) {
  // O filtro é só da tela: não precisa sobreviver ao F5, então não vai para o App.
  const [filtro, setFiltro] = useState(FILTRO_VAZIO)
  const trecho = trechos.find((t) => t.id === trechoAtualId)

  const trocarTrecho = (id) => {
    onSelecionar(id || null)
    setFiltro(FILTRO_VAZIO)
  }

  const seletor = (
    <label className="campo-inline seletor-trecho">
      <span>Trecho atual</span>
      <select className="seletor" value={trechoAtualId ?? ''} onChange={(e) => trocarTrecho(e.target.value)}>
        <option value="">Escolha um trecho…</option>
        {trechos.map((t) => (
          <option key={t.id} value={t.id}>
            {t.rodovia} · km {t.kmInicial}–{t.kmFinal}{t.referencia ? ` · ${t.referencia}` : ''}
          </option>
        ))}
      </select>
    </label>
  )

  if (!trecho) {
    return (
      <section>
        <h2>Ocorrências</h2>
        <div className="form-cartao vazio-trecho">
          {trechos.length === 0 ? (
            <>
              <p>Nenhum trecho cadastrado ainda. Toda ocorrência pertence a um trecho.</p>
              <button type="button" className="link-acao" onClick={() => onNavegar('trechos')}>Cadastrar um trecho</button>
            </>
          ) : (
            <>
              <p>Escolha o trecho para ver e registrar as ocorrências dele.</p>
              {seletor}
            </>
          )}
        </div>
      </section>
    )
  }

  // Isolamento: só as ocorrências carimbadas com o trecho atual.
  const doTrecho = ordenarRecentes(ocorrencias.filter((o) => o.trechoId === trecho.id))
  const visiveis = filtrarOcorrencias(doTrecho, filtro)
  const resumo = analisarTrecho(doTrecho)

  return (
    <section className="tela-ocorrencias">
      <div className="tela-cabeca">
        <div>
          <h2>Ocorrências</h2>
          <p className="intro">Do trecho selecionado. Registre pelo formulário ou fale com o Elo.</p>
        </div>
        {seletor}
      </div>

      <PainelTrecho trecho={trecho} resumo={resumo} />

      <div className="duas-colunas colunas-ocorrencias">
        <FormOcorrencia key={trecho.id} trecho={trecho} onRegistrar={onRegistrar} />
        <div>
          <h3 className="lista-titulo">Histórico do trecho</h3>
          <FiltroOcorrencias filtro={filtro} onFiltro={setFiltro} total={doTrecho.length} visiveis={visiveis.length} />
          <ListaOcorrencias ocorrencias={visiveis} semNada={doTrecho.length === 0} onStatus={onStatus} />
        </div>
      </div>
    </section>
  )
}
