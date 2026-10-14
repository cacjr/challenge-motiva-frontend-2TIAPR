export default function Header({ marca, sigla, complemento, curso }) {
  return (
    <div className="marca-linha">
      <div className="marca">
        <span className="marca-icone" aria-hidden="true">
          {sigla}
        </span>
        <div>
          <h1 className="marca-nome">{marca}</h1>
          <p className="marca-complemento">{complemento}</p>
        </div>
      </div>
      <p className="topo-curso">{curso}</p>
    </div>
  )
}
