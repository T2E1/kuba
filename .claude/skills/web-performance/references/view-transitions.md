# View Transitions

**Categoria:** Carregamento
**Intenção:** Animar a passagem entre dois estados da interface delegando à plataforma a
captura do antes e do depois, em vez de coordenar a animação à mão.

---

## Quando Usar

- Transição entre rotas ou entre estados em que a continuidade visual ajuda a entender o
  que mudou — um item de lista que vira a página de detalhe.
- Quando a alternativa seria manter os dois estados vivos ao mesmo tempo só para animar
  entre eles.

## Quando NÃO Usar

- Como enfeite. Animação que não comunica mudança de estado é custo sem informação.
- Em transição que já é instantânea — a animação a torna mais lenta do que era.
- Sem respeitar a preferência por movimento reduzido. Quem pediu menos movimento pediu de
  verdade, e ignorar isso é uma falha de acessibilidade, não uma escolha estética.
- Como único caminho. Onde a capacidade não existe, a transição precisa degradar para a
  troca direta, sem quebrar nada.

## Estrutura Mínima

A mudança de estado é envolvida pela chamada que captura o antes e o depois. Os elementos
que devem ser tratados como o mesmo através da transição recebem um identificador
compartilhado — e o identificador precisa ser único por captura.

## O que custa

- Uma capacidade da plataforma que nem todo ambiente oferece, exigindo o caminho
  alternativo desde o primeiro dia.
- Identificadores duplicados quebram a captura inteira, e a falha é silenciosa.
- A transição ocupa o intervalo em que o usuário poderia já estar interagindo.

## Relacionado a

- [route-based-splitting.md](route-based-splitting.md): complementa — a transição cobre a espera do pedaço que carrega
- [progressive-hydration.md](../../react/references/progressive-hydration.md): complementa — cuidado com o intervalo em que o conteúdo aparece e não responde
- [rule 012 — Proibição de Otimização Prematura](../../../rules/012_otimizacao-prematura.md): complementa

---

**Fonte:** patterns.dev — /vanilla/view-transitions
