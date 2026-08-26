---
name: revelation
model: haiku
description: Module Revelation Pattern para arquivos index — o index é a única interface pública do módulo e contém exclusivamente imports e re-exports diretos, sem lógica, sem variável intermediária e sem `export *`. Use ao criar ou organizar o index de um pacote, ao decidir o que é público e o que é detalhe de implementação, ou ao revisar index que expõe tudo indiscriminadamente. Não use para decidir como agrupar arquivos em pacotes — use a skill package.
---

# Revelation

## O que é

O `index.js` de um módulo é o seu contrato público. Tudo que sai por ele é promessa;
tudo que não sai é detalhe de implementação, livre para mudar.

Por isso o index não tem lógica: ele declara a superfície, e nada mais. Um index com
código é um módulo cuja fronteira é ambígua.

## Quando usar

| Situação | Ação |
|---|---|
| Criando pacote novo | Escrever o index com os exports públicos |
| Adicionando arquivo ao pacote | Decidir conscientemente se ele sai pelo index |
| Index com `export *` | Substituir por exports nomeados |
| Index com lógica ou variável | Mover para um módulo próprio |

## Como aplicar

### O que o index pode conter

| Sintaxe | Uso |
|---|---|
| `import 'path'` | Import com efeito colateral (registro de custom element) |
| `export { default } from 'path'` | Re-export do default |
| `export { default as Name } from 'path'` | Re-export nomeando |
| `export { Name } from 'path'` | Re-export de nomeado |

Nada além disso. Sem `const`, sem função, sem condicional.

### Por que `export *` é proibido

`export *` transforma toda adição interna em adição à API pública, sem que ninguém
decida. Um arquivo novo com um helper exportado vira contrato acidental — e removê-lo
depois é breaking change. A superfície pública tem de ser uma escolha explícita, arquivo
por arquivo.

Isso é CRP (rule 017) aplicado: quem importa o pacote não deve receber classes que não
usa.

### Hierarquia

O index de um componente re-exporta o próprio componente. O index do pacote agrega os
componentes. Cada nível decide o que sobe.

`interfaces.js` é irmão do index, não parte dele: é por onde saem os Symbols de contrato
(skill `bracket`).

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Superfície pública escolhida vs. `export *` com lógica | [public-surface.valid.js](examples/public-surface.valid.js) | [public-surface.invalid.js](examples/public-surface.invalid.js) |

## Checklist

- [ ] Nenhum `export *`
- [ ] Nenhuma lógica, variável ou condicional no index
- [ ] Todo símbolo exportado é intencionalmente público
- [ ] Nenhum helper interno vazando
- [ ] Todo módulo tem index — nenhum import alcançando arquivo interno de outro pacote
- [ ] Imports com efeito colateral documentados com comentário do porquê

## Troubleshooting

### Um consumidor importa direto de um arquivo interno do pacote

**Causa:** o índice não expunha o que ele precisava, e ele contornou.
**Solução:** ou o símbolo é público e sobe para o index, ou o consumidor está dependendo
de detalhe de implementação. A decisão é explícita, e o path alias deve apontar só para
a raiz do pacote (rule 031).

### O index cresceu e ninguém sabe o que é usado

**Causa:** exports acumulados sem revisão — Lava Flow na superfície pública (rule 056).
**Solução:** o que ninguém importa há tempo sai. `correctness/noUnusedImports` do Biome
ajuda do lado dos consumidores.

### Precisei de lógica condicional no index

**Causa:** decisão de runtime dentro do que deveria ser declaração.
**Solução:** a condicional vai para um módulo próprio, que o index re-exporta.

## Rules relacionadas

- [010 — Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): o index expõe a interface, e é só isso que faz.
- [017 — Princípio do Reuso Comum](../../rules/017_principio-reuso-comum.md): `export *` força o consumidor a depender do que não usa.
- [015 — Equivalência de Lançamento e Reuso](../../rules/015_principio-equivalencia-lancamento-reuso.md): a superfície pública define a unidade de release.
- [013 — Segregação de Interfaces](../../rules/013_principio-segregacao-interfaces.md): expor só o que o cliente usa.
- [031 — Proibição de Imports Relativos](../../rules/031_restricao-imports-relativos.md): o alias aponta para a raiz do pacote, que é o index.
- [022 — Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): index direto se lê em segundos.

## Skills relacionadas

- [package](../package/SKILL.md): depends on — o index é onde CRP e SAP se materializam.
- [api-guidelines](../api-guidelines/SKILL.md): reinforces — o index é a superfície plana que esconde o interior aninhado.
- [bracket](../bracket/SKILL.md): complements — `interfaces.js` expõe os Symbols de contrato.
- [colocation](../colocation/SKILL.md): complements — a estrutura de pastas que o index encabeça.
- [types](../types/SKILL.md): complements — o `types.d.ts` tipa exatamente o que o index expõe.
- [alphabetical](../alphabetical/SKILL.md): reinforces — os exports nomeados ficam em ordem alfabética.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-10
**Versão**: 2.0
