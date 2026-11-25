import { analisarTrecho } from '../utils/analisarTrecho.js'

// Leitura rápida: uma linha por trecho, com os números calculados das
// ocorrências de cada um (mesma função do Painel do trecho).
export default function TabelaTrechos({ trechos, ocorrencias, trechoAtualId, onAbrir }) {
  return (
    <div className="leitura">
      <h3>Leitura rápida dos trechos</h3>
      {trechos.length === 0 ? (
        <p className="vazio">Nenhum trecho cadastrado.</p>
      ) : (
        <div className="tabela-rolagem">
          <table className="tabela">
            <caption className="sr-only">
              Trechos com cobertura, ocorrências, graves em aberto, tipo mais frequente e silêncio médio
            </caption>
            <thead>
              <tr>
                <th scope="col">Trecho</th>
                <th scope="col">Cobertura</th>
                <th scope="col">Ocorrências</th>
                <th scope="col">Graves em aberto</th>
                <th scope="col">Mais frequente</th>
                <th scope="col">Silêncio médio</th>
              </tr>
            </thead>
            <tbody>
              {trechos.map((trecho) => {
                const r = analisarTrecho(ocorrencias.filter((o) => o.trechoId === trecho.id))
                return (
                  <tr key={trecho.id} className={trecho.id === trechoAtualId ? 'linha-atual' : undefined}>
                    <td>
                      <button type="button" className="link-tabela" onClick={() => onAbrir(trecho.id)}>
                        {trecho.rodovia} · km {trecho.kmInicial}–{trecho.kmFinal}
                      </button>
                      <span className="tabela-nome">{trecho.referencia}</span>
                    </td>
                    <td>{trecho.cobertura}</td>
                    <td>{r.total} <span className="tabela-nome">{r.abertas} em aberto</span></td>
                    <td className={r.alerta ? 'celula-atencao' : undefined}>
                      {r.gravesAbertas}{r.alerta && ' · alerta'}
                    </td>
                    <td>{r.tipoFrequente}</td>
                    <td className={r.silencioMedio > 10 ? 'celula-atencao' : undefined}>{r.silencioMedio} min</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
