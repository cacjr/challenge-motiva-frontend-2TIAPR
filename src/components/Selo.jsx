import { rotuloGravidade, rotuloStatus } from '../data/dominio.js'

// Selo colorido. tipo="gravidade" (baixa, média, alta) ou tipo="status"
// (aberta, em atendimento, resolvida). A cor vem da classe selo-<tipo>-<valor>.
const ROTULO = { gravidade: rotuloGravidade, status: rotuloStatus }

// Símbolo além da cor: quem não distingue cores ainda lê a gravidade.
const SIMBOLO = { baixa: '▼', media: '■', alta: '▲' }

export default function Selo({ tipo = 'gravidade', valor }) {
  const texto = ROTULO[tipo](valor)
  return (
    <span className={`selo selo-${tipo}-${valor}`} title={`${tipo === 'gravidade' ? 'Gravidade' : 'Status'}: ${texto}`}>
      {tipo === 'gravidade' && <span className="selo-simbolo" aria-hidden="true">{SIMBOLO[valor]}</span>}
      {tipo === 'gravidade' ? <><span className="sr-only">Gravidade </span>{texto}</> : texto}
    </span>
  )
}
