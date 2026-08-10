---
name: bdd
model: opus
description: Especificação de comportamento em Gherkin pt-BR — arquivos .feature em docs/bdd/ com Funcionalidade, Cenário, Dado/Quando/Então, escritos em linguagem de negócio e livres de detalhe de implementação. Use ao definir critérios de aceitação com stakeholders, ao especificar uma regra de negócio complexa de forma executável, ou ao dar ao teste uma referência de comportamento esperado. Não use para testar implementação de componente — use a skill story, cujo play exercita a interação real.
---

# BDD

## O que é

Especificação executável do comportamento esperado, escrita em Gherkin no idioma do
negócio. Um arquivo `.feature` descreve **o que** o sistema faz do ponto de vista de quem
usa — nunca **como** ele faz.

O critério que separa um bom Gherkin de um ruim: se a pessoa que pediu a funcionalidade
não consegue ler e validar o cenário, ele foi escrito para a máquina errada.

## Quando usar

| Situação | Ação |
|---|---|
| Definindo critérios de aceitação | Escrever `.feature` antes de implementar |
| Regra de negócio com muitos casos | `Esquema do Cenário` com tabela de exemplos |
| Teste precisa de referência de comportamento | Consultar o `.feature` correspondente |
| Testar clique e evento de um componente | Não é aqui — é a skill `story`, com `play` |

Não escreva Gherkin para comportamento técnico interno. Cenário que menciona status HTTP,
SQL ou ID interno perdeu o público que justificava o formato.

## Como aplicar

### Estrutura

Template completo em [feature-template.md](references/feature-template.md).

| Palavra-chave | Uso |
|---|---|
| `Funcionalidade:` | Título do arquivo |
| `Contexto:` | Setup compartilhado por todos os cenários |
| `Cenário:` | Um caso |
| `Esquema do Cenário:` | Caso parametrizado, com `Exemplos:` |
| `Dado` | Pré-condição — o estado inicial |
| `Quando` | A ação |
| `Então` | O resultado esperado |
| `E` | Continuação da etapa anterior |

### Convenções do projeto

- `# language: pt` na primeira linha — obrigatório.
- Verbos no presente: "o usuário vê", "o sistema envia".
- Personas com nome real (João, Maria), nunca `user1`.
- Arquivo: `docs/bdd/NNN_kebab-case.feature`, um por comportamento.
- Cenário feliz primeiro; erros depois.
- Índice mantido em `docs/bdd/README.md`.

### O que nunca entra num cenário

Status HTTP, nome de tabela, SQL, ID interno, nome de classe, seletor CSS. Tudo isso é
implementação: muda sem que o comportamento mude, e quebra o cenário sem motivo.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Cenário em linguagem de negócio vs. cenário vazando implementação | [scenario.valid.feature](examples/scenario.valid.feature) | [scenario.invalid.feature](examples/scenario.invalid.feature) |

## Checklist

- [ ] `# language: pt` na primeira linha
- [ ] Nenhum status HTTP, SQL, ID interno ou seletor no cenário
- [ ] Verbos no presente
- [ ] Personas com nome, não abstrações
- [ ] Cenário feliz antes dos de erro
- [ ] Um comportamento por arquivo
- [ ] Quem pediu a funcionalidade consegue ler e validar

## Troubleshooting

### O cenário quebra a cada refactor

**Causa:** vazamento de implementação — o cenário testa o como, não o quê.
**Solução:** remover toda referência técnica. Se sobrar pouca coisa, o comportamento
descrito era técnico e não pertencia ao Gherkin.

### Os cenários viraram uma lista de permutações

**Causa:** um `Cenário:` por combinação de valores.
**Solução:** `Esquema do Cenário` com tabela `Exemplos:`. Um cenário, N linhas.

### O stakeholder não entende o `.feature`

**Causa:** escrito no vocabulário do time técnico.
**Solução:** usar os termos do glossário (arc42 §12). Se o termo não está lá, o domínio
ainda não foi nomeado.

## Referências

- `references/feature-template.md` — template completo com todas as palavras-chave.

## Rules relacionadas

- [032 — Cobertura Mínima de Teste](../../rules/032_cobertura-teste-minima-qualidade.md): `Dado/Quando/Então` é o padrão AAA em linguagem de negócio.
- [006 — Proibição de Nomes Abreviados](../../rules/006_proibicao-nomes-abreviados.md): o cenário usa os termos do domínio por extenso.
- [026 — Qualidade de Comentários: o Porquê](../../rules/026_qualidade-comentarios-porque.md): o `.feature` guarda a intenção de negócio que o teste sozinho não expressa.
- [003 — Encapsulamento de Primitivos](../../rules/003_encapsulamento-primitivos.md): os conceitos nomeados no Gherkin costumam ser os Value Objects que faltam no código.

## Skills relacionadas

- [prose](../prose/SKILL.md): reinforces — cenário Gherkin vago não testa nada; o critério de concretude é o mesmo.
- [story](../story/SKILL.md): complements — o `play` testa a interação do componente; o Gherkin descreve o comportamento de negócio.
- [arc42](../arc42/SKILL.md): complements — os cenários detalham o comportamento que a §6 descreve como fluxo.
- [quality](../quality/SKILL.md): reinforces — os critérios de aceitação daqui alimentam os cenários de qualidade da §10.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-09
**Versão**: 2.0
