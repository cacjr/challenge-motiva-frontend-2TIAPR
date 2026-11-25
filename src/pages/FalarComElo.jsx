import { useState } from 'react'
import Selo from '../components/Selo.jsx'
import { useAgente } from '../hooks/useAgente.js'
import { rotuloIntencao } from '../nlu/agente.js'
import { rotuloGravidade, rotuloTermo, rotuloTipo } from '../data/dominio.js'
import { setorPorId } from '../utils/encaminhamento.js'
import { formatarHora, formatarKm } from '../utils/formatar.js'
import { minutosDeSilencio, nomeTrecho, ordenarRecentes } from '../utils/ocorrencias.js'

const EXEMPLOS = [
  'Elo, colisão no km 688, sentido norte',
  'Confirmo',
  'Preciso de uma ambulância',
  'Cheguei no local',
  'Elo, direcionamento para o guincho',
  'Como está a operação?',
  'Via liberada',
  'Elo, buraco grande no km 471',
]

// Texto normalizado com as entidades marcadas onde o NLU as encontrou.
function TextoMarcado({ texto, entidades }) {
  const partes = []
  let pos = 0
  for (const e of entidades) {
    const [a, b] = e.span
    if (a > pos) partes.push(texto.slice(pos, a))
    partes.push(
      <mark key={a} className={`ent ent-${e.tipo}`} title={`${e.tipo} = ${e.valor}`}>
        {texto.slice(a, b)}
        <span className="ent-tipo">{e.tipo.replace('_', ' ')}</span>
      </mark>,
    )
    pos = b
  }
  if (pos < texto.length) partes.push(texto.slice(pos))
  return <p className="texto-marcado">{partes}</p>
}

function Pontos({ pontos, vencedora }) {
  const lista = Object.entries(pontos).sort((a, b) => b[1] - a[1]).slice(0, 4)
  if (!lista.length) return <p className="pontos-vazio">Nenhuma regra disparou.</p>
  const max = lista[0][1]
  return (
    <ul className="pontos">
      {lista.map(([i, p]) => (
        <li key={i} className={i === vencedora ? 'venceu' : ''}>
          <span className="pontos-nome">{rotuloIntencao(i)}</span>
          <span className="pontos-barra" style={{ '--p': p / max }} aria-hidden="true" />
          <span className="pontos-valor">{p}</span>
        </li>
      ))}
    </ul>
  )
}

function CartaoChamado({ o, trecho }) {
  return (
    <li className={`chamado ${o.status === 'resolvida' ? 'fechado' : ''}`}>
      <div className="chamado-topo">
        <strong>{o.km !== null ? `km ${formatarKm(o.km)} · ` : ''}{rotuloTipo(o.tipo)}</strong>
        <span className="chamado-selos">
          <Selo tipo="gravidade" valor={o.gravidade} />
          <Selo tipo="status" valor={o.status} />
        </span>
      </div>
      <p className="chamado-meta">
        {nomeTrecho(trecho)} · {trecho?.cobertura ?? '—'} → {o.rota} · silêncio {minutosDeSilencio(o)} min
      </p>
      <code className="chamado-codigo">{o.codigo}</code>
      {(o.recursos.length > 0 || o.condicoes.length > 0) && (
        <p className="chamado-tags">
          {o.recursos.map((r, i) => <span key={`r${i}`} className="tag">{rotuloTermo(r)}</span>)}
          {o.condicoes.map((r, i) => <span key={`c${i}`} className="tag tag-cond">{rotuloTermo(r)}</span>)}
        </p>
      )}
      {o.encaminhamentos.length > 0 && (
        <p className="chamado-tags">
          {o.encaminhamentos.map((e) => (
            <span key={e.setor} className={`setor-chip setor-${e.estado}`} title={e.motivos.join(', ')}>
              {setorPorId[e.setor].sigla}
            </span>
          ))}
        </p>
      )}
      <ol className="historico">
        {o.historico.map((h, i) => <li key={`${h.em}-${i}`}><time dateTime={h.em}>{formatarHora(h.em)}</time> {h.evento}</li>)}
      </ol>
    </li>
  )
}

