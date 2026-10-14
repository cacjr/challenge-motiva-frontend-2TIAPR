# Elo: o agente de voz para que nenhuma ocorrência fique em silêncio

Desafio Motiva · Sprint 1 · FIAP 2TIAPR · 2026

## O problema

> Na BR-163/MS (Motiva Pantanal), quando um colaborador de campo presencia um acidente, ou se acidenta, numa zona sem sinal de celular, a central só fica sabendo quando alguém acha sinal. Esse intervalo não é medido por ninguém.

Os prazos de atendimento (ANTT: atendimento médico em até 15 min) começam a contar **do acionamento**, não do fato. Chamamos de **tempo de silêncio** os minutos entre o fato acontecer e a central saber. O Elo dá nome a esse intervalo, mede onde ele acontece e encurta cada minuto dele.

**Por que importa para a Motiva**
- Em 2025 a Motiva registrou 9 óbitos de trabalho (2 próprios e 7 terceirizados), 8 deles em rodovias. Atropelamento é o principal perigo listado (Relatório de Sustentabilidade 2025).
- A BR-163/MS tem 845 km, cerca de 80% de tráfego comercial e longos trechos sem 4G contínuo (a cobertura total faz parte do novo contrato).
- Satélite direto no celular (Starlink Direct to Cell, SOS da Apple) ainda não está disponível no Brasil, com previsão para 2027. A lacuna é real e tem prazo.
- A Motiva trata "acidente zero" como condição inegociável, e **Segurança** é o primeiro dos seus princípios.

## Quem usa

Colaborador de campo da Motiva Pantanal: inspeção de tráfego, atendimento pré-hospitalar (APH) e equipes de conservação. O motorista da rodovia fica para uma sprint futura.

## A solução: o Elo é um agente de voz

O colaborador **fala** com o Elo, e a palavra de ativação é o próprio nome. O agente roda no aparelho, sem internet, transforma a frase em um registro e lê de volta para confirmar.

| Comando | Exemplo |
|---|---|
| Registrar | "Elo, colisão no km 688, duas vítimas, uma presa." |
| Consultar | "Elo, como está o sinal até o km 700?" |
| Check-in | "Elo, check-in da equipe R03." |
| Anexar | "Elo, manda a foto depois." |
| Pedir socorro | "Elo, socorro." |

**Plano B, quando a voz não dá** (barulho, colaborador desacordado):
- **Botão no colete (LoRa):** 1 toque faz check-in, 2 toques abrem ocorrência, toque longo é SOS.
- **Homem caído automático:** o acelerômetro detecta a queda e o Elo pergunta "Você está bem?". Sem resposta em 30 s, dispara SOS.
- **Toque em 3 telas:** tipo › gravidade › vítimas.

**Depois da fala:**
1. **Autopreenchimento inteligente.** O GPS preenche km, sentido e trecho. A escala do dia preenche colaborador e equipe. O relógio registra a hora **do fato**.
2. **Código Elo.** O registro vira cerca de 50 bytes, por exemplo `E1|688.2|N|COL|ALTA|V2|P1|1432`, e cabe em um SMS ou num pacote LoRa.
3. **Cascata de envio.** 4G → SMS (2G) → LoRa mesh (colete, viaturas, call boxes, bases) → **carona** (*store-and-forward*: o pacote viaja numa viatura até achar sinal) → satélite (2027).
4. **Central e Escudo de Pista.** A central faz o pré-despacho antes de qualquer ligação. As equipes fazem check-in por voz; sem check-in, ou com homem caído, o alerta sobe pela mesma cascata.

**Ligação com os princípios da Motiva:**
- **Segurança:** mede e reduz o minuto invisível.
- **Simplicidade:** registrar falando, sem digitar.
- **Servir a Sociedade:** socorro mais cedo onde a malha é mais isolada.
- **Excelência:** uma métrica nova e auditável.

## O que esta Sprint 1 entrega

