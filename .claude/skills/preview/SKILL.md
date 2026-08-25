---
name: preview
model: sonnet
description: Decide o que de um componente merece ser demonstrado e produz a demonstração nos dois lugares onde ela vive — o bloco ```html preview da página em website/docs/components/, que roda ao vivo contra o pacote publicado, e o teste de interação que prova cada evento documentado. Cobre a estrutura da página de componente, a hierarquia de variantes, cor como semântica, composição pai/filho e os pares do's/don'ts. Use ao documentar um componente novo, ao decidir quais estados mostrar, ao escrever a seção "when not to use" ou ao provar que um evento é realmente disparado. Não use para definir o contrato do componente — é a skill types.
---

# Preview

## O que é

A ponte entre o contrato de um componente e alguém conseguir vê-lo funcionando. As skills
`types` e `jsdoc` decidem **qual é** o contrato público; esta decide **o que dele merece
ser mostrado**, e onde.

Neste repositório a demonstração vive em dois lugares, e os dois transcrevem o mesmo
`types.d.ts`:

| Onde | O que prova | Quem escreve |
|---|---|---|
| ` ```html preview ` em `website/docs/components/<nome>.mdx` | Que o componente aparenta e se comporta como descrito | agent `writer` |
| `packages/<categoria>/<nome>/<nome>.test.js` | Que cada evento documentado é mesmo disparado | agent `tester` |

Um fato do repositório molda todo o resto: **os exemplos da página rodam contra o pacote
publicado no npm**, carregado do jsDelivr numa versão pinada. Não contra o código-fonte
local. Um exemplo com atributo que não existe na versão pinada aparece quebrado na página
para todo mundo — o que é uma qualidade, não um defeito: uma regressão vira exemplo morto
em vez de teste verde contra código que só existe na máquina de quem escreveu.

## Quando usar

| Situação | Ação |
|---|---|
| Pacote com `types.d.ts` e sem página em `website/docs/components/` | Escrever a página completa |
| Componente ganhou atributo ou variante | Atualizar a página na mesma mudança |
| Componente documenta um evento disparado | Garantir o teste de interação que o prova |
| Pedido de "quando usar / quando não usar" | Escrever as duas seções, com a mesma atenção |
| Demonstração atravessa mais de um componente | `website/docs/build-ui/` ou o cookbook, não a página do componente |
| Definir que atributo o componente aceita | ❌ Não é aqui — skill `types` |
| Escrever a prosa da página | Complementar — skill `prose` decide como a frase soa |

Não invente estado, variante ou cor que o componente não implementa. A página transcreve
o `types.d.ts` e o `style.js`; nunca os antecipa.

## Como aplicar

1. **Ler o `types.d.ts` e o `style.js`.** O primeiro dá atributos, propriedades e eventos;
   o segundo dá os estados reais, em `:host(:state(...))`. O que não estiver num dos dois
   não existe.
2. **Escrever o parágrafo de propósito**, que diz o que o componente faz **e o que ele não
   faz** — a fronteira é onde o leitor mais erra.
3. **Abrir com um bloco ` ```html preview `** logo depois do propósito, mostrando o caso
   mais comum e as variantes principais lado a lado.
4. **Escrever `## When to use` e `## When not to use`.** A segunda é a que prova que a
   página foi pensada: diz qual é o componente certo quando este parece servir e não é,
   com link. Todo design system maduro tem essa seção; documentação gerada nunca tem.
5. **Uma seção por atributo que carrega uma regra**, nomeada pela pergunta que responde,
   não pelo nome cru do atributo. Atributo que é só opção fica na tabela, sem seção.
6. **Escrever `## States and accessibility`** — o que o elemento publica em
   `internals.states`, o nome acessível que ele exige, a pré-condição não óbvia.
7. **Fechar com a tabela de do's and don'ts**, pareada linha a linha: a linha 1 da coluna
   `Do` e a linha 1 da coluna `Don't` tratam do mesmo aspecto. Três a cinco pares bastam.
8. **Garantir o teste de interação** de cada evento que a página menciona. Página que
   documenta um evento sem teste que o exercite documenta uma intenção, não um fato.
9. **Propagar para as traduções** quando a página estiver no escopo traduzido, e conferir
   a versão pinada antes de documentar comportamento recente.

A estrutura completa da página, seção a seção, está em
[estrutura-da-pagina.md](references/estrutura-da-pagina.md). Os três eixos que quase todo
componente tem — variante, cor e tamanho — estão em
[eixos-de-escolha.md](references/eixos-de-escolha.md).

