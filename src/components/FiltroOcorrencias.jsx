import { GRAVIDADES, STATUS, TIPOS } from '../data/dominio.js'
import { FILTRO_VAZIO } from '../utils/ocorrencias.js'

// Filtro controlado: o valor mora na página (filtro) e cada select avisa onFiltro.
export default function FiltroOcorrencias({ filtro, onFiltro, total, visiveis }) {
  const mudar = (campo) => (e) => onFiltro({ ...filtro, [campo]: e.target.value })
  const ativo = filtro.gravidade || filtro.tipo || filtro.status

  return (
    <div className="filtro" role="search" aria-label="Filtrar ocorrências do trecho">
      <label className="campo-inline">
        <span>Gravidade</span>
        <select className="seletor mini" value={filtro.gravidade} onChange={mudar('gravidade')}>
          <option value="">Todas</option>
          {GRAVIDADES.map((g) => <option key={g.id} value={g.id}>{g.rotulo}</option>)}
        </select>
      </label>
      <label className="campo-inline">
        <span>Tipo</span>
        <select className="seletor mini" value={filtro.tipo} onChange={mudar('tipo')}>
          <option value="">Todos</option>
          {TIPOS.map((t) => <option key={t.id} value={t.id}>{t.rotulo}</option>)}
        </select>
      </label>
      <label className="campo-inline">
        <span>Status</span>
        <select className="seletor mini" value={filtro.status} onChange={mudar('status')}>
          <option value="">Todos</option>
          {STATUS.map((s) => <option key={s.id} value={s.id}>{s.rotulo}</option>)}
        </select>
      </label>
      <p className="filtro-conta" aria-live="polite">
        {visiveis} de {total}
        {ativo && (
          <button type="button" className="limpar-filtro" onClick={() => onFiltro(FILTRO_VAZIO)}>
            Limpar filtro
          </button>
        )}
      </p>
    </div>
  )
}
