# Landing page — tghservices.com.br

Código do Worker da Cloudflare `tghservices-manutencao`, que atende **tghservices.com.br** e **www.tghservices.com.br**.

Hoje o site está em modo manutenção: logo, aviso "Em manutenção" e atalhos para o **Controle de Presença** e o **Currículo**.

## Rotas

| Rota | Resposta |
| --- | --- |
| `/curriculo` | Currículo (`public/curriculo.html`), status 200 |
| `/curriculo/`, `/curriculo.html` | Redireciona (301) para `/curriculo` |
| `/robots.txt` | `public/robots.txt`, status 200 |
| `/logo-tghservices.png` | Logo, status 200 |
| Qualquer outra | Página de manutenção (`public/index.html`), status 503 com `Retry-After` e `noindex` |

## Estrutura

```
landing-page/
├── src/index.js      # lógica de rotas e cabeçalhos de segurança
├── public/           # arquivos estáticos (binding ASSETS)
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
