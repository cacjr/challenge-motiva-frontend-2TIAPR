import CardTrecho from '../components/CardTrecho.jsx'

export default function Consultas({ trechos }) {
  // TODO Sprint 2: a consulta deixa de ser só esta lista fixa.
  // O colaborador escolhe o trecho atual e vê as ocorrências daquele trecho,
  // com filtro.
  return (
    <section>
      <h2>Consultas</h2>
      <p className="intro">
        Trechos da BR-163/MS. Cada um mostra a cobertura de celular, a situação
        de atenção e o silêncio médio: quantos minutos, em média, a central leva
        para saber de um fato ali. Nesta sprint a lista vem de um array fixo.
        Nada é cadastrado.
      </p>

      {trechos.length === 0 ? (
        <p className="vazio">Nenhum trecho para consultar.</p>
      ) : (
        <ul className="lista">
          {trechos.map((trecho) => (
            <li key={trecho.id}>
              <CardTrecho trecho={trecho} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
