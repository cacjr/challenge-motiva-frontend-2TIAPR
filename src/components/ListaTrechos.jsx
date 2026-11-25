import { COBERTURAS } from '../data/dominio.js'
import { analisarTrecho } from '../utils/analisarTrecho.js'

const rotuloCobertura = Object.fromEntries(COBERTURAS.map((c) => [c.id, c.rotulo]))

// Lista de trechos. O clique avisa o pai (onSelecionar); quem guarda o
// trechoAtualId é o App. Só dá para remover trecho sem ocorrências.
export default function ListaTrechos({ trechos, ocorrencias, trechoAtualId, onSelecionar, onAbrir, onRemover }) {
  if (trechos.length === 0) {
    return <p className="vazio">Nenhum trecho cadastrado. Use o formulário ao lado para criar o primeiro.</p>
  }

  return (
    <ul className="lista-trechos">
      {trechos.map((trecho) => {
        const resumo = analisarTrecho(ocorrencias.filter((o) => o.trechoId === trecho.id))
        const atual = trecho.id === trechoAtualId
        return (
          <li key={trecho.id} className={`trecho-item ${atual ? 'atual' : ''}`}>
            <div className="trecho-info">
              <p className="trecho-nome">
                <strong>{trecho.rodovia} · km {trecho.kmInicial}–{trecho.kmFinal}</strong>
                {atual && <span className="selo selo-atual">Trecho atual</span>}
                {resumo.alerta && <span className="selo selo-gravidade-alta">Alerta</span>}
              </p>
              <p className="trecho-meta">
                {trecho.referencia || 'Sem referência'} · <span className={`cob cob-${trecho.cobertura.replace(' ', '-')}`}>{rotuloCobertura[trecho.cobertura]}</span>
              </p>
              <p className="trecho-numeros">
                {resumo.total} ocorrência{resumo.total === 1 ? '' : 's'} · {resumo.abertas} em aberto · {resumo.gravesAbertas} grave{resumo.gravesAbertas === 1 ? '' : 's'} em aberto
              </p>
            </div>
            <div className="trecho-acoes">
              {!atual && (
                <button type="button" className="link-acao secundario mini" onClick={() => onSelecionar(trecho.id)}>
                  Selecionar
                </button>
              )}
              <button type="button" className="link-acao mini" onClick={() => onAbrir(trecho.id)}>
                Ver ocorrências
              </button>
              {resumo.total === 0 && (
                <button
                  type="button"
                  className="link-acao secundario mini"
                  onClick={() => onRemover(trecho.id)}
                  aria-label={`Remover trecho ${trecho.rodovia} km ${trecho.kmInicial} a ${trecho.kmFinal}`}
                >
                  Remover
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
