# kuba

Biblioteca de custom elements em JavaScript puro. Sem framework, sem passo de build
obrigatório: o navegador é o runtime e o HTML é a API. Elementos visíveis usam o prefixo
`kb-`, headless usam `k-`, e se comunicam por eventos DOM ligados declarativamente com
`on="fonte/evento:tipo/destino"`.

Um pacote por elemento em `packages/<categoria>/<nome>/`, com a classe, o markup, o
estilo, os contratos, os tipos e o teste lado a lado.

---

## As quatro camadas

Elas se encadeiam numa direção só. Confundi-las é o erro que produz duplicação e
divergência silenciosa.

```
command  →  aciona agent  →  que carrega skill
                 ↑
         rules valem em tudo
```

| Camada | Responde | Quem aciona | Padrão |
|---|---|---|---|
| **rule** | O que é proibido | ninguém — está sempre em contexto | [rules/STANDARD.md](rules/STANDARD.md) |
| **skill** | Como se faz | o agent, quando o contexto pede | [skills/STANDARD.md](skills/STANDARD.md) |
| **agent** | Quem faz, com que julgamento | o command, ou eu | [agents/STANDARD.md](agents/STANDARD.md) |
| **command** | Em que ordem, e o que roda entre as etapas | você, digitando `/` | [commands/STANDARD.md](commands/STANDARD.md) |

**A rule exige, a skill executa, o agent decide, o command sequencia.**

Um agent que ensina sintaxe faz trabalho de skill. Um command que julga faz trabalho de
agent. Uma skill que define papel faz trabalho de agent. O sintoma é sempre o mesmo: a
mesma tabela de decisão em dois lugares, divergindo até uma delas dar a resposta errada.

### Onde cada coisa mora

| Se é… | Vai para |
|---|---|
| Um limite verificável, que vale sempre | `rules/` |
| Um procedimento, um catálogo, algo que precisa de exemplo | `skills/` |
| Um ofício com julgamento próprio | `agents/` |
| Uma sequência fixa que você dispara | `commands/` |
| Algo que deve rodar sozinho | infraestrutura — hook, `pre-commit`, CI |

## Como eu trabalho aqui

**Sou o orquestrador.** Não há fluxo entre agents: eu decido quem chamar, com que escopo e
em que ordem. Cada agent funciona isoladamente, sem que nenhum outro tenha rodado antes.

**Leio antes de escrever.** Um pacote vizinho da mesma categoria antes de criar um novo;
o arquivo inteiro antes de editar. A forma nova imita a existente — é o que mantém
`packages/` legível como um só código.

**Não expando o escopo.** Problema encontrado fora do pedido vira relato ou codetag, não
correção silenciosa. A Regra do Escoteiro (rule 039) vale para o arquivo tocado e para o
que é trivial.

**Verifico antes de afirmar.** `bun run lint` e `bun run test` antes de dizer que está
pronto. Teste que eu não vi passar não passou.

**Reporto o que não fiz.** Escopo bloqueado, exemplo que não roda, achado adjacente: tudo
volta explícito. Silêncio sobre o que faltou é o pior modo de falhar.

## O que este projeto não faz

- **Não tem dependência de runtime.** O que entra no bundle é pago por quem instala.
- **Não tem framework.** React, Lit e afins não entram nem para conveniência interna.
- **Não usa `../` em import.** Path aliases — `@dom`, `@echo`, `@mixin` (rule 031).
- **Não mede cobertura.** Não há provider em `vitest.config.js`; afirmar percentual seria
  inventá-lo.

## Restrições da plataforma

Estas não são convenções — são o navegador. Ignorar qualquer uma quebra em execução:

| Restrição | Razão |
|---|---|
| Um único `attachInternals()` por elemento | O navegador lança na segunda chamada |
| `composed: true` em evento público | Sem isso ele não sai do Shadow DOM |
| `Echo` na cadeia para despachar evento | É quem instala o mecanismo |
| Estado visual em `internals.states` | Permite `:host(:state(...))`; classe não |
| `@paint` adia o primeiro render | O shadow root está vazio até o `requestAnimationFrame` |
| `@on` escuta no `shadowRoot` | Clique no host é no-op |

## Verificação

Cada `STANDARD.md` traz o validador da sua camada, na seção `## Verificação`. Rodar de
`.claude/`. Eles não rodam sozinhos: dispare quando alterar a camada.

O que nenhum deles alcança — e que por isso exige leitura — está escrito em cada um: se o
critério é verificável por terceiro, se o passo tem resultado observável, se o exemplo
ainda reflete o código real.

---

**Criado em**: 2026-08-11
**Atualizado em**: 2026-08-11
**Versão**: 1.0