export default function FalarComElo({ estado, onAgente, onNavegar }) {
  const [digitado, setDigitado] = useState('')
  const { voz, ultima, processar } = useAgente({ estado, onAgente })

  const enviarDigitado = (e) => {
    e.preventDefault()
    processar(digitado)
    setDigitado('')
  }

  const { trechos, trechoAtualId, ocorrencias, pendente } = estado
  const trechoDe = (id) => trechos.find((t) => t.id === id)
  const atual = trechoDe(trechoAtualId)
  const recentes = ordenarRecentes(ocorrencias).slice(0, 6)
  const abertas = ocorrencias.filter((o) => o.status !== 'resolvida').length

  return (
    <section className="ao-vivo">
      <div className="console">
        <h2>Fale com o Elo</h2>
        <p className="lead-curto">
          A frase vira ocorrência no trecho certo: o Elo acha o trecho pelo km falado.
          Sem km, usa o GPS simulado no meio do trecho atual
          {atual ? ` (${atual.referencia || atual.rodovia}, km ${atual.kmInicial}–${atual.kmFinal})` : ''}.
        </p>

        <div className="mic-area">
          <button
            type="button"
            className={`mic ${voz.ouvindo ? 'ouvindo' : ''}`}
            onClick={voz.ouvindo ? voz.parar : voz.ouvir}
            aria-pressed={voz.ouvindo}
            aria-label={voz.ouvindo ? 'Parar de ouvir' : 'Falar com o Elo'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 15a3.5 3.5 0 0 0 3.5-3.5v-6a3.5 3.5 0 0 0-7 0v6A3.5 3.5 0 0 0 12 15Zm6-3.5a6 6 0 0 1-12 0H4.5a7.5 7.5 0 0 0 6.75 7.46V21h1.5v-2.04a7.5 7.5 0 0 0 6.75-7.46H18Z" />
            </svg>
          </button>
          <div className="mic-texto" aria-live="polite">
            {voz.ouvindo && <p className="ouvindo-txt">{voz.parcial || 'Ouvindo…'}</p>}
            {!voz.ouvindo && ultima && <p className="disse">“{ultima.analise.textoBruto}”</p>}
            {!voz.ouvindo && !ultima && <p className="dica">Toque e diga: “Elo, colisão no km 688, sentido norte”.</p>}
            {voz.erro && <p className="erro" role="alert">{voz.erro}</p>}
          </div>
        </div>

        {ultima && (
          <div className="resposta-elo" aria-live="polite">
            <span className="quem">Elo</span>
            <p>{ultima.fala}</p>
          </div>
        )}

        {pendente && !pendente.faltaKm && (
          <div className="pendente">
            <p>
              <strong>Aguardando confirmação</strong> · {rotuloTipo(pendente.tipo)}, gravidade{' '}
              {rotuloGravidade(pendente.gravidade).toLowerCase()}, km {formatarKm(pendente.km)} ·{' '}
              {nomeTrecho(trechoDe(pendente.trechoId))}
            </p>
            <p className="pendente-acoes">
              <button type="button" className="link-acao" onClick={() => processar('confirmo')}>Confirmo</button>
              <button type="button" className="link-acao secundario" onClick={() => processar('cancelar')}>Cancelar</button>
            </p>
          </div>
        )}

        {ultima && (
          <div className="analise">
            <h3>O que o NLU entendeu</h3>
            <TextoMarcado texto={ultima.analise.normalizado} entidades={ultima.analise.entidades} />
            <p className="intencao">
              Intenção: <strong>{rotuloIntencao(ultima.analise.intencao)}</strong>{' '}
              <code>{ultima.analise.intencao}</code>
            </p>
            {ultima.analise.intencaoOriginal && (
              <p className="intencao-nota">
                As regras indicaram <code>{ultima.analise.intencaoOriginal}</code>, mas a frase nomeia um tipo
                de ocorrência; o Elo tratou como registro.
              </p>
            )}
            <Pontos pontos={ultima.analise.pontos} vencedora={ultima.analise.intencao} />
          </div>
        )}

        <form className="digitar" onSubmit={enviarDigitado}>
          <label htmlFor="frase" className="sr-only">Digitar uma frase para o Elo</label>
          <input
            id="frase"
            value={digitado}
            onChange={(e) => setDigitado(e.target.value)}
            placeholder="Ou digite a frase, se o microfone falhar"
          />
          <button type="submit" className="link-acao">Enviar</button>
        </form>
        <p className="exemplos">
          {EXEMPLOS.map((ex) => (
            <button key={ex} type="button" className="chip" onClick={() => processar(ex)}>{ex}</button>
          ))}
        </p>
      </div>

      <div className="central">
        <div className="central-topo">
          <h2>Central ao vivo</h2>
          <span className="central-acoes">
            <button type="button" className="link-acao secundario" onClick={() => onNavegar('ocorrencias')}>Ver por trecho</button>
            <button type="button" className="link-acao" onClick={() => onNavegar('encaminhar')}>Encaminhar</button>
          </span>
        </div>
        <p className="lead-curto">{abertas} em aberto · {ocorrencias.length} no total · as 6 mais recentes</p>
        {recentes.length === 0
          ? <p className="vazio">Nenhuma ocorrência ainda. Registre uma por voz.</p>
          : <ul className="chamados">{recentes.map((o) => <CartaoChamado key={o.id} o={o} trecho={trechoDe(o.trechoId)} />)}</ul>}
      </div>
    </section>
  )
}
