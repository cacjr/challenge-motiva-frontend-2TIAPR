import CardInteracao from '../components/CardInteracao.jsx'
import { rotuloIntencao } from '../nlu/agente.js'
import { formatarData } from '../utils/formatar.js'

export default function Interacoes({ interacoes, log }) {
  return (
    <section>
      <h2>Interações</h2>

      <h3 className="etapa">Ao vivo · últimas falas ao Elo</h3>
      <p className="intro">
        Cada frase dita ou digitada para o Elo, com a intenção que o NLU entendeu e
        a resposta. Fica salva no navegador junto com as ocorrências (últimas 20).
      </p>
      {log.length === 0 ? (
        <p className="vazio">Ninguém falou com o Elo ainda. Use a tela Falar com o Elo.</p>
      ) : (
        <ul className="lista">
          {log.map((l, i) => (
            <li key={`${l.em}-${i}`}>
              <article className="linha linha-interacao">
                <div>
                  <p className="linha-kicker">{rotuloIntencao(l.intencao)}</p>
                  <p className="linha-titulo">{l.texto}</p>
                  <p className="linha-meta">{formatarData(l.em)}</p>
                </div>
                <p className="linha-resposta">{l.fala}</p>
              </article>
            </li>
          ))}
        </ul>
      )}

      <h3 className="etapa">Histórico simulado da Sprint 1</h3>
      <p className="intro">
        O que o colaborador teria falado ao Elo antes de o agente existir, incluindo
        o plano B (botão no colete e homem caído). Texto fixo, mantido como referência.
      </p>
      <ul className="lista">
        {interacoes.map((interacao) => (
          <li key={interacao.id}>
            <CardInteracao interacao={interacao} />
          </li>
        ))}
      </ul>
    </section>
  )
}
