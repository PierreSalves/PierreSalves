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
| `/admin` | Painel dos cards de projetos (só com login do Cloudflare Access) |
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

- **Login**: o Cloudflare Access protege `/admin` e `/api/admin/*` e só libera os e-mails da política (hoje só `tghservices.psa@gmail.com`, com código enviado por e-mail). O Worker confere de novo o token do Access (`ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`) e o e-mail (`ADMIN_EMAILS`); sem essas variáveis ninguém entra.
- **Página**: o Worker põe os cards publicados dentro do HTML de `/`. Se o banco falhar, a página usa `vitrine.apps` e `portfolio.projetos.itens` do `site.config.js`.
- **Backup**: no painel, menu ⋮ > "Baixar backup" gera um JSON com todos os cards (as imagens continuam no R2). "Restaurar backup" troca tudo pelo arquivo.
- **Banco novo**: `npx wrangler d1 migrations apply tghservices-site --remote`, depois `node scripts/semente.js > semente.sql` e `npx wrangler d1 execute tghservices-site --remote --file semente.sql` para copiar os cards do `site.config.js`.
- **Rodar o painel na sua máquina**: crie `.dev.vars` com `ADMIN_DEV_EMAIL=seu@email` e rode `npx wrangler dev -c wrangler.preview.jsonc` (o atalho só vale em `localhost`).
- Telas enviadas pelo painel são reduzidas para até 1920 px e convertidas para WebP. **Mascare dados pessoais antes de enviar.** Só use "Código aberto" se o repositório for público.

## Fazer uma landing page para um cliente

1. Copie a pasta `landing-page/` para um repositório novo.
2. Troque `app/site.config.js`: marca e logo, `tema.corPrincipal`, textos, vitrine, serviços, portfólio e o e-mail de contato. Seções sem conteúdo podem ser tiradas de `app/main.jsx`.
3. Troque as imagens em `public/img/` e o logo em `public/`. Se não for usar o currículo, apague `curriculo.html`, `app/curriculo*.js*` e a entrada dele no `vite.config.js`.
4. Em `wrangler.jsonc`, troque o nome do Worker, os domínios, `PEDIDO_PARA`, `PEDIDO_DE` e o `destination_address`. Verifique o e-mail do cliente em Email Routing na conta Cloudflare onde o site vai rodar.
5. `npm run preview:deploy` para o cliente aprovar, depois `npm run deploy`.
