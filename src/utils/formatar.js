export function formatarData(iso) {
  return new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

export function somar(valores) {
  let total = 0
  for (const valor of valores) {
    total += valor
  }
  return total
}

// Pinta cada barra conforme passa ou não do limite.
// Devolve um array de cores na mesma ordem dos valores.
export function coresPorLimite(valores, limite, corOk, corAlerta) {
  return valores.map((valor) => (valor > limite ? corAlerta : corOk))
}

// Transforma labels e valores em uma frase para o leitor de tela.
// Ex.: "Voz (Elo): 29; Botão do colete: 5".
export function descreverSerie(labels, valores, unidade = '') {
  return labels
    .map((label, indice) => `${label}: ${valores[indice]}${unidade}`)
    .join('; ')
}

// TODO Sprint 2: criar src/utils/analisarTrecho.js, nos moldes do
// analisarPerfil que fizemos no CardioIA. A função recebe as ocorrências do
// trecho atual e devolve total, quantas são de gravidade alta, o tipo mais
// frequente, o silêncio médio e se cabe um alerta.
