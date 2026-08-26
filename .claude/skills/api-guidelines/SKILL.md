---
name: api-guidelines
model: opus
description: Design da superfície pública de uma biblioteca pelas Rust API Guidelines — o checklist de 11 categorias com os itens C-CASE, C-CONV, C-GETTER, C-WORD-ORDER, C-METHOD, C-CUSTOM-TYPE, C-BUILDER, C-VALIDATE, C-STRUCT-PRIVATE e C-NEWTYPE-HIDE, mais o idioma de interior aninhado com superfície plana. Use ao definir o que um pacote exporta, ao nomear método de conversão ou getter, ao decidir se um argumento deve ser boolean, ou ao avaliar se uma mudança quebra consumidor. Não use para organizar arquivos em pastas — é a skill colocation; nem para escrever o arquivo index — é a skill revelation.
---

# API Guidelines

## O que é

O checklist das *Rust API Guidelines* para projetar a superfície pública de uma
biblioteca — 11 categorias, cada item identificado por um código `C-XXX`.

Vale aqui porque responde a pergunta que uma biblioteca enfrenta e uma aplicação não:
**o que acontece com quem já depende disto quando eu mudar?** Rust é a fonte porque tem o
checklist mais explícito da indústria; os itens ligados ao sistema de tipos do Rust —
traits, ownership, lifetimes — ficam de fora, e o que sobra é sobre qualquer biblioteca.

O catálogo completo dos 11 grupos está em `references/checklist.md`. Aqui está o que se
aplica a este repositório.

## Quando usar

| Situação | Item |
|---|---|
| Decidindo o que um pacote exporta | `C-STRUCT-PRIVATE`, `C-NEWTYPE-HIDE` |
| Nomeando método que converte ou deriva um valor | `C-CONV` |
| Nomeando um getter | `C-GETTER` |
| Duas funções parecidas com ordem de palavra diferente | `C-WORD-ORDER` |
| Um parâmetro é boolean e decide o comportamento | `C-CUSTOM-TYPE` |
| A função tem receptor claro mas é função solta | `C-METHOD` |
| Construção com muitas opções | `C-BUILDER` |
| Entrada pode chegar inválida | `C-VALIDATE` |
| Julgando se uma mudança quebra consumidor | Future Proofing, o grupo inteiro |

**Não use para:** decidir em que pasta o arquivo mora — é `colocation`. Nem para escrever
o arquivo `index` em si — é `revelation`, que é a versão local deste mesmo princípio.

## Como aplicar

### O idioma central: interior aninhado, superfície plana

A prática que sustenta todo o resto. O interior do pacote pode ter a profundidade que
precisar; o que o consumidor escreve é sempre raso, porque o `index` re-exporta.

O ganho é concreto e mensurável: **reorganizar o interior deixa de ser mudança de contrato.**
Quem importa pelo `index` não percebe que a pasta mudou de lugar.

O submódulo só fica público quando a hierarquia **é** parte da API. Caso contrário é
detalhe de implementação, e o re-export existe justamente para escondê-lo.

### Naming — os quatro itens que valem em JavaScript

**`C-CASE`** — casing por nível: tipo em `UpperCamelCase`, valor em `camelCase`, constante
em `SCREAMING_SNAKE_CASE`. A regra fina que quase todos erram: **acrônimo em CamelCase conta
como uma palavra só** — `Uuid`, não `UUID`; `HttpClient`, não `HTTPClient`.

**`C-CONV`** — o prefixo de conversão declara **custo e posse**, não só intenção:

| Prefixo | Custo | Semântica |
|---|---|---|
| `as` | grátis | vista sobre o mesmo dado, sem cópia |
| `to` | caro | produz valor novo, o original continua válido |
| `into` | variável | consome o original, que não deve ser usado depois |

Traduzido para JavaScript: `as` devolve referência ou proxy sobre a mesma estrutura; `to`
aloca e devolve cópia; `into` transfere e invalida a origem. Escolher o prefixo errado é
mentir sobre custo — o leitor confia que `as` é barato.

