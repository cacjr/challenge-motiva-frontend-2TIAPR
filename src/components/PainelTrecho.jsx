import Icone from './Icone.jsx'
import { LIMITE_ALERTA } from '../utils/analisarTrecho.js'

// Só desenha. O cálculo vem pronto de analisarTrecho (src/utils/), pelo pai.
export default function PainelTrecho({ trecho, resumo }) {
  return (
    <section className="painel-trecho" aria-labelledby="painel-trecho-titulo">
      <h3 id="painel-trecho-titulo">
        Painel do trecho <span className="subtitulo">{trecho.referencia || trecho.rodovia}</span>
      </h3>

      {resumo.alerta && (
        <p className="alerta-trecho" role="alert">
          <Icone nome="alerta" tamanho={20} />
          {resumo.mensagemAlerta}
        </p>
      )}

      <dl className="painel-numeros">
        <div>
          <dt>Total</dt>
          <dd>{resumo.total}</dd>
        </div>
        <div className={resumo.graves > 0 ? 'num-grave' : ''}>
          <dt>Gravidade alta</dt>
          <dd>{resumo.graves}</dd>
        </div>
        <div>
          <dt>Em aberto</dt>
          <dd>{resumo.abertas}</dd>
        </div>
        <div className="num-texto">
          <dt>Tipo mais frequente</dt>
          <dd>{resumo.tipoFrequente}</dd>
        </div>
        <div className={resumo.silencioMedio > 10 ? 'num-grave' : ''}>
          <dt>Silêncio médio</dt>
          <dd>{resumo.silencioMedio} <small>min</small></dd>
        </div>
      </dl>
      <p className="painel-regra">
        Alerta quando {LIMITE_ALERTA} ou mais ocorrências de gravidade alta ainda não foram resolvidas.
      </p>
    </section>
  )
}
