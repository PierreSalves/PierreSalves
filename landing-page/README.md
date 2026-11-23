# Landing page — tghservices.com.br

Código do Worker da Cloudflare `tghservices-manutencao`, que atende **tghservices.com.br** e **www.tghservices.com.br**.

A página inicial é a vitrine dos apps da TGH Services, seguida da parte de apps sob medida e do portfólio. O visual segue o Material Design 3, com esquema verde e modo escuro automático.

## Rotas

| Rota | Resposta |
| --- | --- |
| `/` | Página inicial (`public/index.html`), status 200 |
| `/curriculo` | Currículo (`public/curriculo.html`), status 200 |
| `/curriculo/`, `/curriculo.html`, `/index.html` | Redireciona (301) para a rota principal |
| `/img/*`, `/app.js`, `/logo-tghservices.png`, `/robots.txt` | Arquivos estáticos |
| Qualquer outra | Página 404 com `noindex` |

## Incluir um app novo na vitrine

1. Salve as capturas em `public/img/` (de preferência `.webp`, até 1600 px de largura). **Mascare dados pessoais antes**: nomes, e-mails, nomes de clientes e de arquivos.
2. Em `public/index.html`, copie um bloco `<article class="card">` inteiro da vitrine e troque nome, descrição, recursos, tecnologias, links e imagens.
3. Cada `<img>` dentro de `data-shots` vira uma tela do carrossel do card. O texto de `data-label` aparece no selo da imagem.
4. Só use o selo "Código aberto" e o botão "Ver código" se o repositório for público.

## Estrutura

```
landing-page/
├── src/index.js      # lógica de rotas e cabeçalhos de segurança
├── public/           # arquivos estáticos (binding ASSETS)
│   ├── index.html    # vitrine + sob medida + portfólio
│   ├── app.js        # carrosséis
│   └── img/          # capturas dos apps (com dados mascarados)
└── wrangler.jsonc    # configuração do Worker e domínios
```

## Rodar e publicar

```bash
cd landing-page
npm install
npm run dev      # http://localhost:8787
npm run deploy   # publica no Worker tghservices-manutencao (precisa de login: npx wrangler login)
```

O `wrangler.jsonc` já declara os dois domínios (custom domains), então o deploy mantém o roteamento atual.

Para editar o currículo, altere `public/curriculo.html` e publique de novo.