**`C-GETTER`** — sem prefixo `get`. `first()`, não `getFirst()`. A exceção declarada é o
caso em que há um único valor óbvio a devolver. Coincide com a rule 008 deste repositório,
por caminho diferente: lá o argumento é encapsulamento, aqui é previsibilidade.

**`C-WORD-ORDER`** — ordem de palavras consistente dentro do pacote. A biblioteca padrão do
Rust usa verbo-objeto-erro: `ParseIntError`, `RecvTimeoutError`. Qual ordem importa menos
que **usar sempre a mesma**.

### Predictability — o código faz o que parece que faz

**`C-METHOD`** — função com receptor claro é método, não função solta que recebe o objeto
como primeiro argumento.

**`C-NO-OUT`** — sem parâmetro de saída. Devolva o valor; não receba um objeto para
preencher.

**`C-OVERLOAD`** — sobrecarga de operador não surpreende. Em JavaScript: `toString`,
`valueOf`, `Symbol.toPrimitive` e `Symbol.iterator` devem fazer o óbvio, ou não existir.

**`C-CTOR`** — construtor é método estático inerente. Em JavaScript, `static from(...)` e
`static of(...)`, não uma função de fábrica solta em outro módulo.

### Type Safety — deixe o tipo carregar o significado

**`C-CUSTOM-TYPE`** é o item de maior retorno aqui, e coincide com duas rules:

> Argumentos comunicam significado por **tipo**, não por `boolean` ou `Option`.

`render(node, true)` não diz nada no ponto de chamada. É a rule 037 (proibição de flag
argument) chegando pela porta do sistema de tipos, e a correção é a mesma: ou dois métodos
com nome de intenção, ou um enum congelado.

**`C-NEWTYPE`** — envolver um primitivo num tipo próprio cria distinção estática. É a rule
003 (encapsulamento de primitivos de domínio) com outro nome.

**`C-BUILDER`** — quando a construção tem muitas opções, um builder é melhor que um
construtor de sete parâmetros. Confirma a rule 033 e a exceção de interface fluente da
rule 005.

### Future Proofing — o grupo que só a biblioteca precisa

**`C-STRUCT-PRIVATE`** — campos privados. Campo público é contrato para sempre; em
JavaScript, campo `#` e acesso por método de intenção.

**`C-NEWTYPE-HIDE`** — o newtype encapsula o detalhe de implementação, então trocá-lo não
alcança o consumidor.

**`C-SEALED`** — o contrato protegido contra implementação de fora. Em JavaScript, um
`Symbol` não exportado é o mecanismo mais próximo: quem não tem a chave não implementa.

### Dependability e Debuggability

**`C-VALIDATE`** — a função valida os próprios argumentos, na fronteira. Lançar erro de
domínio, não devolver `null` (rule 027).

**`C-DEBUG`** e **`C-DEBUG-NONEMPTY`** — todo tipo público tem representação legível, e ela
nunca é vazia. Em JavaScript: `toString` ou `Symbol.for('nodejs.util.inspect.custom')` que
diga algo além de `[object Object]`.

### Necessities

**`C-STABLE`** — dependência pública de um pacote estável é ela própria estável. Se o tipo
de terceiro aparece na assinatura, a versão dele virou parte do contrato.

**`C-PERMISSIVE`** — licença do pacote e das dependências é permissiva.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Prefixo de conversão declarando custo e posse (`C-CONV`) | [conversion-name.valid.js](examples/conversion-name.valid.js) | [conversion-name.invalid.js](examples/conversion-name.invalid.js) |
| Ordem de palavras consistente no pacote (`C-WORD-ORDER`) | [word-order.valid.js](examples/word-order.valid.js) | [word-order.invalid.js](examples/word-order.invalid.js) |
| Superfície plana com interior escondido (`C-STRUCT-PRIVATE`) | [flat-surface.valid.js](examples/flat-surface.valid.js) | [flat-surface.invalid.js](examples/flat-surface.invalid.js) |

## Checklist

