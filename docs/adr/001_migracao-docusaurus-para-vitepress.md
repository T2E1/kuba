# ADR-001 — Migração de Docusaurus para VitePress

**Status:** Aceito
**Data:** 2026-09-22

---

## Contexto

O site publicado em `website/` roda hoje sobre Docusaurus 3.10.2
(`website/package.json:11`), com React 19 e o preset clássico
(`website/package.json:13`). São 59 páginas `.mdx` sob `website/docs/`, mais
as traduções pt-BR e espanhol em `website/i18n/`.

Nenhum recurso do pipeline de plugins do Docusaurus que justificaria manter
sua complexidade está em uso hoje: não há versionamento de docs configurado
(nenhum `versioned_docs/` ou `versions.json` no diretório), e não há Algolia
DocSearch configurado (`docusaurus.config.js` não referencia `algolia`). O
que o site usa de fato é Markdown puro mais um plugin remark próprio,
`website/src/remark/preview-plugin.js`, que renderiza os blocos ```` ```html
preview ```` ao vivo — convenção usada em pelo menos 5 páginas de
`website/docs/components/`.

A home de hoje não é a página padrão do Docusaurus: `website/docs/README.mdx:1-3`
carrega `slug: /`, então a home atual já é uma página de docs comum, e já
contém o exemplo de busca de raça de cachorro (`website/docs/README.mdx:9-16`).
A decisão de construir uma landing no formato do typesafe.ai (hero, narrativa
de categoria, playground) exige personalização de layout que o Docusaurus
resolve via *swizzle* — sobrescrever componentes internos do tema, um
mecanismo frágil a upgrades da ferramenta.

Ao mesmo tempo, o restante do repositório já usa Vite como build tool
(`vite.config.js` na raiz, `vite: ^6.3.5` em `package.json:80`). O Docusaurus
roda sua própria pipeline de build (Webpack por padrão, ou Rspack via
`@docusaurus/faster`, `website/package.json:12`) — uma segunda cadeia de
build, paralela à que já constrói os componentes, com nenhum reaproveitamento
entre as duas.

Este já é o segundo êxodo de ferramenta de documentação do projeto: os
scripts em `website/scripts/migrate-docs.mjs` registram a migração anterior,
de Docsify para Docusaurus — evidência de que migração de site de docs é um
evento conhecido e absorvível neste repositório, não uma primeira vez às
cegas.

## Decisão

Migrar `website/` de Docusaurus para VitePress.

VitePress usa Vite como base de build, o que unifica a cadeia de build do
site de documentação com a que já constrói `src/` e `packages/`. Ele é
Markdown-first, com Vue como camada opcional só onde há interatividade real —
sem exigir React nem um pipeline de tema paralelo. A home custom desejada é
um `index.md` com `layout: home` ou um componente Vue direto, sem swizzle.

## Alternativas Consideradas

| Alternativa | Prós | Contras |
|---|---|---|
| VitePress (escolhida) | Vite nativo — mesma cadeia de build do resto do repo; Markdown puro; landing custom sem swizzle; build mais leve | i18n exige roteamento manual por idioma; sem plugin de busca embutido (precisa configurar); plugin de preview precisa ser reescrito para markdown-it |
| Manter Docusaurus | Zero esforço de migração; versionamento e Algolia disponíveis caso venham a ser necessários | Nenhum dos dois recursos está em uso hoje; mantém uma segunda cadeia de build (Webpack/Rspack) redundante com o Vite já usado no repo; swizzle necessário para a landing custom |
| Site estático via Astro | Controle total de layout; ecossistema de integrações amplo | Descarta a estrutura de sidebar e roteamento por `docs/` que os 59 arquivos já têm pronta; maior esforço de migração que VitePress, sem ganho equivalente de consistência de tooling |

## Consequências

### Positivas

- Uma única ferramenta de build (Vite) para componentes e site de
  documentação, em vez de duas cadeias paralelas
- Build do site mais rápido e mais leve, sem o runtime de React só para
  renderizar Markdown
- Landing page no formato desejado (hero, narrativa, playground) sem
  depender de swizzle
- Markdown mais simples de manter — menos superfície de recursos MDX que
  este projeto nunca usou de fato

### Negativas / Trade-offs

- O plugin de preview ao vivo (`website/src/remark/preview-plugin.js`)
  precisa ser reescrito: Docusaurus usa remark/unified, VitePress usa
  markdown-it — os dois ecossistemas de plugin não são compatíveis entre si
- i18n do Docusaurus é *batteries included*; em VitePress, o roteamento
  `/pt-br/` e `/es/` e a troca de idioma no tema precisam ser configurados à
  mão
- As 59 páginas `.mdx` precisam ser revisadas na migração — seis delas usam
  JSX real (`className=`, `style={{…}}`) que precisa virar `class`/`style`
  string, além da mudança de extensão e front matter
- Se a necessidade de versionamento de docs ou busca via Algolia surgir no
  futuro, VitePress exige configuração manual onde o Docusaurus oferecia
  pronto

## Relacionado a

- arc42 §4 — Solution Strategy: escolha de ferramenta de build único para
  componentes e documentação

---

**Autor:** deMGoncalves
