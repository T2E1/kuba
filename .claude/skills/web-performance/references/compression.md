# Compression

**Categoria:** Carregamento
**Intenção:** Reduzir os bytes que trafegam, comprimindo os arquivos de texto antes do
envio.

---

## Quando Usar

- Sempre, em todo recurso de texto: código, estilo, marcação, dados.
- Comprimir no build, e não a cada requisição, quando o conteúdo é estático — o algoritmo
  pode ser mais agressivo porque o tempo de compressão é pago uma vez.

## Quando NÃO Usar

- Em formatos já comprimidos — imagens, vídeo, fontes modernas. Recomprimir custa tempo e
  pode aumentar o tamanho.
- Em respostas muito pequenas, onde o cabeçalho de compressão pesa mais que o ganho.

## Estrutura Mínima

Compressão estática para o que sai do build, dinâmica para o que é gerado por requisição.
O algoritmo mais eficiente disponível, com o tradicional como alternativa negociada pelo
cliente.

O que mais reduz bytes não é o algoritmo: é **não enviar** ([tree-shaking.md](tree-shaking.md))
e **adiar** ([dynamic-import.md](dynamic-import.md)). A compressão é o último passo, não
o primeiro.

## O que custa

- Compressão dinâmica custa tempo de servidor por requisição.
- Compressão agressiva no build custa tempo de build.
- Dividir demais prejudica a taxa: a compressão funciona melhor sobre um arquivo maior,
  e é o contrapeso de [bundle-splitting.md](bundle-splitting.md).

## Relacionado a

- [bundle-splitting.md](bundle-splitting.md): complementa — a granularidade fina prejudica a taxa
- [tree-shaking.md](tree-shaking.md): reforça — não enviar vence comprimir
- [skill `twelve-factor` — Separação Build-Release-Run](../../twelve-factor/references/05-build-release-run.md): complementa

---

**Fonte:** patterns.dev — /vanilla/compression
