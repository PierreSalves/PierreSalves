# Landing page — tghservices.com.br

Código do Worker da Cloudflare `tghservices-manutencao`, que atende **tghservices.com.br** e **www.tghservices.com.br**.

A página e o currículo são feitos em **React com Material UI** e funciona como **template**: todo o texto, a cor, as imagens e os links ficam em um único arquivo, `app/site.config.js`. Para fazer a landing page de um cliente, basta trocar esse arquivo (veja abaixo).

Seções: abertura, vitrine de apps (carrossel de cartões, cada um com carrossel de telas que troca sozinho), sob medida, serviços, portfólio e contato. Todos os botões de pedido abrem o mesmo formulário, e o pedido chega por e-mail.

## Rotas

| Rota | Resposta |
| --- | --- |
| `/` | Página em React (build do Vite em `dist/`), status 200 |
| `/curriculo` | Currículo em React (`curriculo.html` + `app/curriculo.jsx`), status 200 |
| `/curriculo/`, `/curriculo.html`, `/index.html` | Redireciona (301) para a rota principal |
| `POST /api/pedido` | Recebe o formulário e manda o pedido por e-mail |
| `/admin` | Painel dos cards de projetos, com tela de login própria (código por e-mail) |
| `GET /api/projetos` | Cards publicados, em JSON |
| `/api/admin/*` | API do painel (criar, editar, ocultar, ordenar, apagar, imagens, backup) |
| `/midia/*` | Imagens enviadas pelo painel (R2) |
| `/assets/*` | JS, CSS e fontes do build, com cache de 1 ano (os nomes têm hash) |
| `/img/*`, `/logo-tghservices.png`, `/robots.txt` | Arquivos estáticos |
| Qualquer outra | Página 404 com `noindex` |

## Estrutura

