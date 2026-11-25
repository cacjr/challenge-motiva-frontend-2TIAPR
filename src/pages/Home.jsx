import PainelGraficos from '../components/PainelGraficos.jsx'
import TabelaTrechos from '../components/TabelaTrechos.jsx'
import { analisarTrecho } from '../utils/analisarTrecho.js'

export default function Home({ plataforma, trechos, ocorrencias, trechoAtual, resumo, onNavegar, onAbrirTrecho }) {
  const emSombra = trechos.filter((trecho) => trecho.cobertura !== 'sinal').length
  const emAberto = ocorrencias.filter((o) => o.status !== 'resolvida')
  const gravesAbertas = emAberto.filter((o) => o.gravidade === 'alta').length
  const atual = trechoAtual ? analisarTrecho(ocorrencias.filter((o) => o.trechoId === trechoAtual.id)) : null

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
          <button type="button" className="link-acao" onClick={() => onNavegar('ocorrencias')}>
            Registrar ocorrência
          </button>
          <button type="button" className="link-acao secundario" onClick={() => onNavegar('elo')}>
            Falar com o Elo
          </button>
          <button type="button" className="link-acao secundario" onClick={() => onNavegar('trechos')}>
            Cadastrar trecho
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
          <dt>Ocorrências em aberto</dt>
          <dd>{emAberto.length}</dd>
        </div>
        <div className="ind ind-ceu">
          <dt>Graves em aberto</dt>
          <dd>{gravesAbertas}</dd>
        </div>
      </dl>

      {trechoAtual && (
        <div className={`trecho-atual-faixa ${atual.alerta ? 'com-alerta' : ''}`}>
          <p>
            <strong>Trecho atual:</strong> {trechoAtual.rodovia} · km {trechoAtual.kmInicial}–{trechoAtual.kmFinal}
            {trechoAtual.referencia && ` · ${trechoAtual.referencia}`} — {atual.total} ocorrências, {atual.abertas} em aberto
            {atual.alerta && <span className="selo selo-gravidade-alta">Alerta</span>}
          </p>
          <button type="button" className="link-acao mini" onClick={() => onNavegar('ocorrencias')}>
            Abrir painel do trecho
          </button>
        </div>
      )}

      <div className="cabeca-painel">
        <h3>Panorama das {resumo.total} ocorrências registradas</h3>
        <button type="button" className="link-acao secundario" onClick={() => onNavegar('dashboard')}>
          Ver o Mapa do Silêncio no Dashboard
        </button>
      </div>
      <PainelGraficos resumo={resumo} />
      <TabelaTrechos
        trechos={trechos}
        ocorrencias={ocorrencias}
        trechoAtualId={trechoAtual?.id}
        onAbrir={onAbrirTrecho}
      />
    </section>
  )
}
