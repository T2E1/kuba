# Armadilhas, homônimos e checklist de revisão

## Homônimos a evitar

Palavras que carregam dois significados dentro de um sistema de tokens
enganam o leitor. Desambigue conscientemente:

| Palavra ambígua | Conflito | Prefira |
|---|---|---|
| `type` | tipografia vs. "categoria/tipo" | `font` para tipografia |
| `text` | conteúdo textual vs. a category tipografia | reserve `text` para a *property* de cor do texto; use `font` para a category |
| `size` | dimensão de elemento vs. `space` (espaçamento) | `size` para dimensão, `space` para espaçamento |

A regra por trás: um termo, um significado, em todo o sistema.

## Nome não pode contradizer o tipo/uso real

O nome é uma promessa. Um token chamado `...-list` que na verdade guarda um
valor único, ou `...-radius` que guarda uma cor, é desinformação. O nível
`property`/`category` no nome deve bater com o que o token realmente é.

## Promoção: comece dentro, promova depois

- Token novo nasce **local** no componente.
- Só promova a global quando **3+ componentes** compartilharem a decisão.
- Promover cedo demais cria abstração especulativa; tarde demais duplica
  valores. O gatilho objetivo são os 3 componentes.

## Homogeneidade vs. heterogeneidade

- **Dentro** de um concept (`feedback`), todos os tokens devem parecer da
  mesma família e seguir o mesmo padrão de níveis.
- **Entre** concepts (`feedback` vs. `action`), os nomes devem ficar
  visivelmente distintos — o concept é o que separa as classes.

Sintoma de problema: dois concepts cujos tokens são indistinguíveis no nome,
ou um concept cujos tokens seguem padrões de nomeação inconsistentes entre si.

## `mode` ≠ `theme`

- `mode` = superfície de renderização (`on-light`/`on-dark`).
- `theme` = sistema visual alternativo (marca A vs. marca B).
- São ortogonais: existe "theme A on-dark" e "theme B on-dark". Não colapse
  os dois no mesmo nível.

## Consistência de convenção

Decida uma vez, por sistema, e nunca oscile:

- `mode` explícito sempre, ou light implícito e só marcar dark?
- `scale` em `100/200/…` ou `s/m/l`? (uma por eixo)
- Ordem dos modifiers.

Inconsistência aqui é pior que a "escolha errada": quebra o modelo mental de
quem lê.

## Checklist de revisão de um nome de token

- [ ] Tem uma `category` clara (e não usa `type` para tipografia)?
- [ ] O `concept` agrupa o token de forma semântica e homogênea?
- [ ] A `property` bate com o que o token realmente pinta/mede?
- [ ] Cada modifier presente **distingue** de outro token real (nenhum
      redundante)?
- [ ] A ordem dos níveis segue a convenção do sistema?
- [ ] O escopo está certo — local até 3 componentes, global a partir daí?
- [ ] `namespace` (system) presente; `theme`/`domain` só se existirem?
- [ ] Sem homônimos ambíguos; o nome não contradiz o tipo/uso real?
- [ ] Se havia polihierarquia, virou **alias** em vez de valor duplicado?
- [ ] O nome é o subconjunto **mínimo** de níveis que remove ambiguidade?
