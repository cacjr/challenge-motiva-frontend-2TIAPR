export function formatarData(iso) {
  return new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

export function formatarHora(iso) {
  return new Date(iso).toTimeString().slice(0, 5)
}

// Data e hora locais no formato 2026-11-25T14:32:00. Todas as datas da
// plataforma usam este formato, então dá para ordenar comparando o texto.
export function isoLocal(data = new Date()) {
  const dois = (n) => String(n).padStart(2, '0')
  return `${data.getFullYear()}-${dois(data.getMonth() + 1)}-${dois(data.getDate())}`
    + `T${dois(data.getHours())}:${dois(data.getMinutes())}:${dois(data.getSeconds())}`
}

export const formatarKm = (km) => String(km).replace('.', ',')

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
