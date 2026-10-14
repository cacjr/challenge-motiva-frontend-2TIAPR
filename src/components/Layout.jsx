import { useEffect, useRef } from 'react'
import Header from './Header.jsx'
import Nav from './Nav.jsx'

export default function Layout({ children, plataforma, paginaAtual, onNavegar }) {
  const mioloRef = useRef(null)
  const primeiraTela = useRef(true)

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
        <div className="faixa">
          <Header
            marca={plataforma.marca}
            sigla={plataforma.sigla}
            complemento={plataforma.complemento}
            curso={plataforma.curso}
          />
          <Nav paginaAtual={paginaAtual} onNavegar={onNavegar} />
        </div>
      </header>
      <main id="conteudo" className="miolo" ref={mioloRef} tabIndex={-1}>
        {children}
      </main>
    </div>
  )
}
