# Landing page — tghservices.com.br

Código do Worker da Cloudflare `tghservices-manutencao`, que atende **tghservices.com.br** e **www.tghservices.com.br**.

A página é feita em **React com Material UI** e funciona como **template**: todo o texto, a cor, as imagens e os links ficam em um único arquivo, `app/site.config.js`. Para fazer a landing page de um cliente, basta trocar esse arquivo (veja abaixo).

Seções: abertura, vitrine de apps (carrossel de cartões, cada um com carrossel de telas que troca sozinho), sob medida, serviços, portfólio e contato. Todos os botões de pedido abrem o mesmo formulário, e o pedido chega por e-mail.

## Rotas

| Rota | Resposta |
| --- | --- |
| `/` | Página em React (build do Vite em `dist/`), status 200 |
| `/curriculo` | Currículo (`public/curriculo.html`), status 200 |
| `/curriculo/`, `/curriculo.html`, `/index.html` | Redireciona (301) para a rota principal |
| `POST /api/pedido` | Recebe o formulário e manda o pedido por e-mail |
| `/assets/*` | JS, CSS e fontes do build, com cache de 1 ano (os nomes têm hash) |
| `/img/*`, `/logo-tghservices.png`, `/robots.txt` | Arquivos estáticos |
| Qualquer outra | Página 404 com `noindex` |

## Estrutura

```
landing-page/
├── app/
│   ├── site.config.js    # TODO o conteúdo da página (o "template" se resume a este arquivo)
│   ├── tema.js           # tema Material gerado a partir de uma cor (claro e escuro)
│   ├── icones.jsx        # nomes de ícones que o site.config.js pode usar
│   ├── main.jsx          # monta a página
│   └── components/       # Topo, Vitrine, Telas (carrossel), Seções, Pedido (formulário)
├── public/               # copiado como está para dist/: imagens, logo, currículo, robots.txt
├── src/index.js          # Worker: rotas, cabeçalhos de segurança e /api/pedido
├── test/                 # testes do Worker (node --test)
├── index.html            # entrada do Vite (título e descrição vêm do site.config.js)
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

## Incluir um app novo na vitrine

1. Salve as capturas em `public/img/` (de preferência `.webp`, até 1600 px de largura). **Mascare dados pessoais antes**: nomes, e-mails, nomes de clientes e de arquivos.
2. Em `app/site.config.js`, copie um item de `vitrine.apps` e troque nome, descrição, recursos, tecnologias, telas e links.
3. Só use o status "Código aberto" e o link "Ver código" se o repositório for público.

## Fazer uma landing page para um cliente

1. Copie a pasta `landing-page/` para um repositório novo.
2. Troque `app/site.config.js`: marca e logo, `tema.corPrincipal`, textos, vitrine, serviços, portfólio e o e-mail de contato. Seções sem conteúdo podem ser tiradas de `app/main.jsx`.
3. Troque as imagens em `public/img/` e o logo em `public/`. Apague o `curriculo.html` se não for usar.
4. Em `wrangler.jsonc`, troque o nome do Worker, os domínios, `PEDIDO_PARA`, `PEDIDO_DE` e o `destination_address`. Verifique o e-mail do cliente em Email Routing na conta Cloudflare onde o site vai rodar.
5. `npm run preview:deploy` para o cliente aprovar, depois `npm run deploy`.
