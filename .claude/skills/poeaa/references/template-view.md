# Template View

**Camada:** Web Presentation
**Complexidade:** Simples
**Intenção:** Constrói a resposta HTML embutindo marcadores dentro de uma página de marcação estática, que o motor de template substitui pelos dados dinâmicos.

---

## Quando Usar

- Páginas com estrutura HTML previsível e poucos pontos de variação
- Quando quem escreve o HTML e quem escreve a lógica de negócio são pessoas diferentes

## Quando NÃO Usar

- Lógica de apresentação complexa embutida no template — vira Spaghetti Code disfarçado de HTML (regra 060)

## Estrutura Mínima (exemplo genérico)

```html
<!-- template: user-profile.html -->
<h1>{{ user.name }}</h1>
<p>{{ user.email }}</p>
{{#each user.orders}}
  <li>{{ this.id }} — {{ this.total }}</li>
{{/each}}
```

## Relacionado com

- [transform-view.md](transform-view.md): complementa — trade-off oposto (transforma dado em vez de preencher marcação)
- [two-step-view.md](two-step-view.md): complementa — Two Step View separa o template em dois estágios
- [regra 060 - Proibição de Código Spaghetti](../../../rules/060_proibicao-codigo-spaghetti.md): reforça — lógica de controle não deve se acumular dentro do template

---

**Camada PoEAA:** Web Presentation
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
