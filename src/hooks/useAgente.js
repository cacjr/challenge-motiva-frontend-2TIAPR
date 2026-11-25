import { useEffect, useRef, useState } from 'react'
import { useVoz, falar } from './useVoz.js'
import { responder } from '../nlu/agente.js'

// Liga microfone, NLU e voz do Elo. Usado na tela Falar com o Elo e na Ação rápida.
// estado: { trechos, trechoAtualId, ocorrencias, pendente, comandos, log }, vindo do App.
// onAgente: o App aplica as mudanças (ocorrências, rascunho pendente e log).
export function useAgente({ estado, onAgente }) {
  const [ultima, setUltima] = useState(null)
  const processarRef = useRef(null)
  const voz = useVoz((frase) => processarRef.current?.(frase))

  const processar = (frase) => {
    if (!frase.trim()) return
    const r = responder(frase, estado)
    onAgente(r.mudancas)
    setUltima(r)
    // Depois de perguntar ("Confirma?", "Em que km?"), o Elo volta a ouvir sozinho.
    falar(r.fala, () => { if (r.fala.endsWith('?') && voz.suportado) voz.ouvir() })
  }
  useEffect(() => {
    processarRef.current = processar
  })

  return { voz, ultima, processar }
}
