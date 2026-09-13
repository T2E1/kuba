# ✅ A rule exige o limite; a skill ensina a forma

Incorreto em: `rule-teaches-syntax.invalid.md`

**`rules/033_limite-parametros-funcao.md`** fica só com o limite verificável:

```markdown
## Objective Criteria

- [ ] Funções e métodos não devem ter mais de **3** parâmetros.
- [ ] Para mais de 3 parâmetros, um objeto de parâmetro (DTO ou Value
  Object) deve ser criado para agrupar os dados.
```

**`skills/calisthenics/references/parameter-object.md`** fica com o
procedimento — como extrair, que nome dar, quando um DTO vira Value
Object:

```markdown
1. Agrupe os parâmetros que sempre aparecem juntos num objeto nomeado
   pelo conceito que representam (`ShippingAddress`, não `Params`).
2. Se o objeto carrega validação própria, é Value Object (rule 003), não
   um DTO solto.
3. Exemplo: `calculateShipping(street, city, zip, country)` vira
   `calculateShipping(address)`, com `address` sendo `ShippingAddress`.
```

## Por que a divisão funciona

| Pergunta | Quem responde |
|---|---|
| Posso ter 5 parâmetros? | A rule — não, o limite é 3 |
| Como transformo 5 parâmetros em um objeto? | A skill — o procedimento com exemplo |
| O objeto novo precisa de validação? | A skill remete de volta à rule 003 |

A rule nunca mostra como extrair um Parameter Object — isso obrigaria
reescrevê-la a cada linguagem ou convenção nova. A skill nunca define o
limite numérico — isso duplicaria o critério em dois lugares que podem
divergir.
