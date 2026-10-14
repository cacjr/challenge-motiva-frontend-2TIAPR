import { formatarData } from '../utils/formatar.js'

export default function CardTrecho({ trecho }) {
  return (
    <article className="linha">
      <div>
        <p className="linha-titulo">
          {trecho.rodovia} · {trecho.referencia}
        </p>
        <p className="linha-meta">
          km {trecho.kmInicial} ao km {trecho.kmFinal} · {trecho.cobertura}
        </p>
      </div>
      <div>
        <p className={trecho.atencao ? 'linha-alerta' : 'linha-situacao'}>
          {trecho.situacao}
        </p>
        <p className="linha-meta">Silêncio médio: {trecho.silencioMedioMin} min</p>
      </div>
      <p className="linha-meta">{formatarData(trecho.atualizadoEm)}</p>
    </article>
  )
}