### O que merece ser demonstrado

| Merece bloco próprio | Não merece |
|---|---|
| Cada variante, quando mudam a ênfase da ação | Toda combinação de variante × cor × tamanho |
| Estado que o consumidor precisa reconhecer — erro, carregando, desabilitado | Estado que o navegador já dá de graça, como `:hover` |
| Composição real com outro elemento do kuba | Slot vazio |
| O caso que quase todo mundo escreve errado | Variação que só muda um pixel |

A varredura combinatória é a tentação padrão, e ela esconde o que importa no meio do que
não importa (rule 023).

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Estrutura da página e o que demonstrar | [page-structure.valid.md](examples/page-structure.valid.md) | [page-structure.invalid.md](examples/page-structure.invalid.md) |
| Teste que prova o evento documentado | [event-interaction.valid.js](examples/event-interaction.valid.js) | [event-interaction.invalid.js](examples/event-interaction.invalid.js) |

## Checklist

- [ ] Todo atributo e evento da página existe no `types.d.ts`
- [ ] Todo estado mostrado existe em `style.js` como `:host(:state(...))`
- [ ] O parágrafo de abertura diz o que o componente **não** faz
- [ ] Há um bloco ` ```html preview ` antes da primeira seção
- [ ] `When not to use` nomeia a alternativa, com link
- [ ] Nenhuma varredura combinatória de variantes
- [ ] Cada evento documentado tem teste que o exercita
- [ ] Do's e don'ts pareados linha a linha, entre 3 e 5
- [ ] Os exemplos funcionam na versão pinada do CDN
- [ ] Traduções propagadas quando a página está no escopo traduzido

## Troubleshooting

### O exemplo aparece quebrado na página publicada

**Causa:** usa recurso mais novo que a versão pinada em `KUBA_VERSION`, no topo de
`website/docusaurus.config.js`.
**Solução:** conferir o pin. Ele fica para trás quando um release não o atualiza — é
passo do método do `releaser`.

### Não sei se um estado merece demonstração

**Causa:** confundir estado interno com estado que o consumidor observa.
**Solução:** se o estado não muda nada que o consumidor precise reconhecer ou reagir,
ele não vai para a página. `internals.states` é a lista candidata, não a lista final.

### A seção de composição ficou genérica

**Causa:** listar o que "pode" ser filho, sem dizer por quê.
**Solução:** citar o mecanismo real — "`pointer-events: none` em `::slotted(*)` faz o
conteúdo não interceptar o clique" —, não uma lista de tipos aceitos.

## Referências

- `references/estrutura-da-pagina.md` — a estrutura seção a seção, e de onde ela vem.
- `references/eixos-de-escolha.md` — variante, cor e tamanho: o que cada um comunica.

## Rules relacionadas

- [023 — Proibição de Funcionalidade Especulativa](../../rules/023_proibicao-funcionalidade-especulativa.md): a varredura combinatória de variantes é YAGNI aplicado à demonstração.
- [024 — Proibição de Constantes Mágicas](../../rules/024_proibicao-constantes-magicas.md): a página cita o token, não o valor hexadecimal.
- [032 — Cobertura Mínima e Qualidade](../../rules/032_cobertura-teste-minima-qualidade.md): o teste de interação segue AAA, sem lógica de controle no corpo.
- [035 — Proibição de Nomes Enganosos](../../rules/035_proibicao-nomes-enganosos.md): a página usa o mesmo vocabulário do código — atributo é atributo, propriedade é propriedade.
- [056 — Proibição de Código Zombie](../../rules/056_proibicao-codigo-zombie-lava-flow.md): exemplo que não roda mais é a versão publicada disso.

## Skills relacionadas

- [types](../types/SKILL.md): depends on — o `types.d.ts` é a fonte que a página transcreve.
- [jsdoc](../jsdoc/SKILL.md): depends on — o texto do JSDoc é a base da descrição.
- [prose](../prose/SKILL.md): reinforces — decide como a frase da página soa.
- [state](../state/SKILL.md): depends on — os estados demonstráveis são os de `internals.states`.
- [event](../event/SKILL.md): depends on — o evento só chega ao exemplo com `composed: true`.
- [token](../token/SKILL.md): complements — as custom properties re-estilizáveis são parte do que se documenta.
- [colocation](../colocation/SKILL.md): complements — o teste mora ao lado do componente; a página, em `website/docs/`.

---

**Criado em**: 2026-08-10
**Atualizado em**: 2026-08-25
**Versão**: 1.1
