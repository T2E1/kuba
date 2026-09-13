---
name: page-object
model: sonnet
effort: medium
description: Abstrai a interação com um componente — montar, alcançar o shadow root, disparar ações — numa classe dedicada, para que a mecânica de `mount`/`inner`/`clickInner` não se repita em cada teste do mesmo pacote e uma mudança de seletor interno corrija um lugar só. Use quando os mesmos seletores internos aparecem em vários testes do mesmo componente, ao cobrir um componente com muitos controles internos, ou ao revisar teste que repete `host.shadowRoot.querySelector`. Não use para um componente simples com um ou dois testes — a chamada direta a `inner()` já é clara.
---

# Page Object Model (POM)

## O que é

Uma classe que encapsula **como interagir** com um componente — os seletores internos, a
sequência de `mount`/`inner`/`clickInner` — atrás de métodos com nome de ação
(`preencher()`, `submeter()`). Os testes chamam a classe, nunca o shadow root
diretamente. Quando o seletor interno muda, corrige-se um lugar: a classe, não os N
testes que o usavam.

Neste repositório o papel de "página" do POM clássico é o próprio custom element: não há
navegação entre páginas, e o objeto encapsula um componente, não uma URL.

## Quando usar

| Situação | Ação |
|---|---|
| O mesmo seletor interno aparece em 3+ testes do componente | Extrair um Page Object |
| Componente com múltiplos controles internos (form composto, wizard) | Um Page Object por componente, método por ação |
| Um teste isolado, componente com um controle único | ❌ Não é aqui — `inner()` direto já é claro |
| A classe só repassa `inner()`/`clickInner()` sem agregar sentido | Sinal de Middle Man — revisar se vale a pena |
| Seletor interno mudou e quebrou vários testes | O sintoma que o Page Object existe para prevenir |

## Como aplicar

1. **Um Page Object por componente**, não por página — este repositório testa
   componentes isolados, não fluxos de navegação.
2. **Método por ação de negócio**, nomeado como o `method` de um componente:
   `preencher(valor)`, `submeter()`, `estaInvalido()` — nunca `getInput()` ou
   `clickButton()` cru.
3. **Encapsular a mecânica de montagem** no construtor ou num método `montar()`: quem usa
   o Page Object não chama `mount()` nem conhece o seletor do shadow root.
4. **Devolver valor de negócio**, não o elemento DOM — `estaInvalido()` devolve
   `boolean`, não o nó que foi inspecionado. Vazar o elemento interno é vazar o que a
   classe deveria esconder.
5. **Colocar a classe ao lado do `*.test.js`** que a usa, como `<nome>.page.js` — mesma
   convenção de colocation dos demais arquivos do pacote.
6. **Não deixar a classe virar Middle Man**: se todo método é `return inner(...)` sem
   nenhuma composição ou nome de intenção, o ganho não compensa a indireção (rule 061).

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Page Object com métodos de intenção vs. repasse cru ao seletor | [input-page.valid.js](examples/input-page.valid.js) | [input-page.invalid.js](examples/input-page.invalid.js) |

## Checklist

- [ ] A classe existe porque 3+ testes repetiam o mesmo seletor interno
- [ ] Cada método tem nome de ação de negócio, não nome de seletor
- [ ] Nenhum método devolve o elemento DOM cru para o teste inspecionar
- [ ] A classe mora ao lado do `*.test.js` que a usa
- [ ] Nenhum método é puro repasse sem agregar sentido (Middle Man)

## Troubleshooting

### O teste ainda acessa `shadowRoot` diretamente depois de criar o Page Object

**Causa:** algum caso ficou fora do encapsulamento, geralmente uma asserção nova.
**Solução:** adicionar o método que falta na classe — o teste nunca deveria conhecer
o seletor interno depois que o Page Object existe.

### A classe tem 8 métodos e todos são uma linha só

**Causa:** virou Middle Man — delegação pura sem valor agregado (rule 061).
**Solução:** perguntar se o ganho real é esconder o seletor (vale) ou só adicionar uma
camada (não vale); se for só a segunda, voltar a chamar `inner()` direto.

## Rules relacionadas

- [061 — Proibição de Middle Man](../../rules/061_proibicao-middle-man.md): o limite entre Page Object útil e camada que só repassa chamadas.
- [009 — Diga, Não Pergunte](../../rules/009_diga-nao-pergunte.md): o método devolve decisão de negócio, não o nó para o teste perguntar sobre ele.
- [021 — Proibição de Duplicação](../../rules/021_proibicao-duplicacao-logica.md): elimina a repetição do mesmo seletor em vários testes do mesmo componente.
- [058 — Proibição de Shotgun Surgery](../../rules/058_proibicao-shotgun-surgery.md): um seletor interno que muda corrige um arquivo, não N testes.

## Skills relacionadas

- [preview](../preview/SKILL.md): reinforces — o teste de interação que a página cita pode usar o Page Object do componente.
- [colocation](../colocation/SKILL.md): reinforces — a classe mora ao lado do `*.test.js` que a usa.
- [naming](../naming/SKILL.md): reinforces — método nomeado por ação, campo privado espelhando o acessor.
- [test-data-builder](../test-data-builder/SKILL.md): complements — o builder monta o cenário; o Page Object interage com ele depois de montado.

---

**Criado em**: 2026-09-13
**Atualizado em**: 2026-09-13
**Versão**: 1.0
