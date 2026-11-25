# Landing page — tghservices.com.br

Código do Worker da Cloudflare `tghservices-manutencao`, que atende **tghservices.com.br** e **www.tghservices.com.br**.

A página e o currículo são feitos em **React com Material UI** e funcionam como **template**: cores, seções, ordem, textos, imagens e links são configurados no painel `/admin`, sem novo deploy. O arquivo `app/site.config.js` guarda só a configuração de fábrica, usada enquanto nada foi publicado pelo painel.

Seções disponíveis: abertura, vitrine de apps, diferenciais, serviços, sobre/portfólio, localização (mapa ou Street View do Google), avaliações do Google e contato. Cada uma pode ser ligada, desligada, reordenada e tem duas ou três aparências. Todos os botões de pedido abrem o mesmo formulário, e o pedido chega por e-mail.

## Rotas

| Rota | Resposta |
| --- | --- |
| `/` | Página em React (build do Vite em `dist/`), com a configuração publicada embutida no HTML |
| `/?previa=1` | Mesma página com o **rascunho** (só para quem está logado no painel; usada na prévia ao vivo do editor) |
| `/curriculo` | Currículo em React (`curriculo.html` + `app/curriculo.jsx`), status 200 |
| `/curriculo/`, `/curriculo.html`, `/index.html` | Redireciona (301) para a rota principal |
| `POST /api/pedido` | Recebe o formulário e manda o pedido por e-mail |
| `/admin` | Painel: página, aparência, dados gerais e cards de projetos, com tela de login própria (código por e-mail) |
| `GET /api/projetos` | Cards publicados, em JSON |
| `/api/admin/*` | API do painel (configuração, rascunho, publicar, histórico, cards, imagens, backup) |
| `GET /api/avaliacoes` | Nota e até 5 avaliações do Google do lugar configurado (só com a seção ligada e a chave do Google) |
| `/midia/*` | Imagens enviadas pelo painel (R2) |
| `/assets/*` | JS, CSS e fontes do build, com cache de 1 ano (os nomes têm hash) |
| `/img/*`, `/logo-tghservices.png`, `/robots.txt` | Arquivos estáticos |
| Qualquer outra | Página 404 com `noindex` |

## Estrutura

```
landing-page/
├── app/
│   ├── site.config.js    # configuração de fábrica (vale até a primeira publicação pelo painel)
│   ├── projetosIniciais.js # cards usados se o banco falhar
│   ├── config/           # esquema.js (tipos de seção, layouts, estilos e limpeza dos dados) e contexto.jsx
│   ├── curriculo.config.js # conteúdo do currículo
│   ├── curriculo.jsx     # página do currículo
│   ├── tema.js           # tema Material 3 (algoritmo oficial do Google): estilo, contraste, ajustes, claro e escuro
│   ├── icones.jsx        # nomes de ícones que a configuração pode usar
│   ├── main.jsx          # monta a página na ordem configurada
│   ├── admin/            # telas do painel (Página, Aparência, Geral, Projetos, prévia ao vivo)
│   └── components/       # Topo, Vitrine, Telas, Seções, Localização, Avaliações, Pedido
├── public/               # copiado como está para dist/: imagens, logo, robots.txt
├── src/index.js          # Worker: rotas, cabeçalhos de segurança e /api/pedido
├── src/config.js         # configuração no D1 (rascunho, publicar, histórico) e /api/avaliacoes
├── migrations/           # tabelas do D1 (0003_config.sql: configuração, histórico e contadores)
├── test/                 # testes do Worker (node --test)
├── index.html            # entrada da página inicial (o Worker troca título e descrição pelos publicados no painel)
├── curriculo.html        # entrada do currículo
├── wrangler.jsonc         # Worker do site oficial e domínios
└── wrangler.preview.jsonc # mesma coisa, só no endereço workers.dev, para prévia
```

## Rodar, testar e publicar

```bash
cd landing-page
npm install
npm test                # testes do Worker (validação e envio do pedido)
npm run dev             # build + Worker local em http://localhost:8787
npm run preview:deploy  # publica a prévia em tghservices-landing-preview.<conta>.workers.dev
npm run deploy          # publica o site oficial (precisa de login: npx wrangler login)
```

