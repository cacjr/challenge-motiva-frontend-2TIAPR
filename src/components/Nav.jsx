import Icone from './Icone.jsx'

const itens = [
  { id: 'inicio', rotulo: 'Início', icone: 'inicio' },
  { id: 'elo', rotulo: 'Falar com o Elo', icone: 'mic' },
  { id: 'trechos', rotulo: 'Trechos', icone: 'estrada' },
  { id: 'ocorrencias', rotulo: 'Ocorrências', icone: 'camadas' },
  { id: 'dashboard', rotulo: 'Dashboard', icone: 'grafico' },
  { id: 'encaminhar', rotulo: 'Encaminhamentos', icone: 'enviar' },
  { id: 'interacoes', rotulo: 'Interações', icone: 'balao' },
  { id: 'sobre', rotulo: 'Como funciona', icone: 'livro' },
]

export default function Nav({ ref, paginaAtual, onNavegar }) {
  return (
    <nav className="nav" ref={ref} aria-label="Seções da plataforma">
      {itens.map((item) => (
        <button
          key={item.id}
          type="button"
          className={paginaAtual === item.id ? 'nav-item ativo' : 'nav-item'}
          aria-current={paginaAtual === item.id ? 'page' : undefined}
          onClick={() => onNavegar(item.id)}
        >
          <Icone nome={item.icone} tamanho={18} />
          {item.rotulo}
        </button>
      ))}
    </nav>
  )
}
