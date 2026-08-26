---
name: types
model: sonnet
description: Projeta a forma dos arquivos types.d.ts escritos à mão para custom elements do kuba — isolamento por pacote sem import cruzado, achatamento manual de todo membro contribuído por mixin, taxonomia de nomenclatura escopada ao componente, e tipo nomeado só quando a forma exige restrição. Use ao criar types.d.ts, ao tipar um custom element, ao adicionar tipo de atributo, ao expor no contrato um atributo vindo de mixin, ou quando um pacote com `@define` estiver sem seu types.d.ts. Não use para escrever os comentários do arquivo — use a skill jsdoc.
---

# Types

## O que é

Define **o que declarar e como nomear** num `types.d.ts` de custom element. É a
contraparte da skill `jsdoc`, que cobre o que os comentários dizem: esta decide a forma,
aquela decide a documentação.

### Os dois fatos que moldam todas as regras

1. **O código-fonte não é tipado.** Os arquivos `packages/**/*.ts` usam a extensão `.ts`
   apenas para permitir o parsing da sintaxe de decorator — nenhum compilador infere a
   forma pública a partir da implementação. O `types.d.ts` **é** o contrato; nada o gera.
2. **Custom elements são compostos por mixins aplicados em runtime**
   (`class X extends Echo(Hidden(HTMLElement))`). O TypeScript não enxerga essa
   composição, porque a origem não é tipada. Todo atributo e método que um mixin
   contribui para a superfície pública precisa ser **declarado manualmente** no
   `types.d.ts` do componente.

## Quando usar

| Situação | Ação |
|---|---|
| Pacote com `@define` e sem `types.d.ts` | Criar seguindo o fluxo abaixo |
| Atributo novo no componente | Adicionar ao contrato na mesma mudança |
| Mixin novo na cadeia de `extends` | Achatar o que ele contribui |
| Atributo com formato restrito | Nomear conforme a taxonomia |

Não use para escrever os comentários — isso é `jsdoc`. Sempre finalize um `types.d.ts`
rodando o passo de tipos públicos daquela skill (`references/public-types.md`).

## Como aplicar

### Regra 1 — Um `types.d.ts` por pacote, sem importar de outro

Todo pacote tem exatamente um `types.d.ts`, isolado dos demais — inclusive dos pacotes
de mixin (`@mixin`, `@echo`) cujo comportamento consome.

**Não** faça `import type` de forma definida em outro pacote, mesmo quando dois
componentes usam o mesmo mixin e produziriam um tipo idêntico. Declare localmente, sob o
nome deste componente.

É CRP (rule 017) e REP (rule 015) no nível de tipos: quem consome `<kb-redirect>` não
deveria precisar saber que `<kb-on>` existe, e o vocabulário de `<kb-on>` precisa poder
mudar sem forçar um release de `<kb-redirect>`. Duplicar um tipo de duas linhas é mais
barato que esse acoplamento — é a exceção explícita da rule 021 para repetições
estruturais de baixo nível.

### Regra 2 — Todo membro de mixin é achatado na classe

O `types.d.ts` de um mixin documenta o que ele adiciona **no abstrato**. Essa forma é
material de referência, nunca algo que o componente importa ou estende. Para cada mixin
na cadeia, redeclare cada membro contribuído como propriedade ou método da própria
classe exportada, como se o componente o tivesse escrito.

`Headless` não contribui nada para a superfície pública — não declare nada para ele.
Catálogo completo em `references/achatamento-mixins.md`.

### Regra 3 — Taxonomia

| Construto | Padrão | Exemplo |
|---|---|---|
| Classe do elemento | `KUBA<PascalName>Element` | `KUBARedirectElement` |
| Atributo string com formato restrito | `KUBA<PascalName><PascalAttribute>Attribute` | `KUBARedirectHrefAttribute` |
| Conjunto fechado dentro dessa forma | `KUBA<PascalName><PascalAttribute>AttributeSink` (ou o substantivo que couber) | `KUBARedirectOnAttributeSink` |
| Interface de evento disparado | `<PascalEventName>Event` | `ClickedEvent` |

`<PascalName>` é sempre o segmento do tag name em PascalCase (`redirect` → `Redirect`),
igual ao nome da classe já exportada na implementação. Não derive outra grafia.

### Regra 4 — Forma simples mantém o primitivo

Tipo nomeado só quando a forma precisa de restrição além do que o primitivo expressa —
template literal ou união fechada. Booleano vindo de mixin e `string` sem restrição
permanecem exatamente isso. Não invente `KUBAXHiddenAttribute = boolean` por simetria
(rule 064).