No `npm run dev` o envio de e-mail é simulado: o conteúdo aparece no terminal e nada é enviado.

## Formulário de pedido (e-mail)

O Worker manda cada pedido pelo binding `EMAIL` do Cloudflare Email Service. É grátis em qualquer plano porque o destino é um endereço verificado no Email Routing da conta.

- `PEDIDO_PARA`: quem recebe (precisa estar verificado em Email Routing > Destination addresses).
- `PEDIDO_DE`: remetente, de um domínio que está no Email Routing (aqui, `site@tghservices.com.br`).
- `PEDIDO_NOME`: nome que aparece como remetente.
- O "Responder" do e-mail vai direto para o visitante.

Proteções: só aceita JSON da própria origem, limita tamanho dos campos, tem um campo escondido contra robôs e escapa o HTML. Se o envio falhar, o formulário mostra o e-mail para o visitante mandar por conta própria.

## Cards de projetos (painel /admin)

Os cards da vitrine ("Apps da TGH") e a lista "Outros projetos" vêm do banco D1 `tghservices-site` e são editados em `/admin`, sem novo deploy. A prévia e o site oficial usam o mesmo banco e o mesmo bucket R2 (`tghservices-site-imagens`, servido em `/midia/*`).

- **Login** (`src/login.js`, `app/admin/Login.jsx`): sem senha. A pessoa digita o e-mail e recebe pelo [Resend](https://resend.com) um código de 6 números, que vale 10 minutos e aceita 5 tentativas. Com o código certo, o Worker cria uma sessão (cookie `HttpOnly`, `SameSite=Strict`, padrão 7 dias em `SESSAO_DIAS`). Códigos e sessões ficam no D1 só como hash. Para um e-mail sem acesso, a tela mostra a mesma mensagem e nada é enviado, assim ninguém descobre quem tem acesso.
- **Quem entra**: os **donos** ficam em `ADMIN_EMAILS` (hoje `tghservices.psa@gmail.com`). Eles sempre entram e, no menu ⋮ > "Quem pode entrar", liberam ou tiram outros e-mails (até 50). Ao tirar um e-mail, a sessão dele termina na hora. Os donos não podem ser tirados pelo painel, então ninguém tranca o dono para fora.
- **E-mail do código**: tem a identidade do site (logo, cores do tema). O remetente é `LOGIN_DE`, num domínio verificado no Resend. A chave fica como segredo **só do Worker de produção**: `RESEND_API_KEY`. Sem a chave (caso da prévia), o Worker manda o código pelo binding `EMAIL` da Cloudflare, que só entrega no endereço verificado em `destination_address`. Na prévia, então, só o dono recebe o código, o que basta para testar.
- **Página**: o Worker põe os cards publicados dentro do HTML de `/`. Se o banco falhar, a página usa os cards de `app/projetosIniciais.js`.
- **Backup**: no painel, menu ⋮ > "Baixar backup" gera um JSON com todos os cards e a configuração da página (as imagens continuam no R2). "Restaurar backup" troca tudo pelo arquivo.
- **Banco novo**: `npx wrangler d1 migrations apply tghservices-site --remote`, depois `node scripts/semente.js > semente.sql` e `npx wrangler d1 execute tghservices-site --remote --file semente.sql` para copiar os cards de `app/projetosIniciais.js`.
- **Rodar o painel na sua máquina**: `npx wrangler d1 migrations apply tghservices-site --local -c wrangler.preview.jsonc`, crie `.dev.vars` com `LOGIN_DEV_MOSTRAR_CODIGO=1` (o código aparece no terminal em vez de ir por e-mail) ou `ADMIN_DEV_EMAIL=seu@email` (entra direto) e rode `npx wrangler dev -c wrangler.preview.jsonc`. Os dois atalhos só valem em `localhost`.
- Telas enviadas pelo painel são reduzidas para até 1920 px e convertidas para WebP. **Mascare dados pessoais antes de enviar.** Só use "Código aberto" se o repositório for público.

## Configurar a página pelo painel

O painel `/admin` tem quatro abas. As três primeiras editam a página, com uma prévia ao vivo ao lado (computador ou celular, claro ou escuro):

- **Página**: "Layout de partida" troca de uma vez a ordem e a aparência das seções (Vitrine de apps, Serviços primeiro, Negócio local, Portfólio pessoal, Página simples) sem apagar textos. Abaixo, cada seção pode subir, descer, ser ligada ou desligada e, ao abrir, escolher a aparência, o texto do menu, a âncora e todo o conteúdo.
- **Aparência**: cor principal (e, se quiser, secundária e terciária), estilo das cores do Material 3, contraste, ajuste à mão de qualquer cor da paleta clara ou escura (com aviso de pouco contraste), modo padrão (claro, escuro ou igual ao aparelho), se o botão de trocar aparece e o arredondamento dos cantos.
- **Geral**: marca e logo, título e descrição para o Google, botão do topo, formulário de pedido (tipos de pedido e textos), e-mail de contato e rodapé.
- **Projetos**: os cards da vitrine e de "Outros projetos" (veja acima).

Cada alteração é salva sozinha como **rascunho**, que só aparece na prévia. O botão **Publicar** leva o rascunho para o site; **Descartar** volta ao que está publicado. As últimas 30 publicações ficam em **Histórico** e podem voltar para o rascunho. Tudo fica no D1 (tabelas `site_config` e `site_config_historico`), e o Worker limpa e valida a configuração antes de salvar e antes de pôr na página: links só `http(s)`, `/`, `#`, `mailto:` e `tel:`; imagens só do próprio site; mapa só do Google.

O backup do menu ⋮ agora leva a configuração (rascunho e publicada) junto com os cards (`formato: "tghservices-site"`, versão 2). Backups antigos, só com cards, ainda são aceitos.

### Localização (mapa ou Street View)

Grátis e sem chave. No Google Maps, abra o lugar (ou o Street View da fachada), toque em Compartilhar > Incorporar um mapa e copie o código. Cole o código inteiro no campo "Mapa ou Street View" da seção Localização: o painel guarda só o endereço `https://www.google.com/maps/embed?...`. Endereço, horários e o link "Como chegar" são campos da mesma seção.

### Avaliações do Google

Mostra a nota, o total e até 5 avaliações do lugar, pela Places API (New) do Google. O Google não deixa guardar as avaliações, então o Worker busca a cada visita que chega na seção e marca de onde vêm, como o Google exige.

1. Na conta Google Cloud **do cliente**, crie um projeto, ative o faturamento e a **Places API (New)**.
2. Em Credenciais, crie uma chave de API e restrinja a chave a "Places API (New)".
3. Guarde a chave como segredo do Worker de produção: `npx wrangler secret put GOOGLE_PLACES_KEY` (ou no painel da Cloudflare: Worker > Settings > Variables and Secrets > Add > Secret). Não cole a chave em arquivo nenhum do repositório.
4. Ache o Place ID do lugar em [developers.google.com/maps/documentation/places/web-service/place-id](https://developers.google.com/maps/documentation/places/web-service/place-id) e cole na seção Avaliações do painel.
5. Ligue a seção e publique.

Custo: cada busca usa o item "Place Details Enterprise + Atmosphere" do Google, com 1.000 por mês grátis (depois, cerca de US$ 25 a cada 1.000). O campo "Limite por mês" (padrão 900) faz o Worker parar de buscar ao chegar no número, contando na tabela `contadores`. Sem chave, acima do limite ou se o Google falhar, a seção mostra só o botão "Ver no Google Maps".

## Fazer uma landing page para um cliente

1. Copie a pasta `landing-page/` para um repositório novo.
2. Se quiser, troque a configuração de fábrica em `app/site.config.js`. Não é obrigatório: depois do passo 5, tudo isso é feito pelo painel.
3. Troque as imagens em `public/img/` e o logo em `public/`. Se não for usar o currículo, apague `curriculo.html`, `app/curriculo*.js*` e a entrada dele no `vite.config.js`.
4. Em `wrangler.jsonc`, troque o nome do Worker, os domínios, `PEDIDO_PARA`, `PEDIDO_DE` e o `destination_address`. Verifique o e-mail do cliente em Email Routing na conta Cloudflare onde o site vai rodar.
5. Monte o painel `/admin` na conta Cloudflare do cliente (passo a passo abaixo).
6. `npm run preview:deploy`, entre em `/admin` da prévia, escolha um layout, preencha as abas Página, Aparência e Geral e clique em Publicar. Com o cliente de acordo, `npm run deploy` (prévia e produção usam o mesmo banco, então a configuração publicada já vale nos dois).

### Painel /admin do cliente

Com o painel, o próprio cliente cria, edita, oculta, reordena e apaga os cards e as telas dele, sem pedir deploy. A Cloudflare entra com o plano gratuito (Workers, D1 e R2). O Resend também tem plano gratuito, de 3.000 e-mails por mês, que sobra para os códigos de login. Faça tudo nas contas do cliente: o site fica com ele depois da entrega.

1. **Banco e imagens**: crie o banco D1 e o bucket R2, cada um com nome próprio do cliente:
   `npx wrangler d1 create <cliente>-site` e `npx wrangler r2 bucket create <cliente>-site-imagens`.
   Em `wrangler.jsonc` e `wrangler.preview.jsonc`, troque `database_name`, `database_id` e `bucket_name`.
2. **Tabelas e cards iniciais**: `npx wrangler d1 migrations apply <cliente>-site --remote` cria as tabelas dos cards, do login e da configuração. Depois rode `node scripts/semente.js > semente.sql` e `npx wrangler d1 execute <cliente>-site --remote --file semente.sql` para copiar os cards de `app/projetosIniciais.js`.
3. **Resend**: na conta do cliente em [resend.com](https://resend.com), adicione o domínio dele em Domains e coloque na Cloudflare os registros DNS que o Resend mostrar (hoje um TXT em `resend._domainkey` e os CNAMEs `send` e `rsend`). Deixe todos como "DNS only" (nuvem cinza). Eles não mexem no e-mail que o cliente já usa. Depois crie uma API key com "Sending access" só para esse domínio. Se o cliente já usa uma chave com acesso a esse domínio em outro sistema, ela pode ser reaproveitada: cada sistema usa o próprio remetente.
4. **Segredo e variáveis do Worker**: `npx wrangler secret put RESEND_API_KEY`, só no Worker de produção. A prévia fica sem a chave e usa o e-mail da Cloudflare (por isso o dono em `ADMIN_EMAILS` precisa ser o mesmo `destination_address`). Nos dois `wrangler*.jsonc`, preencha:
   - `ADMIN_EMAILS`: e-mail do dono (ou donos, separados por vírgula). Pode ser qualquer e-mail, não precisa ser o da conta Cloudflare.
   - `LOGIN_DE`: remetente, por exemplo `Loja do Cliente <login@dominio-do-cliente.com.br>`, no domínio verificado no Resend.
   - `SITE_NOME`: nome que aparece no e-mail do código.
   - `SESSAO_DIAS`: quantos dias a pessoa fica logada (1 a 30).
   O logo do e-mail é o `logo-tghservices.png` do site (troque o arquivo pelo logo do cliente, mantendo o nome, ou ajuste `src/login.js`).
5. **Google (opcional)**: se o cliente quiser avaliações, siga "Avaliações do Google" acima na conta Google dele. O mapa não precisa de nada.
6. **Teste**: abra `/admin` numa janela anônima. Tem que pedir o e-mail, mandar o código só para o e-mail liberado e, depois de entrar, salvar um card e publicar uma mudança de cor que aparecem na página. Libere e tire um e-mail de teste em "Quem pode entrar". Baixe um backup pelo menu ⋮ e entregue ao cliente junto com o site.

Para entregar: o painel não tem link na página, então passe ao cliente o endereço `https://<dominio>/admin` e explique que ele entra com o e-mail de dono, que as mudanças só vão para o site ao clicar em Publicar, e que pode liberar outras pessoas em "Quem pode entrar".
