import { rotuloGravidade, rotuloStatus } from '../data/dominio.js'

// Selo colorido. tipo="gravidade" (baixa, média, alta) ou tipo="status"
// (aberta, em atendimento, resolvida). A cor vem da classe selo-<tipo>-<valor>.
const ROTULO = { gravidade: rotuloGravidade, status: rotuloStatus }

export default function Selo({ tipo = 'gravidade', valor }) {
  const texto = ROTULO[tipo](valor)
  return (
    <span className={`selo selo-${tipo}-${valor}`} title={`${tipo === 'gravidade' ? 'Gravidade' : 'Status'}: ${texto}`}>
      {tipo === 'gravidade' && <span className="selo-ponto" aria-hidden="true" />}
      {tipo === 'gravidade' ? <><span className="sr-only">Gravidade </span>{texto}</> : texto}
    </span>
  )
}