```
landing-page/
├── app/
│   ├── site.config.js    # TODO o conteúdo da página (o "template" se resume a este arquivo)
│   ├── curriculo.config.js # conteúdo do currículo
│   ├── curriculo.jsx     # página do currículo
│   ├── tema.js           # tema Material 3 gerado de uma cor (algoritmo oficial do Google, claro e escuro)
│   ├── icones.jsx        # nomes de ícones que o site.config.js pode usar
│   ├── main.jsx          # monta a página
│   └── components/       # Topo, Vitrine, Telas (carrossel), Seções, Pedido (formulário)
├── public/               # copiado como está para dist/: imagens, logo, robots.txt
├── src/index.js          # Worker: rotas, cabeçalhos de segurança e /api/pedido
├── test/                 # testes do Worker (node --test)
├── index.html            # entrada da página inicial (título e descrição vêm do site.config.js)
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
- **E-mail do código**: tem a identidade do site (logo, cores do tema). O remetente é `LOGIN_DE`, num domínio verificado no Resend. A chave fica como segredo do Worker: `RESEND_API_KEY`.
- **Página**: o Worker põe os cards publicados dentro do HTML de `/`. Se o banco falhar, a página usa `vitrine.apps` e `portfolio.projetos.itens` do `site.config.js`.
- **Backup**: no painel, menu ⋮ > "Baixar backup" gera um JSON com todos os cards (as imagens continuam no R2). "Restaurar backup" troca tudo pelo arquivo.
- **Banco novo**: `npx wrangler d1 migrations apply tghservices-site --remote`, depois `node scripts/semente.js > semente.sql` e `npx wrangler d1 execute tghservices-site --remote --file semente.sql` para copiar os cards do `site.config.js`.
- **Rodar o painel na sua máquina**: `npx wrangler d1 migrations apply tghservices-site --local -c wrangler.preview.jsonc`, crie `.dev.vars` com `LOGIN_DEV_MOSTRAR_CODIGO=1` (o código aparece no terminal em vez de ir por e-mail) ou `ADMIN_DEV_EMAIL=seu@email` (entra direto) e rode `npx wrangler dev -c wrangler.preview.jsonc`. Os dois atalhos só valem em `localhost`.
- Telas enviadas pelo painel são reduzidas para até 1920 px e convertidas para WebP. **Mascare dados pessoais antes de enviar.** Só use "Código aberto" se o repositório for público.

## Fazer uma landing page para um cliente

1. Copie a pasta `landing-page/` para um repositório novo.
2. Troque `app/site.config.js`: marca e logo, `tema.corPrincipal`, textos, vitrine, serviços, portfólio e o e-mail de contato. Seções sem conteúdo podem ser tiradas de `app/main.jsx`.
3. Troque as imagens em `public/img/` e o logo em `public/`. Se não for usar o currículo, apague `curriculo.html`, `app/curriculo*.js*` e a entrada dele no `vite.config.js`.
4. Em `wrangler.jsonc`, troque o nome do Worker, os domínios, `PEDIDO_PARA`, `PEDIDO_DE` e o `destination_address`. Verifique o e-mail do cliente em Email Routing na conta Cloudflare onde o site vai rodar.
5. Monte o painel `/admin` na conta Cloudflare do cliente (passo a passo abaixo).
6. `npm run preview:deploy` para o cliente aprovar, depois `npm run deploy`.

### Painel /admin do cliente

Com o painel, o próprio cliente cria, edita, oculta, reordena e apaga os cards e as telas dele, sem pedir deploy. A Cloudflare entra com o plano gratuito (Workers, D1 e R2). O Resend também tem plano gratuito, de 3.000 e-mails por mês, que sobra para os códigos de login. Faça tudo nas contas do cliente: o site fica com ele depois da entrega.

1. **Banco e imagens**: crie o banco D1 e o bucket R2, cada um com nome próprio do cliente:
   `npx wrangler d1 create <cliente>-site` e `npx wrangler r2 bucket create <cliente>-site-imagens`.
   Em `wrangler.jsonc` e `wrangler.preview.jsonc`, troque `database_name`, `database_id` e `bucket_name`.
2. **Tabelas e cards iniciais**: `npx wrangler d1 migrations apply <cliente>-site --remote` cria as tabelas dos cards e do login. Depois rode `node scripts/semente.js > semente.sql` e `npx wrangler d1 execute <cliente>-site --remote --file semente.sql` para copiar os cards do `site.config.js`.
3. **Resend**: na conta do cliente em [resend.com](https://resend.com), adicione o domínio dele em Domains e coloque na Cloudflare os registros DNS que o Resend mostrar (SPF e DKIM, num subdomínio como `send.<dominio>`). Eles não mexem no e-mail que o cliente já usa. Depois crie uma API key com "Sending access" só para esse domínio.
4. **Segredo e variáveis do Worker**: `npx wrangler secret put RESEND_API_KEY` (rode de novo com `-c wrangler.preview.jsonc` para a prévia). Nos dois `wrangler*.jsonc`, preencha:
   - `ADMIN_EMAILS`: e-mail do dono (ou donos, separados por vírgula). Pode ser qualquer e-mail, não precisa ser o da conta Cloudflare.
   - `LOGIN_DE`: remetente, por exemplo `Loja do Cliente <login@dominio-do-cliente.com.br>`, no domínio verificado no Resend.
   - `SITE_NOME`: nome que aparece no e-mail do código.
   - `SESSAO_DIAS`: quantos dias a pessoa fica logada (1 a 30).
   O logo do e-mail é o `logo-tghservices.png` do site (troque o arquivo pelo logo do cliente, mantendo o nome, ou ajuste `src/login.js`).
5. **Teste**: abra `/admin` numa janela anônima. Tem que pedir o e-mail, mandar o código só para o e-mail liberado e, depois de entrar, salvar um card que aparece na página. Libere e tire um e-mail de teste em "Quem pode entrar". Baixe um backup pelo menu ⋮ e entregue ao cliente junto com o site.

Para entregar: o painel não tem link na página, então passe ao cliente o endereço `https://<dominio>/admin` e explique que ele entra com o e-mail de dono e pode liberar outras pessoas em "Quem pode entrar".
