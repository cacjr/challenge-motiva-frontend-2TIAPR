import { useState } from 'react'
import Icone from './Icone.jsx'
import { useAgente } from '../hooks/useAgente.js'

const ATALHOS = ['Elo, colisão no km 688', 'Confirmo', 'Cheguei no local', 'Como está a operação?']

export default function AcaoRapida({ estado, onAgente }) {
  const [texto, setTexto] = useState('')
  const { voz, ultima, processar } = useAgente({ estado, onAgente })

  const enviar = (e) => {
    e.preventDefault()
    processar(texto)
    setTexto('')
  }

  return (
    <section className="lado-cartao" aria-labelledby="acao-rapida">
      <div className="lado-titulo">
        <Icone nome="raio" className="icone-ambar" />
        <div>
          <h3 id="acao-rapida">Ação rápida</h3>
          <p>Fale com o Elo por voz ou digite um comando.</p>
        </div>
      </div>
      <form className={`barra-voz ${voz.ouvindo ? 'ouvindo' : ''}`} onSubmit={enviar}>
        <button
          type="button"
          className="barra-mic"
          onClick={voz.ouvindo ? voz.parar : voz.ouvir}
          aria-pressed={voz.ouvindo}
          aria-label={voz.ouvindo ? 'Parar de ouvir' : 'Falar com o Elo'}
        >
          <Icone nome="mic" tamanho={22} />
        </button>
        <label htmlFor="comando-rapido" className="sr-only">Comando para o Elo</label>
        <input
          id="comando-rapido"
          value={voz.ouvindo ? voz.parcial : texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={voz.ouvindo ? 'Ouvindo…' : 'Toque e diga um comando…'}
          readOnly={voz.ouvindo}
        />
      </form>
      {voz.erro && <p className="erro" role="alert">{voz.erro}</p>}
      <p className="atalhos">
        {ATALHOS.map((a) => (
          <button key={a} type="button" className="chip" onClick={() => processar(a)}>{a}</button>
        ))}
      </p>
      {ultima && (
        <div className="eco" aria-live="polite">
          <p className="eco-disse">“{ultima.analise.textoBruto}”</p>
          <p className="eco-elo"><strong>Elo:</strong> {ultima.fala}</p>
          {estado.pendente && !estado.pendente.faltaKm && (
            <p className="pendente-acoes">
              <button type="button" className="link-acao" onClick={() => processar('confirmo')}>Confirmo</button>
              <button type="button" className="link-acao secundario" onClick={() => processar('cancelar')}>Cancelar</button>
            </p>
          )}
        </div>
      )}
    </section>
  )
}