A plataforma **consulta**, não cadastra. Tudo vem de arrays fixos em `src/data/`. O agente de voz **não existe ainda**: ninguém ouve o microfone e as respostas são texto fixo escrito nos arrays.

| Tela | O que faz | De onde vêm os dados |
|---|---|---|
| **Início** | Problema, quem usa, 4 indicadores, **painel resumido** (barras de entrada, pizza e velocímetros) e tabela de leitura rápida | `plataforma.js`, `trechos.js`, `interacoes.js`, `resumoDashboard.js` |
| **Consultas** | Lista os trechos da BR-163/MS com cobertura, situação e silêncio médio | `trechos.js` |
| **Interações** | Comandos simulados ao Elo, com resposta, Código Elo, rota e minutos de silêncio. Os itens de plano B aparecem marcados | `interacoes.js` |
| **Dashboard** | A **análise completa**: o Mapa do Silêncio em destaque (só aparece aqui) e uma frase de leitura embaixo de cada gráfico (campo `leitura` nos dados) | `resumoDashboard.js` |
| **Como funciona** *(além do pedido)* | Comandos de voz, plano B, autopreenchimento, Código Elo, cascata e princípios | `comoFunciona.js` |

### Fluxo de dados: um dono só

O `App.jsx` é o **único** arquivo que importa de `src/data/`. Ele repassa tudo por props: `plataforma` para o Layout e a Home, `trechos` e `interacoes` para as telas, `resumo` para a Home, o Dashboard e o PainelGraficos, e `conteudo` para a tela Como funciona. Na Sprint 2, trocar um array por `useState` muda só o App.

### De onde vem cada número

**Indicadores da Início:**

| Indicador | Cálculo |
|---|---|
| Trechos monitorados | `trechos.length` |
| Em zona de sombra | Trechos com `cobertura` diferente de `'sinal'` |
| Comandos ao Elo | `interacoes.length` |
| Ocorrências no recorte | Soma de `resumo.ocorrenciasPorRota.valores` (40) |

**Atenção:** as 40 ocorrências são um **recorte simulado de outubro**. Elas não são as linhas da tabela de trechos nem as interações. Os três primeiros números contam linhas dos arrays; o último conta o recorte dos gráficos.

**Gráficos (`src/data/resumoDashboard.js`):**

| Gráfico | Tipo | Pergunta que responde |
|---|---|---|
| **Mapa do Silêncio** *(além do pedido, só no Dashboard)* | Barras por faixa de km | Onde a malha fica muda? Minutos médios entre o fato e a central. Barras em âmbar passam de 10 min (`limiteMin`). |
| Como o registro começou | Barras | A voz é mesmo o caminho principal? Voz 29, Botão 5, Homem caído 3, Toque 3 (total 40). |
| Por onde o registro chegou | Pizza | Quanto da malha depende de algo além do 4G? 4G 17, SMS 8, LoRa 9, Carona 6 (total 40). |

As barras de canal e a pizza contam **as mesmas 40 ocorrências**, partidas de dois jeitos. O Mapa do Silêncio é uma média por faixa, não uma contagem.

**Velocímetros:**

| Velocímetro | O que mede |
|---|---|
| Dentro de 15 min, contando do fato | 62% das ocorrências. É a régua da ANTT, mas contada desde o fato. |
| Silêncio médio | 14 min no recorte. A meta do Elo é até 5. |
| Equipes com check-in em dia | 11 de 13 frentes de serviço ativas. |

### Valores usados nos dados

- `cobertura`: `sinal`, `sombra parcial`, `sombra total`
- `canal`: `voz` (caminho principal), `botao`, `toque`, `automatico` (plano B)

## Acessibilidade

