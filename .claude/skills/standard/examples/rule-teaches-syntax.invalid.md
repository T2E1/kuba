# ❌ A rule vira tutorial — ensina sintaxe que devia estar na skill

Correto em: `rule-teaches-syntax.valid.md`

```markdown
## rules/033_limite-parametros-funcao.md

### Objective Criteria

- [ ] Funções e métodos não devem ter mais de 3 parâmetros.
- [ ] Para agrupar os parâmetros, crie uma classe como no exemplo:

  \`\`\`typescript
  class ShippingAddress {
    constructor(street, city, zip, country) { ... }
  }

  function calculateShipping(address: ShippingAddress) { ... }
  \`\`\`

  Nomeie a classe pelo conceito de domínio. Se precisar de validação,
  adicione no construtor. Considere se o objeto deveria ser imutável.
```

## Por que não serve

- **A rule passou a ensinar procedimento.** "Nomeie pelo conceito",
  "considere se deveria ser imutável" são passos de como fazer — isso é
  skill, não limite.
- **Toda rule que cresce assim duplica uma skill que já existe**
  (`calisthenics/references/parameter-object.md` já ensina exatamente
  isso) — agora há duas fontes que podem divergir.
- **A rule fica ilegível como limite.** Quem consulta a rule para saber
  "posso ter 4 parâmetros?" precisa ler um tutorial inteiro para achar
  o "não" no meio do exemplo.
- **Sintoma clássico do CLAUDE.md**: "a mesma tabela de decisão em dois
  lugares, divergindo até uma delas dar a resposta errada."
