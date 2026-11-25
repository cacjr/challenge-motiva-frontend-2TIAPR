export default function Header({ marca, sigla, complemento }) {
  return (
    <div className="marca">
      <span className="marca-icone" aria-hidden="true">
        {sigla}
      </span>
      <div>
        <h1 className="marca-nome">{marca}</h1>
        <p className="marca-complemento">{complemento}</p>
      </div>
    </div>
  )
}
