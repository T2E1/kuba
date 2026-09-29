# Loading Sequence

**Categoria:** Carregamento
**Intenção:** Decidir explicitamente a ordem em que os recursos são descobertos, baixados
e executados, em vez de herdá-la da ordem em que foram escritos.

---

## Quando Usar

- Antes de aplicar qualquer outro pattern de carregamento. É o que dá o critério: sem uma
  ordem decidida, [preload.md](preload.md) e [prefetch.md](prefetch.md) competem entre si
  sem que ninguém tenha escolhido o vencedor.
- Quando a medição mostra tempo ocioso na rede enquanto a página espera.

## Quando NÃO Usar

- Como atividade separada das outras. A ordem é decidida junto com os padrões que a
  realizam, não num documento à parte que envelhece.

## Estrutura Mínima

Classificar cada recurso em três faixas e tratá-las de forma diferente:

| Faixa | Critério | Tratamento |
|---|---|---|
| Crítico | Sem ele não há primeira tela | No documento, descoberto cedo, declarado com preload |
| Importante | Necessário logo, não imediatamente | Sem bloquear, depois do conteúdo |
| Adiável | Pode esperar a ociosidade ou a intenção | Carregamento diferido, com gatilho |

A classificação precisa caber numa página. Se todo recurso é crítico, nenhum é — e a
ordem volta a ser a de descoberta.

## O que custa

- A classificação envelhece: um recurso que era importante vira crítico e ninguém
  reclassifica.
- Manter a ordem coerente entre build, documento e código exige revisitá-la a cada
  mudança estrutural.

## Relacionado a

- [preload.md](preload.md): complementa — o mecanismo da faixa crítica
- [prefetch.md](prefetch.md): complementa — o mecanismo da faixa adiável
- [prpl.md](prpl.md): complementa — o arranjo que esta ordem pressupõe
- [third-parties.md](third-parties.md): reforça — o terceiro entra na classificação como todo o resto

---

**Fonte:** patterns.dev — /vanilla/loading-sequence