**Exceção obrigatória, não opcional:** se o setter do atributo usa `enumerating(ENUM)`
(skill `enum`), o membro **nunca** permanece `string` — a Regra 4 não se aplica a esse
caso, porque a restrição já existe em runtime e o contrato público precisa da mesma
restrição em tempo de compilação. `color` de `kb-button` é `KUBAButtonColorAttribute`,
não `string`, mesmo a "forma" sendo só uma lista de literais sem estrutura interna.
Confira `references/formas-atributos.md` antes de decidir que um atributo validado por
enum fica sem tipo nomeado — a leitura isolada da Regra 4 permite esse erro.

### Regra 5 — A cadeia de `extends` é uma lista de verificação, não um detalhe

O contrato não está completo quando descreve o que o componente escreveu: está
completo quando descreve o que o componente **aceita**, e boa parte disso vem dos mixins.
Um `types.d.ts` que documenta só os membros escritos à mão está sempre incompleto, e o
erro é invisível — nada falha, o consumidor apenas não enxerga um atributo que existe.

Por isso a cadeia se transcreve antes de escrever, não depois de conferir:

```
class Progress extends Identity(Echo(HTMLElement)) {}
                       ^^^^^^^^ alt
                                ^^^^ on
```

Cada mixin da cadeia vira uma linha anotada, e cada linha precisa reaparecer no arquivo
final. Mixin que não contribui nada (`Headless`) também é anotado — como "nada", de
propósito, para que a ausência seja uma decisão e não um esquecimento.

O recíproco também vale: **nem tudo que a implementação tem é contrato**. `internals`,
métodos com nome de Symbol e campos privados ficam de fora. Ver
`references/achatamento-mixins.md` § "O que nunca entra no contrato".

### Fluxo

1. Ler o `<nome>.ts` por inteiro. Listar cada par getter/setter (vira propriedade), cada
   método público e cada mixin na cadeia de `extends`.
2. **Transcrever a cadeia de `extends` como lista** (Regra 5). Para cada mixin, consultar
   `references/achatamento-mixins.md` e anotar o que contribui — pode ser nada. Mixin que
   não estiver no catálogo não se adivinha: abrir o `types.d.ts` do pacote dele e
   acrescentar a linha ao catálogo na mesma mudança, para o próximo não repetir a busca.
3. **Abrir `src/component/button/types.d.ts` e comparar a estrutura** — é o modelo do
   repositório: ordem das seções, uso de `declare global`, o que aparece e o que não
   aparece. Um contrato que diverge do modelo precisa de uma razão dita em voz alta; sem
   ela, o modelo vence. Não confie na memória do padrão (rule 072): abra o arquivo.
4. Para cada membro, decidir pela Regra 4 se precisa de tipo nomeado. Se sim, nomear pela
   Regra 3, conferindo `references/formas-atributos.md` antes de inventar um template
   literal do zero.
5. Escrever a classe e o bloco `declare global` com `HTMLElementTagNameMap`.
6. Rodar o passo de tipos públicos da skill `jsdoc`.
7. Verificar o isolamento: `grep -n "^import" types.d.ts`. Nenhum import deve existir —
   todos os `types.d.ts` deste repositório estão livres deles hoje, e devem continuar.
8. **Fechar a lista do passo 2**: reler o arquivo escrito com a lista de mixins ao lado e
   confirmar, item a item, que cada contribuição aparece. Sobrou item? O contrato está
   incompleto. Se a cadeia inclui `Echo`, a página em `website/docs/components/` também menciona
   `<kb-on>` na seção de Composição — as duas faces do mesmo recurso.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Isolamento por pacote, sem import cruzado (Regra 1) | [isolation.valid.ts](examples/isolation.valid.ts) | [isolation.invalid.ts](examples/isolation.invalid.ts) |
| Achatamento de mixins e taxonomia num componente real | [flattening.valid.ts](examples/flattening.valid.ts) | [flattening.invalid.ts](examples/flattening.invalid.ts) |

## Checklist

