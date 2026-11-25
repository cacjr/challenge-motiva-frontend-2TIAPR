// Validação dos formulários. Devolvem { campo: mensagem }; vazio = tudo certo.

// Trechos da mesma rodovia não podem se sobrepor: o Elo descobre o trecho
// pelo km falado, e cada km precisa ter um dono só.
export function validarTrecho(form, trechos) {
  const erros = {}
  const ini = Number(form.kmInicial)
  const fim = Number(form.kmFinal)
  if (!form.rodovia.trim()) erros.rodovia = 'Informe a rodovia.'
  if (form.kmInicial === '' || Number.isNaN(ini) || ini < 0) erros.kmInicial = 'Km inicial precisa ser um número a partir de 0.'
  if (form.kmFinal === '' || Number.isNaN(fim) || fim < 0) erros.kmFinal = 'Km final precisa ser um número a partir de 0.'
  if (!erros.kmInicial && !erros.kmFinal && fim <= ini) erros.kmFinal = 'O km final precisa ser maior que o inicial.'
  if (!Object.keys(erros).length) {
    const rodovia = form.rodovia.trim().toUpperCase()
    const choque = trechos.find((t) => t.rodovia.toUpperCase() === rodovia && ini < t.kmFinal && fim > t.kmInicial)
    if (choque) erros.kmInicial = `Sobrepõe o trecho km ${choque.kmInicial}–${choque.kmFinal} (${choque.referencia || choque.rodovia}).`
  }
  return erros
}

// A ocorrência precisa de tipo, gravidade e descrição. O km é opcional, mas,
// se vier, tem de estar dentro do trecho; a hora do fato não pode ser futura.
export function validarOcorrencia(form, trecho, agora = new Date()) {
  const erros = {}
  if (!form.tipo) erros.tipo = 'Escolha o tipo.'
  if (!form.gravidade) erros.gravidade = 'Escolha a gravidade.'
  if (form.descricao.trim().length < 5) erros.descricao = 'Descreva em pelo menos 5 caracteres.'
  if (form.km !== '') {
    const km = Number(form.km)
    if (Number.isNaN(km) || km < trecho.kmInicial || km > trecho.kmFinal) {
      erros.km = `O km precisa estar entre ${trecho.kmInicial} e ${trecho.kmFinal}.`
    }
  }
  if (!form.horaFato) erros.horaFato = 'Informe quando aconteceu.'
  else if (new Date(form.horaFato) > agora) erros.horaFato = 'A hora do fato não pode estar no futuro.'
  return erros
}
