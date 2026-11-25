import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Header from './Header.jsx'
import Nav from './Nav.jsx'
import Icone from './Icone.jsx'

export default function Layout({ children, plataforma, paginaAtual, onNavegar, alertas = 0 }) {
  const mioloRef = useRef(null)
  const faixaRef = useRef(null)
  const navRef = useRef(null)
  const primeiraTela = useRef(true)
  const [nivel, setNivel] = useState(0)

  // O cabeçalho mede o próprio espaço (a fonte muda de um computador para outro)
  // e vai compactando até caber: 1 tira o curso, 2 tira o subtítulo da marca,
  // 3 tira os ícones do menu, 4 passa o menu para uma segunda linha.
  useLayoutEffect(() => {
    const faixa = faixaRef.current
    const nav = navRef.current
    if (!faixa || !nav) return undefined
    const ajustar = () => {
      for (let n = 0; n <= 4; n += 1) {
        faixa.dataset.nivel = String(n)
        if (n === 4 || nav.scrollWidth <= nav.clientWidth + 1) {
          setNivel(n)
          return
        }
      }
    }
    ajustar()
    const obs = new ResizeObserver(ajustar)
    obs.observe(document.documentElement)
    document.fonts?.ready.then(ajustar)
    return () => obs.disconnect()
  }, [])

  // Ao trocar de tela, o foco vai para o conteúdo novo. Sem isso, quem usa
  // teclado ou leitor de tela continua no menu e não percebe a troca.
  useEffect(() => {
    if (primeiraTela.current) {
      primeiraTela.current = false
      return
    }
    window.scrollTo(0, 0)
    mioloRef.current?.focus({ preventScroll: true })
  }, [paginaAtual])

  return (
    <div className="casca">
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="topo">
        <div className="faixa" ref={faixaRef} data-nivel={nivel}>
          <Header
            marca={plataforma.marca}
            sigla={plataforma.sigla}
            complemento={plataforma.complemento}
          />
          <Nav ref={navRef} paginaAtual={paginaAtual} onNavegar={onNavegar} />
          <div className="topo-direita">
            <p className="topo-curso">{plataforma.curso}</p>
            <button
              type="button"
              className="sino"
              onClick={() => onNavegar('encaminhar')}
              aria-label={alertas ? `${alertas} ocorrência(s) aguardando encaminhamento` : 'Nenhuma ocorrência aguardando encaminhamento'}
            >
              <Icone nome="sino" tamanho={22} />
              {alertas > 0 && <span className="sino-conta">{alertas}</span>}
            </button>
            <span className="avatar" title="Centro de Controle Operacional">CCO</span>
          </div>
        </div>
      </header>
      <main id="conteudo" className={`miolo ${paginaAtual === 'dashboard' ? 'miolo-largo' : ''}`} ref={mioloRef} tabIndex={-1}>
        {children}
      </main>
    </div>
  )
}
