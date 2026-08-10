---
name: jsdoc
model: sonnet
description: Escreve e revisa JSDoc para classes, funções, variáveis e arquivos de declaração de tipo (.d.ts) em bases JavaScript puro — dois níveis de detalhe conforme o público, mínimo no código de implementação e completo no contrato público. Use quando o usuário pedir para "documentar", "adicionar JSDoc", "documentar os tipos", "escrever doc comments", ou ao criar e editar classes, funções, getters/setters, constructors, static blocks e arquivos types.d.ts que ainda não têm documentação. Não use para desenhar a forma do types.d.ts — use a skill types.
---

# JSDoc

## O que é

A convenção de documentação deste repositório. A decisão central: **dois públicos, dois
níveis de detalhe**. Antes de escrever qualquer comentário, classifique o arquivo.

| Arquivo | Público | Nível de detalhe |
|---|---|---|
| Código de implementação (`.js`, ou `.ts` usado só pela sintaxe de decorator) | Quem mantém esta base | Mínimo — só o que o código não diz |
| `types.d.ts` e declarações escritas à mão | Quem consome daqui de um projeto TypeScript | Completo — contrato público inteiro, exemplos, defaults |

Todo conteúdo de JSDoc gerado é escrito em **inglês**, independente do idioma da conversa.

### Por que existem `.ts` sem tipos aqui

A base é JavaScript puro. Alguns arquivos usam a extensão `.ts` apenas porque a
toolchain precisa dela para interpretar a sintaxe de decorator — não porque o código
seja tipado. Nunca adicione anotações de tipo nesses arquivos, e nunca os trate como
uma base TypeScript. O contrato público de tipos vive separado, em `types.d.ts` escritos
à mão: os autores não tipam o próprio código, tipam a superfície de que os outros
dependem.

## Quando usar

| Situação | Ação |
|---|---|
| Criando classe, método, getter/setter ou função | Abrir `references/internal-code.md` |
| Criando ou editando `types.d.ts` | Abrir `references/public-types.md` |
| Dúvida sobre qual tag usar | Abrir `references/tags-cheatsheet.md` |
| O nome já diz tudo | Não documentar — a ausência é a resposta certa |

Não use esta skill para decidir **o que** entra no `types.d.ts` (quais atributos expor,
como achatar mixins) — isso é a skill `types`. Esta skill trata de **como documentar**
o que já foi decidido.

## Como aplicar

### A regra de ouro

JSDoc não está isento de "comente o porquê, não o quê" (rule 026). A diferença entre os
dois níveis não é quantidade de palavras — é **quem** precisa do porquê:

- **No código interno**, o "o quê" já está no nome e na leitura linear. Documente apenas
  uma decisão, uma invariante, um efeito colateral, ou comportamento não óbvio de
  decorator/mixin que não se vê lendo de cima para baixo.
- **Nos tipos públicos**, o consumidor nunca vê a implementação. Ali o "o quê" *é* a
  informação que falta: o que a propriedade faz, quando usar, o que retorna. Documente
  como se fosse a única fonte de verdade — porque, para quem depende da declaração, é.

### Fluxo

1. Identificar o tipo de arquivo pela tabela acima e abrir o guia correspondente.
2. Para cada construção (classe, método, variável), seguir o template do guia.
3. Nunca documentar o que um nome claro já expressa (rules 034 e 035). Se o nome já é
   claro, um `@remarks` de uma linha basta — ou nada.
4. Não repetir em prosa o que o código torna visível (nomes de parâmetro, retorno óbvio).
5. Autorrevisão: se remover o comentário não perde nenhuma informação que um leitor sem
   contexto precisaria, apague o comentário.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Código interno — só o não óbvio, nunca o redundante | [internal-code.valid.js](examples/internal-code.valid.js) | [internal-code.invalid.js](examples/internal-code.invalid.js) |
| Contrato público — completo, com `@default` e exemplo | [public-types.valid.ts](examples/public-types.valid.ts) | [public-types.invalid.ts](examples/public-types.invalid.ts) |

## Checklist

- [ ] O arquivo foi classificado antes de escrever (interno vs. contrato público)
- [ ] Nenhum `/** Gets the name */` acima de `get name()`
- [ ] Todo conteúdo gerado está em inglês
- [ ] No `types.d.ts`: todo atributo refletido tem descrição e `@default` quando aplicável
- [ ] Nenhuma anotação de tipo adicionada a arquivo `.ts` de implementação
- [ ] Removendo qualquer comentário, perde-se informação real

## Troubleshooting

### O JSDoc ficou maior que o método que documenta

**Causa:** nível de contrato público aplicado a código interno.
**Solução:** conferir a classificação do arquivo. Em implementação, o alvo é o mínimo.

### O consumidor TypeScript não vê a descrição no autocomplete

**Causa:** o JSDoc está no arquivo de implementação, não no `types.d.ts`. O editor lê a
declaração, não a implementação não tipada.
**Solução:** mover a descrição para o `types.d.ts` — é ele que o consumidor enxerga.

### A revisão apontou comentário redundante que "parecia útil"

**Causa:** documentar o "o quê" em código interno.
**Solução:** aplicar o teste da autorrevisão — se apagar não perde informação, apague.
Rules 026 e 062.

## Referências

- `references/internal-code.md` — templates para classe, constructor, getter/setter,
  membro privado, método, static block, função, arrow function, `var`/`let`/`const`.
- `references/public-types.md` — templates para `types.d.ts`, interface, type alias, enum.
- `references/tags-cheatsheet.md` — `@param`, `@returns`, `@throws`, `@default`,
  `@example` e as demais tags, com quando cada uma se aplica.

## Rules relacionadas

- [026 — Qualidade de Comentários: Apenas o Porquê](../../rules/026_qualidade-comentarios-porque.md):
  a regra de ouro desta skill; JSDoc redundante é a violação mais comum dela.
- [062 — Proibição de Código Inteligente](../../rules/062_proibicao-codigo-inteligente-clever-code.md):
  comentário-ruído entra na mesma categoria de poluição.
- [034 — Nomes Consistentes](../../rules/034_nomes-classes-metodos-consistentes.md) e
  [035 — Proibição de Nomes Enganosos](../../rules/035_proibicao-nomes-enganosos.md):
  um nome bom elimina a necessidade do comentário; um nome ruim não se conserta com JSDoc.
- [013 — Segregação de Interfaces](../../rules/013_principio-segregacao-interfaces.md):
  o contrato público documentado é o mesmo que a interface deve manter enxuto.

## Skills relacionadas

- [prose](../prose/SKILL.md): reinforces — o comentário é prosa publicada e responde às mesmas regras.
- [types](../types/SKILL.md): depends on — decide a forma do `types.d.ts`; esta skill documenta o resultado.
- [story](../story/SKILL.md): complements — a `description` de cada `argTypes` reaproveita o texto escrito aqui.
- [clean-code](../clean-code/SKILL.md): reinforces — comentar o porquê é parte da mesma disciplina.
- [codetags](../codetags/SKILL.md): complements — pendência marcada é codetag, não JSDoc.

---

**Criado em**: 2026-08-09
**Atualizado em**: 2026-08-09
**Versão**: 2.0
