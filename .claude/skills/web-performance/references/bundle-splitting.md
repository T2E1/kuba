# Bundle Splitting

**Categoria:** Carregamento
**Intenção:** Quebrar o pacote único em partes, para que o usuário baixe só o que aquela
tela precisa e mantenha em cache o que não muda.

---

## Quando Usar

- Quando o bundle inicial está medido e é grande o bastante para dominar o tempo até a
  interação.
- Quando dependências estáveis e código de produto mudam em cadências diferentes:
  separá-los preserva o cache do que não mudou a cada publicação.

## Quando NÃO Usar

- Sem medição ([rule 012](../../../rules/012_otimizacao-prematura.md)).
- Em granularidade fina. Muitos arquivos pequenos custam mais em requisições e em
  compressão do que economizam em bytes — a compressão funciona melhor sobre um arquivo
  maior.
- Quando a divisão cria cascata: um pedaço que só é descoberto depois que outro executa
  soma latência em série.

## Estrutura Mínima

A fronteira natural é a navegação ([route-based-splitting.md](route-based-splitting.md)).
Depois dela, dependências estáveis num grupo próprio, e o que é compartilhado por várias
rotas num grupo comum.

O que é preciso na primeira tela mas vive num pedaço separado se declara com
[preload.md](preload.md), para ser descoberto cedo.

## O que custa

- Mais arquivos, mais requisições, e uma configuração de empacotamento a manter.
- Compressão menos eficiente por arquivo.
- Uma classe nova de defeito: o pedaço que falha ao carregar depois de uma publicação,
  quando o documento em cache aponta para um arquivo que não existe mais.

## Relacionado a

- [route-based-splitting.md](route-based-splitting.md): depende — é a primeira fronteira a aplicar
- [dynamic-import.md](dynamic-import.md): depende — o mecanismo
- [preload.md](preload.md): complementa — evita a cascata que a divisão cria
- [tree-shaking.md](tree-shaking.md): complementa — reduz antes de dividir; dividir código morto é dividir lixo
- [compression.md](compression.md): complementa — a granularidade fina prejudica a compressão
- [rule 012 — Proibição de Otimização Prematura](../../../rules/012_otimizacao-prematura.md): reforça

---

**Fonte:** patterns.dev — /vanilla/bundle-splitting
