# Bundle Splitting

## Problema

Um bundle único e grande atrasa a primeira renderização — o usuário vê tela em branco
até o motor atingir a linha que dispara o primeiro paint.

## Como funciona

Divide a aplicação em múltiplos bundles menores, carregando primeiro só o essencial para
a renderização inicial e postergando o resto — geralmente via
[dynamic-import.md](dynamic-import.md) nos pontos de divisão.

## Quando não aplicar

- Aplicações pequenas onde o bundle único já é menor que o custo de uma requisição HTTP
  extra por chunk — dividir sem medir é complexidade sem retorno mensurável.

## Relação com as rules deste repositório

- **015/017 (REP/CRP)**: a fronteira de um chunk deveria coincidir com a fronteira de
  reuso do pacote — dividir por linha arbitrária de código, sem respeitar coesão, produz
  chunks que sempre carregam juntos de qualquer forma.
- Consome [tree-shaking.md](tree-shaking.md) para eliminar o que sobra dentro de cada
  chunk.
