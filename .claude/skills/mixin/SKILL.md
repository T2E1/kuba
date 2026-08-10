---
name: mixin
model: sonnet
description: Composição de comportamento em custom elements por mixins — funções que recebem uma classe base e retornam a classe estendida, aplicadas da direita para a esquerda, com Echo sempre na cadeia para o sistema de eventos funcionar. Use ao criar ou modificar um componente que precisa de comportamento reutilizável (largura, altura, visibilidade, valor, identidade acessível), ao substituir herança por composição, ou ao revisar uma classe base inchada de responsabilidades. Não use para decidir a ordem dos membros dentro da classe — use a skill anatomy.
---

# Mixin

## O que é

Um mixin é uma função que recebe uma classe e devolve a classe estendida. É como este
repositório adiciona comportamento a custom elements sem herança múltipla e sem inchar
uma classe base comum — a cadeia é montada no `extends` da classe do componente, como
em [composition.valid.js](examples/composition.valid.js).

Cada mixin tem uma responsabilidade só. A classe do componente fica com o que é
exclusivamente dela.

## Quando usar

| Situação | Ação |
|---|---|
| Componente precisa de comportamento que outro já tem | Compor o mixin existente |
| Classe base crescendo para atender vários componentes | Extrair mixin (rule 010) |
| Mesmo bloco de atributo repetido em dois componentes | Extrair mixin (rule 021) |
| Componente dispara evento | `Echo` obrigatório na cadeia |

Não use mixin para comportamento usado por um único componente — isso é overengineering
(rule 064). Mixin se justifica a partir do segundo consumidor.

## Como aplicar

### Catálogo — `packages/mixin/`

| Mixin | Responsabilidade |
|---|---|
| `Width` | Controle responsivo de largura |
| `Height` | Controle responsivo de altura |
| `Hidden` | Visibilidade do componente |
| `Headless` | Componente sem renderização própria |
| `Identity` | Papel e nome acessíveis (`role`, `aria-label`) |
| `Template` | Renderização a partir de template |
| `Value` | Valor do componente e sua reflexão |

`Echo` (`packages/echo/`) não é um mixin de aparência: é a base do sistema de eventos.
Todo componente que dispara ou escuta evento precisa dele na cadeia.

### Regras de composição

1. **A base vem primeiro na leitura, por último na aplicação.** Em
   `Width(Hidden(Echo(HTMLElement)))`, `Echo` envolve `HTMLElement` primeiro, depois
   `Hidden`, depois `Width`. A aplicação é da direita para a esquerda.
2. **A ordem importa quando há dependência.** Um mixin que precisa ler o estado final de
   outro tem de envolvê-lo — ficar à esquerda dele. Foi essa dependência que gerou o bug
   do `Hidden` com `<kb-button>`.
3. **Uma responsabilidade por mixin** (rule 010). Um mixin que controla largura *e* cor
   é dois mixins.
4. **Mixins não se conhecem.** Nenhum importa outro. A composição acontece na classe do
   componente.
5. **Estado interno em campo privado.** O mixin expõe o que precisa por getter/setter e
   sincroniza com o atributo via `attributeChanged`.

### Combinações típicas

| Tipo de componente | Cadeia |
|---|---|
| Botão interativo | `Width(Hidden(Echo(HTMLElement)))` |
| Container de layout | `Width(Height(Hidden(Echo(HTMLElement))))` |
| Ícone | `Identity(Hidden(Echo(HTMLElement)))` |
| Comportamental, sem render | `Headless(Echo(HTMLElement))` |

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Composição por mixin vs. herança em cadeia | [composition.valid.js](examples/composition.valid.js) | [composition.invalid.js](examples/composition.invalid.js) |

## Checklist

- [ ] `Echo` está na cadeia se o componente dispara ou escuta evento
- [ ] Cada mixin tem uma responsabilidade só
- [ ] Nenhum mixin importa outro mixin
- [ ] A ordem reflete as dependências reais, não o acaso
- [ ] Estado interno em campo privado, exposto por getter/setter
- [ ] O que o mixin expõe publicamente está no `types.d.ts` do componente
- [ ] Nenhum mixin criado para um único consumidor

## Troubleshooting

### O atributo do mixin não faz nada no componente

**Causa:** foi o bug real do `Hidden` com `<kb-button>` — o componente não expunha
`internals` publicamente, então o mixin não conseguia aplicar o estado.
**Solução:** verificar o que o mixin precisa da classe base e garantir que está exposto.
Escrever a story com `play` da skill `story` para que o defeito falhe em CI, não em
revisão manual.

### Trocar a ordem dos mixins quebrou o componente

**Causa:** existe dependência real entre eles — um precisa envolver o outro para ler o
estado final.
**Solução:** documentar a razão da ordem com JSDoc na classe (rule 026). Ordem
significativa e não documentada é armadilha para o próximo refactor.

### O mesmo comportamento foi reimplementado no componente

**Causa:** o mixin existente não foi encontrado.
**Solução:** conferir o catálogo antes de escrever. Duplicar comportamento de mixin viola
a rule 021.

## Rules relacionadas

- [010 — Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): uma responsabilidade por mixin é a aplicação direta.
- [021 — Proibição de Duplicação](../../rules/021_proibicao-duplicacao-logica.md): o mixin é o mecanismo de reuso que evita a cópia.
- [016 — Fechamento Comum](../../rules/016_principio-fechamento-comum.md): o comportamento e seu atributo mudam juntos, então vivem juntos.
- [007 — Máximo de Linhas por Classe](../../rules/007_limite-maximo-linhas-classe.md): extrair mixin é o caminho quando a classe passa de 50 linhas.
- [064 — Proibição de Overengineering](../../rules/064_proibicao-overengineering.md): limita a criação de mixin sem consumidor real.
- [059 — Proibição de Herança Recusada](../../rules/059_proibicao-heranca-refusao.md): a composição evita o componente herdar o que não usa.

## Skills relacionadas

- [anatomy](../anatomy/SKILL.md): depends on — define onde os membros do mixin ficam na classe.
- [constructor](../constructor/SKILL.md): complements — o que pode e o que não pode acontecer na inicialização da cadeia.
- [event](../event/SKILL.md): depends on — `Echo` é o que torna os eventos possíveis.
- [types](../types/SKILL.md): depends on — o achatamento dos atributos de mixin no `types.d.ts`.
- [gof](../gof/SKILL.md): reinforces — o mixin é a forma que Decorator assume aqui.
- [state](../state/SKILL.md): complements — mixins de estado usam Element Internals.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-10
**Versão**: 2.0
