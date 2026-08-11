# Como se trabalha neste repositório

Este arquivo governa **o desenvolvimento**, não o produto. O que a biblioteca é, o que ela
expõe e como o navegador se comporta vive onde é aplicado: nas rules, nas skills e nos
agents. Aqui ficam as quatro camadas, quem aciona o quê, e como eu me comporto.

A regra que mantém isso assim: **se a informação pertence a um ofício, ela mora no ofício.**
Repetir aqui cria a divergência que este arquivo existe para evitar.

---

## As quatro camadas

Elas se encadeiam numa direção só. Confundi-las é o erro que produz duplicação e
divergência silenciosa.

```
command  →  aciona agent  →  que carrega skill
                 ↑
         rules valem em tudo
```

| Camada | Responde | Quem aciona | Forma |
|---|---|---|---|
| **rule** | O que é proibido | ninguém — está sempre em contexto | [rule.md](skills/standard/references/rule.md) |
| **skill** | Como se faz | o agent, quando o contexto pede | [skill.md](skills/standard/references/skill.md) |
| **agent** | Quem faz, com que julgamento | o command, ou eu | [agent.md](skills/standard/references/agent.md) |
| **command** | Em que ordem, e o que roda entre as etapas | você, digitando `/` | [command.md](skills/standard/references/command.md) |

Os quatro vivem na skill [standard](skills/standard/SKILL.md) — não nas pastas que
governam. O padrão de uma rule não é lido junto com as rules: é lido por quem escreve
uma, e o vizinho natural dele é o autor.

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

## Os nove ofícios, e quando acionar cada um

Nenhum agent conhece outro: eu escolho, com que escopo e em que ordem. Eles não conversam
entre si e não veem esta conversa — recebem o escopo que eu passo, e devolvem a entrega.

| Agent | Aciono quando | Não aciono para |
|---|---|---|
| `architect` | A forma ainda não existe: que categoria, que mixins, que Symbols, ou qual de duas abordagens | Revisar código pronto, ou implementar |
| `designer` | Definir token, estado visual, papel e nome acessível de um elemento | Elemento headless ou mixin — não têm aparência |
| `developer` | Escrever ou alterar código em `packages/` | Decidir a forma antes, ou configurar tooling |
| `tester` | Cobrir comportamento, reproduzir bug como teste que falha, auditar se a suíte prova algo | Corrigir o bug que ele achou |
| `reviewer` | Julgar mudança pronta contra as 31 rules que o Biome não vê | O que `bun run lint` já pega |
| `deepdive` | "Por que isto acontece" sem resposta óbvia, ou mapear pacote desconhecido | Escolher entre alternativas — é do `architect` |
| `writer` | Página de `docs/`, tradução, `README`, `CONTRIBUTING` | JSDoc no código — é do `developer` |
| `releaser` | Julgar se uma mudança quebra consumidor, e preparar versão | Commit corriqueiro — é o `/ship` |
| `builder` | `biome.json`, os configs, hooks de husky, workflows, o que entra em `dist/` | Código de `packages/` |

### Fluxos que se repetem

| Situação | Sequência |
|---|---|
| Elemento novo | `architect` → `designer` → `developer` → `tester` → `writer` — é o `/craft` |
| Bug relatado | `deepdive` → `developer` → `tester` |
| "Está feio / não é acessível" | `designer` → `developer` → `tester` |
| Mudança pronta para entrar | `reviewer` → `releaser` — é o `/ship` |
| Componente sem teste | `tester`, sozinho |
| Comportamento mudou | `developer` → `tester` → `writer`, nesta ordem: documentar antes do teste documenta intenção |
| Render lento, bundle grande | `deepdive` → `architect`, se a correção mudar a forma |
| CI ou build quebrado | `builder`, sozinho |
| Acrescentar rule, skill, agent ou command | `/extend` — sem agent; a skill `standard` decide a camada |

### Quando não delegar

Delegar tem custo: o agent começa sem o que já foi dito aqui, e eu volto a montar o
contexto na resposta. Não vale quando:

- **A tarefa é pequena.** Renomear uma variável, corrigir um typo, ler um arquivo.
- **O passo seguinte depende do anterior inteiro.** Se preciso repassar toda a saída,
  fazer aqui é mais direto.
- **Dois ofícios tocariam o mesmo arquivo.** Em paralelo, um sobrescreve o outro.
- **Eu já tenho o contexto.** Se acabei de ler o pacote, delegar refaz o trabalho.

O sinal a favor é o oposto: mais de dez arquivos a explorar, três frentes independentes,
ou a necessidade de um olhar que não viu esta conversa.

## Como eu trabalho aqui

**Sou o orquestrador.** Não há fluxo entre agents: eu decido quem chamar, com que escopo e
em que ordem. Cada agent funciona isoladamente, sem que nenhum outro tenha rodado antes.

**Leio antes de escrever.** Um vizinho do mesmo tipo antes de criar algo novo; o arquivo
inteiro antes de editar. A forma nova imita a existente — é o que mantém o repositório
legível como um só código, e não como a soma de quem passou por ele.

**Não expando o escopo.** Problema encontrado fora do pedido vira relato ou codetag, não
correção silenciosa. A Regra do Escoteiro (rule 039) vale para o arquivo tocado e para o
que é trivial.

**Verifico antes de afirmar.** `bun run lint` e `bun run test` antes de dizer que está
pronto. Teste que eu não vi passar não passou.

**Reporto o que não fiz.** Escopo bloqueado, exemplo que não roda, achado adjacente: tudo
volta explícito. Silêncio sobre o que faltou é o pior modo de falhar.

## Os dois hooks

Rodam sozinhos, nas duas pontas do trabalho:

| Hook | Evento | Quando | O que faz |
|---|---|---|---|
| `hooks/ladder.sh` | `PreToolUse` | Um pacote vai nascer | Injeta a escada: precisa existir? já existe aqui? a plataforma cobre? Com o inventário real do repositório. Não bloqueia |
| `hooks/gates.sh` | `Stop` | Fim do turno | Roda `bun run test`, `bun run lint` e o validador do `.claude/` no que mudou. **Devolve o turno** enquanto houver progresso |

Um pergunta antes de escrever, o outro cobra depois. Nenhum dos dois julga: a escada
oferece dados e para; os portões leem exit code de comandos que já existem.

Para rodar o validador de forma à mão, de `.claude/`:

    python3 skills/standard/scripts/validate.py

Ele verifica forma, não conteúdo. O que exige leitura está escrito em cada reference: se o
critério é verificável por terceiro, se o passo tem resultado observável, se o exemplo
ainda reflete o código real.

---

**Criado em**: 2026-08-11
**Atualizado em**: 2026-08-11
**Versão**: 1.0
