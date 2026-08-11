# ✅ Cada decisão na camada que a sustenta

Incorreto em: `layer-choice.invalid.md`

A correção do caso do `/ship`, e como a mesma ideia se distribui pelas quatro camadas sem
se repetir.

---

## A correção

**`agents/releaser.md`** ficou com a tabela — é ele quem julga:

```markdown
| Mudança | Impacto |
|---|---|
| Renomear ou remover evento despachado | **major** |
| Remover custom property de re-estilização | **major** |
| Elemento, atributo ou variante novos | **minor** |
| Correção de comportamento que estava errado | **patch** |

### A pergunta que decide

> Existe HTML ou JavaScript hoje válido que passa a se comportar diferente, ou a
> falhar, depois desta mudança?
```

**`commands/ship.md`** passou a acioná-lo, e ficou com a mecânica:

```markdown
| # | Agent | Recebe | Entrega |
|---|---|---|---|
| 2 | `releaser` | O intervalo desde a última versão | Impacto, versão, CHANGELOG |

4. **Acionar o `releaser`.** Ele devolve o impacto, a versão nova e a entrada do
   CHANGELOG.
   - **Breaking identificado:** parar e reportar. Publicar major é decisão sua.
5. **Aplicar o que o `releaser` decidiu**, via `Edit`.
```

Uma fonte. O command não sabe julgar impacto, e não precisa.

## Uma ideia, quatro camadas

Versionamento aparece nas quatro sem se repetir, porque cada uma responde outra coisa:

| Camada | Artefato | O que diz |
|---|---|---|
| **rule** | `015 — REP` | *A granularidade do reuso é a do release.* O limite, sempre em contexto |
| **skill** | `types` | *O que é contrato público*, e portanto o que é quebrável |
| **agent** | `releaser` | *Se esta mudança específica quebra*, com a tabela e a pergunta que decide |
| **command** | `/ship` | *Em que ordem*: revisar, julgar, aplicar, commitar, enviar |

Nenhuma repete a outra. A rule não sabe da tabela de impacto; o command não sabe julgar; o
agent não sabe a ordem em que é chamado.

## Como escolher, na prática

Ao escrever um artefato novo, a pergunta não é "onde isso caberia" — quase tudo cabe em
duas camadas. É:

> Isto **exige**, **executa**, **decide** ou **sequencia**?

E o teste que confirma: escreva a frase. *"No máximo três parâmetros"* exige — é rule.
*"Symbol de capacidade leva sufixo `-able`"* executa — é skill. *"Este caso é breaking"*
decide — é agent. *"Revisar, versionar, enviar"* sequencia — é command.

## Quando são dois artefatos, não um

O par mais comum do repositório é **limite + modo de cumpri-lo**:

- rule `031` proíbe `../` em import
- skill `colocation` mostra onde o arquivo mora para que isso funcione

Não é duplicação: a rule vale sempre e não ensina; a skill carrega quando o contexto pede
e não proíbe. A skill cita a rule em `Rules relacionadas`, e o vínculo fica explícito.
