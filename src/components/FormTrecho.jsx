// Autor: Gustavo Duarte (GustavoduarteAI) · formulários de trecho e ocorrência e telas Trechos e Ocorrências
import { useState } from 'react'
import { COBERTURAS } from '../data/dominio.js'
import { validarTrecho } from '../utils/validacao.js'

const VAZIO = { rodovia: 'BR-163/MS', referencia: '', kmInicial: '', kmFinal: '', cobertura: 'sinal' }

// Formulário controlado: cada input lê de form e escreve com setForm.
// O pai (App) recebe o trecho pronto em onCadastrar e cria o id.
export default function FormTrecho({ trechos, onCadastrar }) {
  const [form, setForm] = useState(VAZIO)
  const [erros, setErros] = useState({})

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  const enviar = (e) => {
    e.preventDefault()
    const encontrados = validarTrecho(form, trechos)
    setErros(encontrados)
    if (Object.keys(encontrados).length) return
    onCadastrar({
      rodovia: form.rodovia.trim().toUpperCase(),
      referencia: form.referencia.trim(),
      kmInicial: Number(form.kmInicial),
      kmFinal: Number(form.kmFinal),
      cobertura: form.cobertura,
    })
    setForm({ ...VAZIO, rodovia: form.rodovia.trim().toUpperCase() })
  }

  const erroDe = (campo) => erros[campo] && <p className="campo-erro" id={`erro-${campo}`}>{erros[campo]}</p>
  const aria = (campo) => ({ 'aria-invalid': Boolean(erros[campo]), 'aria-describedby': erros[campo] ? `erro-${campo}` : undefined })

  return (
    <form className="form-cartao" onSubmit={enviar} noValidate>
      <h3>Cadastrar trecho</h3>
      <div className="campos campos-trecho">
        <label className="campo">
          <span>Rodovia</span>
          <input value={form.rodovia} onChange={mudar('rodovia')} placeholder="BR-163/MS" {...aria('rodovia')} />
          {erroDe('rodovia')}
        </label>
        <label className="campo">
          <span>Km inicial</span>
          <input type="number" min="0" step="0.1" inputMode="decimal" value={form.kmInicial} onChange={mudar('kmInicial')} {...aria('kmInicial')} />
          {erroDe('kmInicial')}
        </label>
        <label className="campo">
          <span>Km final</span>
          <input type="number" min="0" step="0.1" inputMode="decimal" value={form.kmFinal} onChange={mudar('kmFinal')} {...aria('kmFinal')} />
          {erroDe('kmFinal')}
        </label>
        <label className="campo">
          <span>Referência <small>(opcional)</small></span>
          <input value={form.referencia} onChange={mudar('referencia')} placeholder="Ex.: Coxim, ponte do rio Taquari" />
        </label>
        <label className="campo">
          <span>Cobertura de celular</span>
          <select className="seletor" value={form.cobertura} onChange={mudar('cobertura')}>
            {COBERTURAS.map((c) => <option key={c.id} value={c.id}>{c.rotulo}</option>)}
          </select>
        </label>
      </div>
      <p className="form-acoes">
        <button type="submit" className="link-acao">Cadastrar trecho</button>
        <small className="form-dica">A cobertura define por onde o Elo envia: 4G, SMS ou LoRa.</small>
      </p>
    </form>
  )
}
