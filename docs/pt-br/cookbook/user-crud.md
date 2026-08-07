# CRUD de usuários

Uma pequena tela de gestão — adicionar registros, listá-los, excluir um —
construída com quatro elementos que nunca se referenciam. Toda conexão é um arco.
**Nenhum listener é escrito por quem monta a página.**

```html preview
<kb-card direction="column">
  <kb-form name="crud-form" autorender>
    <template>
      <kb-stack direction="column" align="stretch">
        <kb-input name="name" required>
          <kb-label>Nome</kb-label>
        </kb-input>
        <kb-input name="age" type="number" required>
          <kb-label>Idade</kb-label>
        </kb-input>
        <kb-button type="submit">Adicionar</kb-button>
      </kb-stack>
    </template>
    <kb-on value="crud-form/submitted:method/reset"></kb-on>
  </kb-form>
</kb-card>

<kb-render layout="list">
  <kb-on value="crud-users/changed:method/render"></kb-on>
  <template>
    <kb-stack direction="row" justify="space-between" align="center">
      <kb-text size="xxs">{name} — {age}</kb-text>
      <kb-button name="crud-delete" value="{id}" color="danger" variant="naked">
        Excluir
      </kb-button>
    </kb-stack>
  </template>
</kb-render>

<kb-dataset name="crud-users" upsert="id">
  <kb-on value="crud-form/submitted:method/push"></kb-on>
  <kb-on value="crud-delete/clicked:method/delete"></kb-on>
</kb-dataset>

<script type="module">
  requestAnimationFrame(() =>
    document.querySelector('kb-dataset[name="crud-users"]').push([
      { id: 1, name: 'Ada Lovelace', age: 36 },
      { id: 2, name: 'Alan Turing', age: 41 },
    ]),
  )
</script>
```

## O fluxo de dados

Quatro arcos, e cada um é uma frase:

| Arco | Lê-se como |
|---|---|
| `crud-form/submitted:method/push` | quando o formulário for enviado, empurre os dados dele no dataset |
| `crud-form/submitted:method/reset` | …e limpe o formulário |
| `crud-users/changed:method/render` | quando a coleção mudar, re-renderize a lista |
| `crud-delete/clicked:method/delete` | quando um botão de excluir for clicado, exclua aquele registro |

O ciclo se fecha sobre si mesmo: o formulário alimenta o dataset, o dataset
alimenta a lista, e os botões da lista alimentam o dataset de novo. Nada importa
nada.

## Como cada peça funciona

### O formulário publica dados parseados

`<kb-form>` renderiza seus campos a partir do `<template>` e publica `submitted`
com os dados do formulário já parseados num objeto, indexado pelo `name` de cada
campo. A validação nativa roda primeiro, então um campo obrigatório vazio bloqueia
o evento por completo — não há verificação de "está válido?" em lugar nenhum da
página.

O segundo arco aponta o formulário para **si mesmo**: `submitted` dispara o
próprio `reset()`, limpando os campos após uma inclusão bem-sucedida.

### O dataset mescla por chave

`upsert="id"` faz de `push()` uma mesclagem, não um append. O registro enviado não
tem `id`, então o dataset gera um uuid e o escreve de volta no registro
armazenado — que é o que torna `{id}` disponível ao template depois.

### A lista interpola por registro

`<kb-render>` renderiza seu template uma vez por registro do array, então
`{name}`, `{age}` e `{id}` resolvem por linha. O `value="{id}"` do botão de
excluir é o detalhe-chave: **o botão de cada linha carrega o id do próprio
registro como payload.**

### Um arco serve o botão de toda linha

Todo botão de excluir compartilha `name="crud-delete"`, e o segmento `source` do
arco casa por nome — então um único arco cobre todas as linhas, presentes e
futuras. O botão publica `clicked` com seu `value`, que é exatamente o argumento
que `delete(chave)` espera.

É por isso que botões renderizados *depois* de o arco ter sido conectado
continuam funcionando: arcos assinam o barramento compartilhado por nome, não
referências de elemento.

## Coisas que vale saber

### O barramento é global, e casa por nome

O barramento do Echo é compartilhado pela página inteira. Um arco cuja origem é
`users` dispara para **qualquer** elemento da página chamado `users` — incluindo
um em outro componente, outro exemplo ou outra funcionalidade.

É por isso que todo nome desta receita é prefixado (`crud-form`, `crud-users`,
`crud-delete`) em vez dos mais naturais `form`, `users`, `delete`: esta página
tem vários exemplos ao vivo, e nomes sem prefixo os cruzariam. Numa aplicação
real, dê aos nomes o escopo da funcionalidade pelo mesmo motivo.

### É só memória

`<kb-dataset>` guarda registros em memória. Um reload esvazia. Para persistir,
acrescente um `<kb-fetch>` e mais um arco:

```html
<kb-fetch name="api" url="/api/users">
  <kb-on value="crud-form/submitted:method/post"></kb-on>
</kb-fetch>

<kb-dataset name="crud-users" upsert="id">
  <kb-on value="api/succeeded:method/push"></kb-on>
</kb-dataset>
```

Agora o formulário alimenta a requisição, e a *resposta* alimenta o dataset —
então a lista mostra o que o servidor de fato gravou, incluindo qualquer id ou
campo que ele tenha gerado.

### Editar precisa de mais um elemento

Esta receita cobre criar, ler e excluir. Atualizar é o mesmo `push()` — como ele
mescla por chave, enviar `{ id: 1, age: 37 }` corrige aquele registro sem tocar
em `name`. O que falta é uma forma de carregar um registro de volta no
formulário, que é para isso que existe o [`<kb-find>`](/pt-br/components/find).

### Excluir é imediato

Não há etapa de confirmação. `color="danger"` marca a ação como destrutiva
visualmente, mas nada a protege. Para qualquer coisa mais difícil de desfazer que
isto, coloque uma confirmação entre o clique e a exclusão — o que significa um
listener, ou um elemento de diálogo que publique o próprio evento de confirmação.

## Relacionados

- [Eventos e Echo](/pt-br/learn/events-and-echo) — a gramática do arco.
- [Dataset](/pt-br/components/dataset) — a chave de upsert e seus métodos.
- [Form](/pt-br/components/form) — renderização de template e o payload enviado.
