# Compressing JavaScript

## Problema

JavaScript é um dos maiores contribuintes ao peso de página; comprimir reduz o tempo de
transferência pela rede.

## Como funciona

Algoritmos *lossless* — Gzip (Deflate, LZ77 + Huffman) ou Brotli (context modeling,
15-20% menor que Gzip) — comprimem o bundle. Compressão pode ser estática (no build) ou
dinâmica (em runtime); o servidor comunica o algoritmo usado via header
`Content-Encoding`.

## Quando não aplicar

- Chunking excessivamente granular perde eficiência de compressão — `compress(a) +
  compress(b) >= compress(a + b)`, então muitos chunks pequenos (< 20KB) comprimem pior
  que poucos maiores. Isso tensiona com [bundle-splitting.md](bundle-splitting.md): o
  ponto de divisão certo equilibra os dois ganhos.

## Relação com as rules deste repositório

- É a camada de infraestrutura de build — o ofício `builder` decide a configuração real
  de compressão do pipeline deste repositório, este reference é o conceito genérico.
