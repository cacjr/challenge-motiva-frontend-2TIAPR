import CardOcorrencia from './CardOcorrencia.jsx'

// Recebe só as ocorrências do trecho selecionado, já filtradas pela página.
// semNada: o trecho ainda não tem ocorrência; o filtro é que esvaziou a lista.
export default function ListaOcorrencias({ ocorrencias, semNada, onStatus }) {
  if (ocorrencias.length === 0) {
    return (
      <p className="vazio vazio-destaque">
        {semNada
          ? 'Nenhuma ocorrência registrada neste trecho. Use o formulário ou fale com o Elo.'
          : 'Nenhuma ocorrência combina com o filtro. Mude ou limpe o filtro.'}
      </p>
    )
  }

  return (
    <ul className="lista-ocorrencias">
      {ocorrencias.map((o) => (
        <li key={o.id}>
          <CardOcorrencia ocorrencia={o} onStatus={onStatus} />
        </li>
      ))}
    </ul>
  )
}
