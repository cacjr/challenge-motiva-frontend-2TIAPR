import { formatarData } from '../utils/formatar.js'

const nomesCanal = {
  voz: 'Comando de voz · simulado',
  botao: 'Plano B: botão no colete · simulado',
  toque: 'Plano B: toque em 3 telas · simulado',
  automatico: 'Plano B: homem caído automático · simulado',
}

export default function CardInteracao({ interacao }) {
  return (
    <article className="linha linha-interacao">
      <div>
        <p className="linha-kicker">{nomesCanal[interacao.canal] ?? 'Comando simulado'}</p>
        <p className="linha-titulo">{interacao.texto}</p>
        <p className="linha-meta">{formatarData(interacao.data)}</p>
      </div>
      <div>
        <p className="linha-resposta">{interacao.resposta}</p>
        <p className="linha-codigo">
          <code>{interacao.codigo}</code>
          <span>
            {interacao.rota} · silêncio {interacao.silencioMin} min
          </span>
        </p>
      </div>
    </article>
  )
}
