import Icone from '../components/Icone.jsx'
import Selo from '../components/Selo.jsx'
import { setores } from '../data/setores.js'
import { rotuloTipo } from '../data/dominio.js'
import { setorPorId } from '../utils/encaminhamento.js'
import { formatarKm } from '../utils/formatar.js'
import { nomeTrecho, ordenarRecentes } from '../utils/ocorrencias.js'

const ROTULO_ESTADO = { sugerido: 'Sugerido', encaminhado: 'Encaminhado', recebido: 'Recebido' }
const titulo = (o) => `${o.km !== null ? `km ${formatarKm(o.km)} · ` : ''}${rotuloTipo(o.tipo)}`

function LinhaOcorrencia({ o, trecho, onEncaminhar }) {
  const lista = o.encaminhamentos.filter((e) => e.estado !== 'descartado')
  const sugeridos = lista.filter((e) => e.estado === 'sugerido')
  const livres = setores.filter((s) => !lista.some((e) => e.setor === s.id))
  const mudar = (setor, estado) => onEncaminhar(o.id, setor, estado)

  return (
    <li className="enc-chamado">
      <div className="enc-info">
        <p className="enc-titulo">
          <strong>{titulo(o)}</strong>
          <Selo tipo="gravidade" valor={o.gravidade} />
          <Selo tipo="status" valor={o.status} />
        </p>
        <p className="chamado-meta">{nomeTrecho(trecho)} · {o.rota}</p>
        <code className="chamado-codigo">{o.codigo}</code>
      </div>

      <div className="enc-setores">
        {lista.map((e) => {
          const s = setorPorId[e.setor]
          return (
            <div key={e.setor} className={`enc-setor enc-${e.estado}`}>
              <span className="enc-sigla">{s.sigla}</span>
              <div className="enc-texto">
                <strong>{s.nome}{s.externo && <small className="externo"> externo</small>}</strong>
                <small>{ROTULO_ESTADO[e.estado]} · {e.motivos.join(', ')}</small>
              </div>
              {e.estado === 'sugerido' && (
                <span className="enc-acoes">
                  <button type="button" className="link-acao mini" onClick={() => mudar(e.setor, 'encaminhado')}>
                    <Icone nome="enviar" tamanho={14} /> Encaminhar
                  </button>
                  <button type="button" className="link-acao secundario mini" aria-label={`Descartar ${s.nome}`} onClick={() => mudar(e.setor, 'descartado')}>
                    ✕
                  </button>
                </span>
              )}
              {e.estado === 'encaminhado' && (
                <button type="button" className="link-acao secundario mini" onClick={() => mudar(e.setor, 'recebido')}>
                  Setor confirmou
                </button>
              )}
              {e.estado === 'recebido' && <span className="enc-ok"><Icone nome="ok" tamanho={18} /></span>}
            </div>
          )
        })}
        <div className="enc-rodape">
          {sugeridos.length > 1 && (
            <button type="button" className="link-acao mini" onClick={() => sugeridos.forEach((e) => mudar(e.setor, 'encaminhado'))}>
              Encaminhar todos os sugeridos
            </button>
          )}
          {livres.length > 0 && (
            <select
              className="seletor mini"
              value=""
              onChange={(ev) => ev.target.value && mudar(ev.target.value, 'encaminhado')}
              aria-label="Encaminhar também para outro setor"
            >
              <option value="">Encaminhar também para…</option>
              {livres.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
            </select>
          )}
        </div>
      </div>
    </li>
  )
}

export default function Encaminhamentos({ trechos, ocorrencias, onEncaminhar, onNavegar }) {
  const trechoDe = (id) => trechos.find((t) => t.id === id)
  // Só as que ainda pedem atenção: resolvidas saem desta fila.
  const emAberto = ordenarRecentes(ocorrencias.filter((o) => o.status !== 'resolvida'))

  const porSetor = setores.map((s) => ({
    ...s,
    itens: emAberto.flatMap((o) => o.encaminhamentos
      .filter((e) => e.setor === s.id && (e.estado === 'encaminhado' || e.estado === 'recebido'))
      .map((e) => ({ o, estado: e.estado }))),
  }))

  return (
    <section className="encaminhar">
      <div className="enc-cabeca">
        <div>
          <h2>Encaminhamentos</h2>
          <p className="lead-curto">
            O Elo sugere o setor pelo tipo da ocorrência, pela gravidade, pelos pedidos do campo e pelas
            condições da via. A central decide. Por voz: “Elo, direcionamento para o guincho”.
          </p>
        </div>
      </div>

      {emAberto.length === 0 ? (
        <div className="dcartao vazio-enc">
          <p>Nenhuma ocorrência em aberto para encaminhar.</p>
          <button type="button" className="link-acao" onClick={() => onNavegar('elo')}>Registrar uma ocorrência por voz</button>
        </div>
      ) : (
        <ul className="enc-lista">
          {emAberto.map((o) => <LinhaOcorrencia key={o.id} o={o} trecho={trechoDe(o.trechoId)} onEncaminhar={onEncaminhar} />)}
        </ul>
      )}

      <h3 className="enc-sub">Por setor</h3>
      <div className="setores-grade">
        {porSetor.map((s) => (
          <div key={s.id} className="setor-cartao">
            <p className="setor-cabeca">
              <span className="enc-sigla">{s.sigla}</span>
              <span>
                <strong>{s.nome}</strong>
                {s.externo && <small className="externo"> externo</small>}
              </span>
              <span className="setor-conta">{s.itens.length}</span>
            </p>
            {s.itens.length === 0
              ? <p className="setor-vazio">Sem ocorrências</p>
              : (
                <ul>
                  {s.itens.map(({ o, estado: e }) => (
                    <li key={o.id}>
                      {titulo(o)}
                      <span className={`mini-estado mini-${e}`}>{ROTULO_ESTADO[e]}</span>
                    </li>
                  ))}
                </ul>
              )}
          </div>
        ))}
      </div>
    </section>
  )
}