- A marca é o `<h1>`, e cada tela tem o seu `<h2>`.
- O link "Pular para o conteúdo" é o primeiro item do Tab.
- O menu marca a tela atual com `aria-current="page"`. Ao trocar de tela, o foco vai para o conteúdo novo.
- Barras e pizza têm `role="img"` e uma descrição em texto com todos os números (`descreverSerie` em `utils/formatar.js`). No velocímetro o número já está em HTML, então o desenho fica escondido do leitor de tela.
- As tabelas têm `<caption>` e `scope="col"`.
- Com `prefers-reduced-motion`, os gráficos aparecem sem animação.
- O foco é visível em todos os botões e links.

## Malha representada

BR-163/MS, Motiva Pantanal (ex-MSVia). Os km são aproximados; situações, cobertura e minutos são **simulados para a aula** e não são boletim oficial da Motiva.

## Paleta

Cores em `:root` de `src/index.css`. O azul índigo é inspirado na marca Motiva de 2025, e o âmbar sinaliza alerta. Não usamos logo nem identidade oficial.

## O que ficou para a próxima sprint

- Os comentários `// TODO Sprint 2:` estão no código.
- Trechos, trecho atual e ocorrências passam a viver em estado no `App.jsx`, num único objeto no `localStorage`.
- Formulário de ocorrência, que será a versão "toque em 3 telas", com `trechoId`, tipo, gravidade, status e **hora do fato**.
- Filtro, selo de gravidade e `analisarTrecho` (total, graves, tipo frequente, **silêncio médio** e alerta).
- Futuro, fora do escopo do front: reconhecimento de voz real, protocolo do Código Elo, rede LoRa e canal do motorista.

## Como rodar

**Requisito: Node.js 20.19+ ou 22.12+.** O Vite 8 não roda em Node 18. Confira com `node -v`. O arquivo `.nvmrc` indica o Node 22 para quem usa nvm.

```bash
npm install
npm run dev
```

Abra a URL que aparecer no terminal (padrão http://localhost:5173). Para gerar a build: `npm run build`.

Stack: React 19, Vite 8, Chart.js e react-chartjs-2. Sem React Router: a navegação é por `useState`.

## Estrutura

```
src/
  components/  Header, Nav, Layout, CardTrecho, CardInteracao,
               GraficoBarras, GraficoPizza, GraficoGauge, PainelGraficos, TabelaTrechos
  pages/       Home, Consultas, Interacoes, Dashboard, ComoFunciona
  data/        plataforma, trechos, interacoes, resumoDashboard, comoFunciona
  utils/       formatar (formatarData, somar, coresPorLimite), charts
```

## Integrantes e contribuições

Cada linha descreve o que a pessoa **de fato** commitou. O histórico do Git confirma.

| Integrante | RM | Contribuição |
|---|---|---|
| Claudio Alves | 568565 | Base do projeto (React + Vite, componentes, telas, dados e gráficos), pesquisa sobre a Motiva, README, fluxo de dados centralizado no App, reposicionamento do Elo como agente de voz e acessibilidade |
| Erick Miguel | 564896 | 7º trecho (Coxim, km 720–760) em `trechos.js` e links das fontes no README |
| Gustavo Duarte | 567066 | Comando de voz sobre neblina no km 330 (`i-8`) e correção do alcance LoRa da `i-7` em `interacoes.js` |
| Leonardo Pereira | 567836 | 4º velocímetro (registros por voz) em `resumoDashboard.js` e unidade "min" no Mapa do Silêncio para leitor de tela |
| Sarah Marangoni | 566764 | Centralização das cores em `utils/cores.js` e novo princípio da Motiva ligado ao Elo em `comoFunciona.js` |

## Fontes

- Motiva: princípios e propósito. https://www.motiva.com.br/motiva/sobre-a-motiva/
- Relatório de Sustentabilidade 2025 (óbitos e TFCA, GRI 403-9).
- Motiva Pantanal: sobre a concessão. https://rodovias.motiva.com.br/pantanal/sobre/sobre-msvia/
- ANTT: Ofício Circular 694/2025 (tempos de atendimento).
- Movimento Afaste-se (ABCR), sobre a proteção de equipes em pista.
