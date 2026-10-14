import PainelGraficos from '../components/PainelGraficos.jsx'
import TabelaTrechos from '../components/TabelaTrechos.jsx'
import { somar } from '../utils/formatar.js'

export default function Home({ plataforma, trechos, interacoes, resumo, onNavegar }) {
  const emSombra = trechos.filter((trecho) => trecho.cobertura !== 'sinal').length
  const ocorrenciasMes = somar(resumo.ocorrenciasPorRota.valores)

  return (
    <section className="painel">
      <div className="abertura">
        <p className="nota-malha">{plataforma.malha}</p>
        <h2>{plataforma.problemaTitulo}</h2>
        <p className="lead">{plataforma.problemaTexto}</p>
        <p className="meta">
          <strong>Quem usa:</strong> {plataforma.usuario}. {plataforma.resumo}
        </p>
        <p className="acoes">
          <button type="button" className="link-acao" onClick={() => onNavegar('consultas')}>
            Consultar trechos
          </button>
          <button
            type="button"
            className="link-acao secundario"
            onClick={() => onNavegar('interacoes')}
          >
            Ler interações
          </button>
          <button
            type="button"
            className="link-acao secundario"
            onClick={() => onNavegar('sobre')}
          >
            Como funciona
          </button>
        </p>
      </div>

      <dl className="indicadores">
        <div className="ind ind-navy">
          <dt>Trechos monitorados</dt>
          <dd>{trechos.length}</dd>
        </div>
        <div className="ind ind-ambar">
          <dt>Em zona de sombra</dt>
          <dd>{emSombra}</dd>
        </div>
        <div className="ind ind-teal">
          <dt>Comandos ao Elo</dt>
          <dd>{interacoes.length}</dd>
        </div>
        <div className="ind ind-ceu">
          <dt>Ocorrências no recorte</dt>
          <dd>{ocorrenciasMes}</dd>
        </div>
      </dl>

      <div className="cabeca-painel">
        <h3>Painel resumido do recorte</h3>
        <button
          type="button"
          className="link-acao secundario"
          onClick={() => onNavegar('dashboard')}
        >
          Ver o Mapa do Silêncio no Dashboard
        </button>
      </div>
      <PainelGraficos resumo={resumo} />
      <TabelaTrechos trechos={trechos} />
    </section>
  )
}
