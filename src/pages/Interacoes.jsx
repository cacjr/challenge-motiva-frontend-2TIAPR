import CardInteracao from '../components/CardInteracao.jsx'

export default function Interacoes({ interacoes }) {
  return (
    <section>
      <h2>Interações</h2>
      <p className="intro">
        Histórico simulado do que o colaborador teria falado ao Elo, o agente
        de voz. Cada item mostra o comando, a resposta do Elo, o Código Elo
        gerado, por onde ele chegou e quantos minutos a central ficou sem
        saber. Os itens marcados como plano B mostram o que acontece quando a
        voz não dá. Ninguém está ouvindo o microfone: a resposta é texto fixo.
      </p>

      {interacoes.length === 0 ? (
        <p className="vazio">Nenhuma interação simulada.</p>
      ) : (
        <ul className="lista">
          {interacoes.map((interacao) => (
            <li key={interacao.id}>
              <CardInteracao interacao={interacao} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
