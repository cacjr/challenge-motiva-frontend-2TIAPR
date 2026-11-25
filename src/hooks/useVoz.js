import { useCallback, useEffect, useRef, useState } from 'react'

// Reconhecimento de fala do navegador (Chrome e Edge). Precisa de internet:
// o áudio é transcrito pelo serviço do próprio navegador.
// Próximo passo (projeto de PLN, fora do front): trocar pelo Whisper no backend.
const Reconhecimento = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : undefined

export function useVoz(onFrase) {
  const [ouvindo, setOuvindo] = useState(false)
  const [parcial, setParcial] = useState('')
  const [erro, setErro] = useState('')
  const recRef = useRef(null)
  const onFraseRef = useRef(onFrase)
  useEffect(() => {
    onFraseRef.current = onFrase
  })

  const parar = useCallback(() => recRef.current?.stop(), [])

  const ouvir = useCallback(() => {
    if (!Reconhecimento) {
      setErro('Este navegador não reconhece voz. Use o Chrome ou o Edge, ou digite a frase.')
      return
    }
    window.speechSynthesis?.cancel()
    recRef.current?.abort()
    const rec = new Reconhecimento()
    rec.lang = 'pt-BR'
    rec.interimResults = true
    rec.continuous = false
    rec.onstart = () => { setErro(''); setParcial(''); setOuvindo(true) }
    rec.onresult = (e) => {
      const r = e.results[e.results.length - 1]
      setParcial(r[0].transcript)
      if (r.isFinal) onFraseRef.current(r[0].transcript)
    }
    rec.onerror = (e) => {
      const msg = {
        'not-allowed': 'O navegador bloqueou o microfone. Libere no cadeado da barra de endereço.',
        'no-speech': 'Não ouvi nada. Toque no microfone e fale de novo.',
        network: 'Sem internet para o reconhecimento de voz. Digite a frase abaixo.',
      }[e.error]
      setErro(msg ?? `Falha no microfone (${e.error}).`)
    }
    rec.onend = () => setOuvindo(false)
    recRef.current = rec
    rec.start()
  }, [])

  useEffect(() => () => recRef.current?.abort(), [])
  return { suportado: Boolean(Reconhecimento), ouvindo, parcial, erro, ouvir, parar }
}

let vozPt = null
function escolherVoz() {
  const vozes = window.speechSynthesis?.getVoices() ?? []
  vozPt = vozes.find((v) => v.lang === 'pt-BR' && /google|francisca|maria/i.test(v.name))
    ?? vozes.find((v) => v.lang?.startsWith('pt')) ?? null
}
if (typeof window !== 'undefined' && window.speechSynthesis) {
  escolherVoz()
  window.speechSynthesis.onvoiceschanged = escolherVoz
}

export function falar(texto, aoTerminar) {
  const synth = window.speechSynthesis
  if (!synth) { aoTerminar?.(); return }
  synth.cancel()
  const u = new SpeechSynthesisUtterance(texto)
  u.lang = 'pt-BR'
  if (vozPt) u.voice = vozPt
  u.rate = 1.05
  u.onend = () => aoTerminar?.()
  synth.speak(u)
}
