# Route Based Splitting

**Categoria:** Carregamento
**Intenção:** Dividir o código pela fronteira de navegação, entregando a cada rota o que
ela precisa.

---

## Quando Usar

- Como primeira divisão, sempre. É a fronteira mais barata de manter porque já existe: a
  navegação é um recorte que o produto entende.
- Quando as rotas têm pesos muito diferentes, e um fluxo raro e pesado penaliza todos.

## Quando NÃO Usar

- Quando a aplicação tem poucas rotas e todas compartilham quase tudo — a divisão produz
  pedaços que sempre viajam juntos.
- Quando a estrutura de pastas não acompanha a navegação. Se uma rota importa de cinco
  outras, a divisão não separa nada, e o problema é de organização, não de empacotamento
  (skill [package-by-feature](../../package-by-feature/SKILL.md)).

## Estrutura Mínima

Cada rota é um ponto de carregamento diferido. O que é comum a todas fica no bundle
compartilhado; o que é da rota, no pedaço dela.

A rota de entrada mais comum merece tratamento próprio: se quase todos chegam por ela,
adiá-la é perder o ganho no caso majoritário.

## O que custa

- Uma transição de rota passa a ter estado de espera, e ele precisa ser tratado em todas.
- O recorte de código passa a depender do recorte de navegação: mudar a navegação move
  código.

## Relacionado a

- [bundle-splitting.md](bundle-splitting.md): depende — é a primeira fronteira dele
- [prefetch.md](prefetch.md): complementa — antecipa a rota provável e elimina a espera da transição
- [package-by-feature](../../package-by-feature/SKILL.md): depende — sem o recorte de pastas correspondente, a divisão não separa nada
- [prpl.md](prpl.md): complementa — o conjunto de decisões em que este pattern é uma peça

---

**Fonte:** patterns.dev — /vanilla/route-based
