# Proibição de Afirmação Não Verificada

**ID**: BEHAVIORAL-072
**Severity**: 🟠 High
**Category**: Behavioral

---

## What it is

Proíbe que um relatório de entrega — de qualquer um dos onze ofícios — afirme o estado de
um arquivo (o que ele contém, que padrão segue, se já faz algo) sem citar `arquivo:linha`
lido *nesta execução*. "Lembrar" o conteúdo de um vizinho não é ler o vizinho.

## Why it matters

- Uma afirmação sobre um arquivo não lido nesta execução é opinião travestida de fato, e
  quem recebe o relatório não tem como distinguir as duas
- Decisões subsequentes — inclusive de outro ofício, ou do orquestrador — se apoiam na
  afirmação como se fosse verificada, propagando o erro
- O custo de citar é baixo (um `grep` ou uma leitura); o custo de não citar só aparece
  depois, quando alguém confia na afirmação errada
- Sem essa disciplina, "seguir o padrão de X" vira substituto de fato para "abri X e
  confirmei", e os dois têm risco muito diferente

## Objective Criteria

- [ ] Toda afirmação em um relatório de entrega sobre o conteúdo de um arquivo — próprio
  ou de outro pacote — que não foi editado nesta execução cita `arquivo:linha`.
- [ ] Nenhum relatório usa "segue o mesmo padrão de `X`" sem ter lido `X` nesta execução.
- [ ] Divergência entre o que foi lido e o que foi assumido — quando descoberta depois —
  é reportada como correção, não silenciada.

## Allowed Exceptions

- **Fato fornecido pelo orquestrador na entrada.** Quando o escopo já veio com a citação
  (ex.: "o `architect` decidiu X, ver `DESIGN.md:42`"), repetir a citação recebida não
  exige reabrir o arquivo.
- **Consenso interno da própria mudança.** Afirmações sobre o que o próprio código
  produzido nesta execução faz não precisam de citação externa — o autor acabou de
  escrevê-lo.

## How to Detect

### Manual

- Ler o relatório de entrega e marcar toda frase no padrão "X já faz/segue/tem Y";
  verificar se há `arquivo:linha` na mesma frase ou no parágrafo
- Conferir a afirmação contra o arquivo real quando a citação existir, mas parecer
  genérica demais para ter vindo de leitura de fato

### Automatic

- Sem regra nativa de Biome para verificação de afirmação em prosa — detecção via
  revisão do relatório de entrega, não do código.

## Related to

- [026 - Comment Quality: Why, Not What](026_qualidade-comentarios-porque.md): complements — comentário e relatório respondem ao mesmo padrão de precisão.
- [035 - Prohibition of Misleading Names](035_proibicao-nomes-enganosos.md): reinforces — afirmação não verificada é uma forma de desinformação sobre o próprio trabalho.
- [056 - Prohibition of Zombie Code (Lava Flow)](056_proibicao-codigo-zombie-lava-flow.md): complements — documentação ou tipo desatualizado é o mesmo resíduo não questionado que uma afirmação falsa produz.

---

**Created on**: 2026-08-22
**Updated on**: 2026-08-22
**Version**: 1.0
