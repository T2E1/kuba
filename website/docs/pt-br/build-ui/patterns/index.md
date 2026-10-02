# Receitas

Receitas completas e funcionais — telas inteiras, não elementos isolados. Cada
uma parte de um markup que você pode colar numa página com as duas tags da
[Instalação](/learn/installation), e evolui até a versão que você
publicaria.

As receitas assumem que você leu [Eventos e Echo](/foundations/events-and-echo);
boa parte do que as deixa curtas é fiação por arcos.

## Receitas

- **[Busca enquanto digita](/build-ui/patterns/search-as-you-type)** — um input
  disparando uma requisição, resultados renderizados de um template, com estados
  de erro e vazio. Três elementos, nenhum listener.
- **[Endereço pelo CEP](/build-ui/patterns/address-by-cep)** — um formulário
  de endereço preenchido pela ViaCEP a partir do CEP. Uma requisição espalhada
  por seis campos, cada arco pegando a chave de que precisa.

## Uma nota sobre nomes

O barramento do Echo é compartilhado pela página, e um arco casa sua origem por
`id`, `name` ou nome de tag. Duas funcionalidades que nomeiem um elemento como
`users` vão se cruzar — o arco dispara para qualquer uma delas.

Cada receita aqui roda um único exemplo ao vivo, então os nomes ficam curtos
(`breed`, `cep`). Numa aplicação, onde várias funcionalidades dividem a mesma
página, dê aos nomes o escopo da funcionalidade (`checkout-cep`) para que não se
cruzem.
