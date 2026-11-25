import FormTrecho from '../components/FormTrecho.jsx'
import ListaTrechos from '../components/ListaTrechos.jsx'

export default function Trechos({
  trechos, ocorrencias, trechoAtualId, onCadastrar, onSelecionar, onRemover, onAbrir, onRestaurar, onZerar,
}) {
  return (
    <section className="tela-trechos">
      <div className="tela-cabeca">
        <div>
          <h2>Trechos</h2>
          <p className="intro">
            Cadastre os trechos da malha e escolha o trecho atual. Cada ocorrência
            fica carimbada com o trecho dela: o histórico de um trecho nunca mostra
            o de outro.
          </p>
        </div>
        <p className="dados-demo">
          <button type="button" className="link-acao secundario mini" onClick={onRestaurar}>
            Restaurar exemplo
          </button>
          <button type="button" className="link-acao secundario mini" onClick={onZerar}>
            Começar do zero
          </button>
        </p>
      </div>

      <div className="duas-colunas">
        <FormTrecho trechos={trechos} onCadastrar={onCadastrar} />
        <div>
          <h3 className="lista-titulo">
            {trechos.length} trecho{trechos.length === 1 ? '' : 's'} cadastrado{trechos.length === 1 ? '' : 's'}
          </h3>
          <ListaTrechos
            trechos={trechos}
            ocorrencias={ocorrencias}
            trechoAtualId={trechoAtualId}
            onSelecionar={onSelecionar}
            onAbrir={onAbrir}
            onRemover={onRemover}
          />
        </div>
      </div>
    </section>
  )
}
