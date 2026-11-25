import { useState } from 'react'
import { GRAVIDADES, TIPOS, tipoPorId } from '../data/dominio.js'
import { isoLocal } from '../utils/formatar.js'
import { validarOcorrencia } from '../utils/validacao.js'

// Valor do <input type="datetime-local">: "2026-11-25T14:32".
const agoraCampo = () => isoLocal().slice(0, 16)
const vazio = () => ({ tipo: '', gravidade: '', descricao: '', km: '', horaFato: agoraCampo() })

// Formulário controlado. Quem carimba trechoId, data/hora de registro e status
// é o App (onRegistrar); aqui só se coleta o que a pessoa viu.
export default function FormOcorrencia({ trecho, onRegistrar }) {
  const [form, setForm] = useState(vazio)
  const [erros, setErros] = useState({})
  const [aviso, setAviso] = useState('')

  const mudar = (campo) => (e) => {
    const valor = e.target.value
    // Ao escolher o tipo, sugere a gravidade padrão (se ainda não houver uma).
    if (campo === 'tipo' && !form.gravidade && valor) {
      setForm({ ...form, tipo: valor, gravidade: tipoPorId[valor].gravidadePadrao })
    } else {
      setForm({ ...form, [campo]: valor })
    }
    setAviso('')
  }

  const enviar = (e) => {
    e.preventDefault()
    const encontrados = validarOcorrencia(form, trecho)
    setErros(encontrados)
    if (Object.keys(encontrados).length) return
    onRegistrar({
      tipo: form.tipo,
      gravidade: form.gravidade,
      descricao: form.descricao,
      km: form.km === '' ? null : Number(form.km),
      horaFato: `${form.horaFato}:00`,
      canal: 'formulario',
    })
    setForm(vazio())
    setAviso('Ocorrência registrada neste trecho.')
  }

  const erroDe = (campo) => erros[campo] && <p className="campo-erro" id={`erro-oc-${campo}`}>{erros[campo]}</p>
  const aria = (campo) => ({ 'aria-invalid': Boolean(erros[campo]), 'aria-describedby': erros[campo] ? `erro-oc-${campo}` : undefined })

  return (
    <form className="form-cartao" onSubmit={enviar} noValidate>
      <h3>Registrar ocorrência</h3>
      <p className="form-dica">No trecho {trecho.rodovia} · km {trecho.kmInicial}–{trecho.kmFinal}.</p>

      <div className="campos">
        <label className="campo">
          <span>Tipo</span>
          <select className="seletor" value={form.tipo} onChange={mudar('tipo')} {...aria('tipo')}>
            <option value="">Escolha…</option>
            {TIPOS.map((t) => <option key={t.id} value={t.id}>{t.rotulo}</option>)}
          </select>
          {erroDe('tipo')}
        </label>

        <fieldset className="campo campo-gravidade" aria-describedby={erros.gravidade ? 'erro-oc-gravidade' : undefined}>
          <legend>Gravidade</legend>
          <div className="opcoes-gravidade">
            {GRAVIDADES.map((g) => (
              <label key={g.id} className={`opcao opcao-${g.id} ${form.gravidade === g.id ? 'marcada' : ''}`}>
                <input
                  type="radio"
                  name="gravidade"
                  value={g.id}
                  checked={form.gravidade === g.id}
                  onChange={mudar('gravidade')}
                />
                {g.rotulo}
              </label>
            ))}
          </div>
          {erroDe('gravidade')}
        </fieldset>

        <label className="campo campo-largo">
          <span>Descrição</span>
          <textarea
            rows="3"
            value={form.descricao}
            onChange={mudar('descricao')}
            placeholder="O que aconteceu, onde exatamente, se há vítimas"
            {...aria('descricao')}
          />
          {erroDe('descricao')}
        </label>

        <label className="campo">
          <span>Km <small>(opcional)</small></span>
          <input
            type="number"
            step="0.1"
            min={trecho.kmInicial}
            max={trecho.kmFinal}
            inputMode="decimal"
            value={form.km}
            onChange={mudar('km')}
            placeholder={`${trecho.kmInicial} a ${trecho.kmFinal}`}
            {...aria('km')}
          />
          {erroDe('km')}
        </label>

        <label className="campo">
          <span>Quando aconteceu</span>
          <input type="datetime-local" value={form.horaFato} max={agoraCampo()} onChange={mudar('horaFato')} {...aria('horaFato')} />
          {erroDe('horaFato')}
        </label>
      </div>

      <p className="form-acoes">
        <button type="submit" className="link-acao">Registrar</button>
        <small className="form-dica">A diferença entre a hora do fato e o registro é o tempo de silêncio.</small>
      </p>
      <p className="form-aviso" role="status">{aviso}</p>
    </form>
  )
}