- [ ] Nenhum `import` no arquivo
- [ ] Cadeia de `extends` transcrita como lista, e cada mixin dela reaparece no arquivo
- [ ] Todo membro de mixin achatado na classe
- [ ] `alt` declarado sempre que `Identity` está na cadeia
- [ ] `on` declarado sempre que `Echo` está na cadeia — e `<kb-on>` citado na seção de Composição da página em `website/docs/components/`
- [ ] `internals` **não** declarado; nenhum método com nome de Symbol, nenhum campo privado
- [ ] Estrutura comparada contra `src/component/button/types.d.ts`, aberto nesta execução
- [ ] Nada declarado para `Headless`
- [ ] Nomes escopados ao componente, seguindo a taxonomia
- [ ] `<PascalName>` igual ao nome da classe da implementação
- [ ] Tipo nomeado só onde há restrição real de forma
- [ ] Todo atributo validado por `enumerating(ENUM)` no `<nome>.ts` tem união fechada correspondente aqui — nunca `string`
- [ ] Bloco `declare global` com `HTMLElementTagNameMap` presente
- [ ] Passo de tipos públicos da skill `jsdoc` executado

## Troubleshooting

### Dois componentes usam o mesmo mixin e o tipo ficou duplicado

**Causa:** é intencional. Compartilhar acoplaria os contratos públicos e os releases.
**Solução:** manter a duplicação — a rule 021 a excepciona para definições estruturais de
baixo nível.

### O consumidor não vê um atributo que o componente tem

**Causa:** o atributo vem de mixin e não foi achatado.
**Solução:** redeclarar na classe. Nada é herdado automaticamente, porque a origem não é
tipada.

### O componente aceita um atributo que ninguém decidiu expor

**Causa:** um mixin foi aplicado por um motivo e contribuiu mais de um membro junto — o
caso clássico é `Identity`, aplicado pelo `role` e trazendo `alt` de carona.
**Solução:** declarar o membro, ou levar ao `architect` a decisão de não ter aquele
atributo. O que não vale é deixar sem decidir: o elemento aceita o atributo de qualquer
forma, documentado ou não.

### O `types.d.ts` ficou "fora do padrão" sem ninguém saber apontar onde

**Causa:** foi escrito a partir da implementação apenas, sem comparar com um modelo.
Cada arquivo isolado parece plausível; o desvio só aparece lado a lado.
**Solução:** abrir `src/component/button/types.d.ts` e comparar seção a seção (passo 3 do
fluxo). Divergência sem razão dita é desvio, não estilo.

### O `types.d.ts` divergiu da implementação

**Causa:** atributo adicionado sem atualizar o contrato.
**Solução:** os dois mudam juntos, no mesmo commit — e a página de documentação também,
porque a tabela de atributos transcreve daqui (skill `preview`).

## Referências

- `references/taxonomia.md` — tabela completa de nomenclatura, com exemplos trabalhados.
- `references/achatamento-mixins.md` — o que cada mixin contribui para a superfície pública.
- `references/formas-atributos.md` — formatos comuns de string restrita (URL, arc string, enum como string).

## Rules relacionadas

- [017 — Princípio do Reuso Comum](../../rules/017_principio-reuso-comum.md): quem consome um componente não deve depender do vocabulário de outro.
- [015 — Equivalência de Lançamento e Reuso](../../rules/015_principio-equivalencia-lancamento-reuso.md): o pacote precisa poder ser versionado sozinho.
- [021 — Proibição de Duplicação](../../rules/021_proibicao-duplicacao-logica.md): a exceção para repetições estruturais é o que autoriza a Regra 1.
- [064 — Proibição de Overengineering](../../rules/064_proibicao-overengineering.md): tipo nomeado só quando restringe de fato.
- [013 — Segregação de Interfaces](../../rules/013_principio-segregacao-interfaces.md): o contrato expõe o que o consumidor usa.
- [031 — Proibição de Imports Relativos](../../rules/031_restricao-imports-relativos.md): o isolamento é absoluto — nem alias, nem relativo.

## Skills relacionadas

- [jsdoc](../jsdoc/SKILL.md): complements — decide o que os comentários deste arquivo dizem.
- [preview](../preview/SKILL.md): complements — `argTypes` transcreve este contrato.
- [mixin](../mixin/SKILL.md): depends on — a cadeia de `extends` define o que achatar.
- [revelation](../revelation/SKILL.md): complements — o `index.js` expõe o que este arquivo tipa.
- [api-guidelines](../api-guidelines/SKILL.md): complements — este arquivo declara o contrato; ela julga se a forma dele prende o consumidor.
- [colocation](../colocation/SKILL.md): reinforces — um `types.d.ts` por pacote, colocado.
- [enum](../enum/SKILL.md): depends on — `enumerating(ENUM)` no `.ts` é o gatilho da Regra 4 forçar tipo nomeado.

---

**Criado em**: 2026-07-15
**Atualizado em**: 2026-08-25
**Versão**: 2.2
