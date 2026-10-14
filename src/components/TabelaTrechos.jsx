import { formatarData } from '../utils/formatar.js'

export default function TabelaTrechos({ trechos }) {
  return (
    <div className="leitura">
      <h3>Leitura rápida dos trechos</h3>
      {trechos.length === 0 ? (
        <p className="vazio">Nenhum trecho para consultar.</p>
      ) : (
        <div className="tabela-rolagem">
          <table className="tabela">
            <caption className="sr-only">
              Trechos da BR-163/MS com cobertura, situação, silêncio médio e
              data da última atualização
            </caption>
            <thead>
              <tr>
                <th scope="col">Rodovia</th>
                <th scope="col">Trecho</th>
                <th scope="col">Cobertura</th>
                <th scope="col">Situação</th>
                <th scope="col">Silêncio</th>
                <th scope="col">Atualizado</th>
              </tr>
            </thead>
            <tbody>
              {trechos.map((trecho) => (
                <tr key={trecho.id}>
                  <td>
                    {trecho.rodovia}
                    <span className="tabela-nome">{trecho.referencia}</span>
                  </td>
                  <td>
                    km {trecho.kmInicial} ao {trecho.kmFinal}
                  </td>
                  <td>{trecho.cobertura}</td>
                  <td className={trecho.atencao ? 'celula-atencao' : undefined}>
                    {trecho.situacao}
                  </td>
                  <td>{trecho.silencioMedioMin} min</td>
                  <td>{formatarData(trecho.atualizadoEm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