- [ ] O `index` re-exporta; nenhum consumidor escreve caminho interno
- [ ] Nenhum submódulo público que não seja parte deliberada da API
- [ ] Acrônimo em CamelCase conta como uma palavra (`Uuid`, `HttpClient`)
- [ ] `as` é barato, `to` aloca, `into` consome — e nenhum mente
- [ ] Nenhum getter com prefixo `get` (rule 008)
- [ ] Ordem de palavras igual em todos os nomes análogos do pacote
- [ ] Nenhum argumento boolean decidindo comportamento (rule 037)
- [ ] Primitivo de domínio envolvido em tipo próprio (rule 003)
- [ ] Campos privados com `#`; nada de campo público no contrato
- [ ] Argumentos validados na fronteira, com erro de domínio (rule 027)
- [ ] Todo tipo público tem representação legível e não vazia

## Troubleshooting

### Meu `as` ficou caro depois de uma otimização

**Causa:** o prefixo declara custo, e o custo mudou sem o nome mudar.
**Solução:** renomear para `to` é mudança de contrato — vai no CHANGELOG como breaking. É
desconfortável de propósito: é o sinal de que o nome era uma promessa.

### O consumidor importa pelo caminho interno mesmo com index

**Causa:** o `index` não impede o caminho profundo; ele só oferece o raso.
**Solução:** restringir na ferramenta, não no nome — `noRestrictedImports` no `biome.json`,
ou o campo `exports` do `package.json`, que de fato bloqueia subcaminho não declarado.

### Não sei se a mudança quebra consumidor

**Causa:** a superfície pública não está declarada em lugar nenhum, então tudo o que é
alcançável parece contrato.
**Solução:** o contrato é o que o `exports` do `package.json` e os `index` expõem. O que
não passa por eles é interior, e pode mudar. Se a resposta continua ambígua, é o próprio
sintoma — declare primeiro.

## Referências

- `references/checklist.md` — o catálogo completo das 11 categorias com todos os itens
  `C-XXX`, marcando quais são específicos de Rust e quais atravessam para JavaScript.

## Rules relacionadas

- [008 — Proibição de Getters e Setters](../../rules/008_proibicao-getters-setters.md): `C-GETTER` chega ao mesmo lugar pela previsibilidade, não pelo encapsulamento.
- [037 — Proibição de Argumentos Sinalizadores](../../rules/037_proibicao-argumentos-sinalizadores.md): é `C-CUSTOM-TYPE` — o argumento carrega significado por tipo, nunca por boolean.
- [003 — Encapsulamento de Primitivos de Domínio](../../rules/003_encapsulamento-primitivos.md): é `C-NEWTYPE`, com outro nome e a mesma justificativa.
- [033 — Limite de Parâmetros por Função](../../rules/033_limite-parametros-funcao.md): `C-BUILDER` é a saída prescrita quando a construção passa do limite.
- [027 — Qualidade no Tratamento de Erros](../../rules/027_qualidade-tratamento-erros-dominio.md): `C-VALIDATE` valida na fronteira e lança erro de domínio em vez de devolver nulo.
- [035 — Proibição de Nomes Enganosos](../../rules/035_proibicao-nomes-enganosos.md): o prefixo de conversão que mente sobre custo é desinformação com aparência de convenção.

## Skills relacionadas

- [revelation](../revelation/SKILL.md): reinforces — é a superfície plana desta skill aplicada ao arquivo index.
- [naming](../naming/SKILL.md): complements — `naming` dá a convenção do repositório; esta dá o critério de quem publica para terceiros.
- [package](../package/SKILL.md): depends on — a superfície pública só se decide depois que o recorte do pacote está resolvido.
- [framework-design-guidelines](../framework-design-guidelines/SKILL.md): complements — esta nomeia o que o pacote expõe; `framework-design-guidelines` nomeia o pacote.
- [types](../types/SKILL.md): reinforces — o `types.d.ts` é onde a superfície declarada aqui vira contrato verificável.

---

**Criado em**: 2026-08-25
**Atualizado em**: 2026-08-25
**Versão**: 1.0
