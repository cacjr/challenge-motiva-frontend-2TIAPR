export default function ComoFunciona({ conteudo }) {
  const { comandosVoz, planoB, autopreenchimento, codigoElo, cascata, principios } = conteudo

  return (
    <section>
      <h2>Como funciona</h2>
      <p className="intro">
        O caminho de um registro, da fala do colaborador até a central. Esta
        tela descreve a solução proposta. Na Sprint 1 nada disso está ligado:
        os dados das outras telas simulam o resultado.
      </p>

      <h3 className="etapa">1. Falar com o Elo</h3>
      <p className="intro">
        O Elo é um agente de voz que roda no aparelho, sem internet. A
        palavra de ativação é o próprio nome.
      </p>
      <ul className="grade-cartoes">
        {comandosVoz.map((comando) => (
          <li key={comando.id} className="cartao">
            <p className="linha-kicker">{comando.acao}</p>
            <p className="linha-titulo">{comando.exemplo}</p>
            <p className="linha-meta">{comando.oQueFaz}</p>
          </li>
        ))}
      </ul>

      <h3 className="etapa">2. Quando a voz não dá: plano B</h3>
      <ul className="grade-cartoes">
        {planoB.map((entrada) => (
          <li key={entrada.id} className="cartao cartao-ceu">
            <p className="linha-titulo">{entrada.nome}</p>
            <p className="linha-resposta">{entrada.como}</p>
            <p className="linha-meta">{entrada.quando}</p>
          </li>
        ))}
      </ul>

      <h3 className="etapa">3. Autopreenchimento inteligente</h3>
      <p className="intro">
        O colaborador só diz o que viu. O resto o aparelho já sabe.
      </p>
      <ul className="grade-cartoes">
        {autopreenchimento.map((item) => (
          <li key={item.id} className="cartao">
            <p className="linha-kicker">{item.origem}</p>
            <p className="linha-resposta">{item.preenche}</p>
          </li>
        ))}
      </ul>

      <h3 className="etapa">4. Virar o Código Elo</h3>
      <p className="intro">
        Cerca de 50 bytes. Cabe em um SMS, em um pacote LoRa, em qualquer
        brecha de sinal.
      </p>
      <div className="leitura">
        <p className="codigo-exemplo">
          <code>E1|688.2|N|COL|ALTA|V2|P1|1432</code>
        </p>
        <div className="tabela-rolagem">
          <table className="tabela">
            <caption className="sr-only">Campos do Código Elo e o que cada um significa</caption>
            <thead>
              <tr>
                <th scope="col">Campo</th>
                <th scope="col">Significado</th>
              </tr>
            </thead>
            <tbody>
              {codigoElo.map((parte) => (
                <tr key={parte.id}>
                  <td>
                    <code>{parte.campo}</code>
                  </td>
                  <td>{parte.significado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h3 className="etapa">5. Cascata de envio</h3>
      <ol className="lista">
        {cascata.map((degrau) => (
          <li key={degrau.id}>
            <article className="linha">
              <p className="linha-titulo">
                {degrau.ordem}. {degrau.canal}
              </p>
              <p className="linha-meta">{degrau.alcance}</p>
              <p className="linha-resposta">{degrau.papel}</p>
            </article>
          </li>
        ))}
      </ol>

      <h3 className="etapa">6. Central e Escudo de Pista</h3>
      <div className="abertura">
        <p className="lead">
          A central recebe o código e faz o pré-despacho antes de qualquer
          ligação. Cada registro carrega a hora do fato, então o tempo de
          silêncio vira número auditável. Frentes de serviço fazem check-in por
          voz; se ele não chega, ou se o homem caído dispara, o alerta sobe
          pela mesma cascata.
        </p>
      </div>

      <h3 className="etapa">Ligação com os princípios da Motiva</h3>
      <ul className="grade-cartoes">
        {principios.map((principio) => (
          <li key={principio.id} className="cartao">
            <p className="linha-kicker">{principio.valor}</p>
            <p className="linha-resposta">{principio.ligacao}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
