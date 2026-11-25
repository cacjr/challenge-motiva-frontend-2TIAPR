// As regras da Sprint 1 de PLN foram escritas para o `re` do Python, em que \b e \w
// reconhecem letras acentuadas. No JavaScript, \b e \w só conhecem ASCII
// ("às", "ônibus" quebrariam). Esta função traduz o padrão para a mesma semântica.
const W = '[\\p{L}\\p{N}_]'
const LIMITE = `(?:(?<=${W})(?!${W})|(?<!${W})(?=${W}))`

export function re(padrao, flags = '') {
  const traduzido = padrao.replace(/\\b/g, LIMITE).replace(/\\w/g, W)
  return new RegExp(traduzido, flags.includes('u') ? flags : flags + 'u')
}

export function escapar(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
