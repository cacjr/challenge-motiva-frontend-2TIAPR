// Ponto único de entrada do NLU no front. Quando o NLU passar a rodar no backend
// (projeto de PLN: FastAPI + RAG no Azure), só esta função troca por um fetch.
import { normalizar } from './normalizacao.js'
import { classificar, extrairEntidades } from './baseline.js'

export function interpretar(textoBruto) {
  const normalizado = normalizar(textoBruto)
  const { intencao, pontos } = classificar(normalizado)
  const entidades = extrairEntidades(normalizado)
  return { textoBruto, normalizado, intencao, pontos, entidades }
}
