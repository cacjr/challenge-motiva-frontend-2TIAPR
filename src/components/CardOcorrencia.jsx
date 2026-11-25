import Selo from './Selo.jsx'
import { STATUS, rotuloCanal, rotuloTipo } from '../data/dominio.js'
import { formatarData, formatarHora, formatarKm } from '../utils/formatar.js'
import { minutosDeSilencio } from '../utils/ocorrencias.js'

// Uma ocorrência. O status é atualizado pelo select, que avisa o pai (onStatus).
export default function CardOcorrencia({ ocorrencia: o, onStatus }) {
  const silencio = minutosDeSilencio(o)
  return (
    <article className={`ocorrencia ocorrencia-${o.status}`}>
      <div className="ocorrencia-topo">
        <p className="ocorrencia-titulo">
          <strong>{rotuloTipo(o.tipo)}</strong>
          {o.km !== null && <span> · km {formatarKm(o.km)}</span>}
        </p>
        <Selo tipo="gravidade" valor={o.gravidade} />
      </div>

      <p className="ocorrencia-desc">{o.descricao}</p>

      <p className="ocorrencia-meta">
        <span>Fato: {formatarData(o.horaFato)}</span>
        <span>Registro: {formatarData(o.registradoEm)}</span>
        <span className={silencio > 10 ? 'silencio-alto' : ''}>Silêncio: {silencio} min</span>
        <span>{rotuloCanal(o.canal)} → {o.rota}</span>
      </p>

      <div className="ocorrencia-rodape">
        <code className="chamado-codigo">{o.codigo}</code>
        <label className="campo-inline">
          <span>Status</span>
          <select
            className={`seletor mini status-${o.status}`}
            value={o.status}
            onChange={(e) => onStatus(o.id, e.target.value)}
          >
            {STATUS.map((s) => <option key={s.id} value={s.id}>{s.rotulo}</option>)}
          </select>
        </label>
      </div>

      <details className="ocorrencia-historico">
        <summary>Histórico ({o.historico.length})</summary>
        <ol className="historico">
          {o.historico.map((h, i) => (
            <li key={`${h.em}-${i}`}><time dateTime={h.em}>{formatarHora(h.em)}</time> {h.evento}</li>
          ))}
        </ol>
      </details>
    </article>
  )
}
