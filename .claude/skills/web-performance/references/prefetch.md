# Prefetch

**Categoria:** Carregamento
**Intenção:** Buscar em prioridade baixa, durante a ociosidade, um recurso que
provavelmente será necessário **na próxima** navegação.

---

## Quando Usar

- Quando a próxima navegação é previsível: o passo seguinte de um fluxo, o item que o
  ponteiro está sobre, o resultado mais provável de uma busca.
- Combinado com [route-based-splitting.md](route-based-splitting.md), elimina a espera da
  transição sem pesar na carga inicial.

## Quando NÃO Usar

- Quando o destino é incerto. Cada previsão errada é banda e dado do usuário gastos à
  toa.
- Em conexão limitada ou com economia de dados ativada — o navegador oferece essa
  informação, e ignorá-la gasta o dado de quem tem menos.
- Para recurso da navegação atual. Isso é [preload.md](preload.md).

## Estrutura Mínima

Uma declaração de baixa prioridade, ou o mesmo carregamento diferido disparado no
primeiro sinal de intenção — o ponteiro entrando no link, o foco chegando nele.

A previsão precisa ter uma taxa de acerto conhecida. Sem isso, não há como dizer se o
pattern está ajudando ou só gastando banda.

## O que custa

- Banda e dado gastos em previsões erradas, invisíveis para quem desenvolve e visíveis na
  conta de quem usa.
- Espaço no cache tomado por algo que talvez nunca seja lido.

## Relacionado a

- [preload.md](preload.md): complementa — este é para a próxima navegação; aquele, para esta
- [route-based-splitting.md](route-based-splitting.md): complementa — o par que elimina a espera de transição
- [import-on-interaction.md](import-on-interaction.md): complementa — antecipar no sinal de intenção é a mesma ideia
- [prpl.md](prpl.md): depende — é a letra do meio do conjunto

---

**Fonte:** patterns.dev — /vanilla/prefetch
