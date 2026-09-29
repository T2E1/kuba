# Static Import

**Categoria:** Carregamento
**Intenção:** Declarar a dependência no topo do módulo, de modo que o empacotador a
resolva no build e a inclua no bundle.

---

## Quando Usar

- Por padrão, em tudo. É a forma que o empacotador analisa melhor: resolve o grafo,
  elimina o que não é usado e detecta ciclo.
- Para tudo que a primeira tela precisa. Adiar o que é imediatamente necessário só
  acrescenta uma ida à rede em série.

## Quando NÃO Usar

- Para código que só uma parte dos usuários executa — aí é
  [dynamic-import.md](dynamic-import.md).
- Para módulo grande usado atrás de uma interação rara.

## Estrutura Mínima

Import nomeado, no topo, com caminho por alias e nunca relativo saindo do pacote
([skill `clean-code`](../../clean-code/references/restricao-imports-relativos.md)).

Importar nomeadamente, e não o módulo inteiro, é o que torna a eliminação de código morto
possível ([tree-shaking.md](tree-shaking.md)).

## O que custa

- Tudo que é importado estaticamente entra no bundle de quem importa, usado ou não em
  execução.
- Um import estático a mais numa rota é peso na primeira tela dela.

## Relacionado a

- [dynamic-import.md](dynamic-import.md): complementa — a escolha oposta, para o que não é imediato
- [tree-shaking.md](tree-shaking.md): depende — a análise estática é o que permite eliminar o não usado
- [skill `clean-code` — Proibição de Imports Relativos](../../clean-code/references/restricao-imports-relativos.md): reforça
- [skill `twelve-factor` — Declaração Explícita de Dependências](../../twelve-factor/references/02-dependencies.md): reforça

---

**Fonte:** patterns.dev — /vanilla/static-import
