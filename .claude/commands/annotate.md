---
description: "Documenta um arquivo ou módulo (pasta) com JSDoc, aplicando o padrão da skill jsdoc-standard (nível mínimo em código de implementação, nível completo em types.d.ts)."
argument-hint: "[caminho-do-arquivo-ou-pasta]"
allowed-tools: Bash(find *), Bash(git diff *), Bash(git status), Read, Edit
---

## Propósito

Adiciona ou revisa JSDoc em um alvo específico — um arquivo único ou todos os arquivos de um módulo (pasta) — usando a skill `jsdoc-standard` como fonte da verdade sobre o padrão a seguir.

Alvo solicitado: **$ARGUMENTS**

Status atual do repositório (referência para não misturar o diff deste comando com mudanças alheias):
!`git status --short`

## Instruções

1. Se `$ARGUMENTS` estiver vazio, pergunte ao usuário qual arquivo ou pasta documentar. Não assuma um alvo.

2. Carregue a skill `jsdoc-standard` (via Skill tool) antes de escrever qualquer comentário — ela define os dois níveis de detalhe (código interno vs. `types.d.ts`) e as regras de formatação/tags.

3. Resolva o alvo:
   - Se for um arquivo, o alvo é só ele.
   - Se for uma pasta (módulo), rode `find <pasta> -type f \( -name "*.js" -o -name "*.ts" \)` para listar os arquivos a processar. Ignore `node_modules`, arquivos de build/dist e arquivos de teste, a menos que o usuário peça explicitamente para incluí-los.

4. Para cada arquivo da lista, classifique antes de editar:
   - Termina em `types.d.ts` (ou é claramente uma declaração de tipos pública) → aplique o padrão **completo** de `references/public-types.md`.
   - Qualquer outro `.js`/`.ts` de implementação → aplique o padrão **mínimo** de `references/internal-code.md`.

5. Leia o arquivo inteiro antes de editar (nunca gere JSDoc a partir de suposição sobre o conteúdo).

6. Para cada construto do arquivo (classe, construtor, getter, setter, membro privado, método, static block, função, arrow function, `const`/`let`/`var`, interface, type alias), decida se merece JSDoc seguindo a "regra de ouro" da skill:
   - Se remover o comentário não perde informação que um leitor sem contexto precisaria, **não adicione comentário**.
   - Nunca documente o óbvio (getters/setters triviais, parâmetros já autoexplicativos).
   - Em `types.d.ts`, documente o contrato completo (o quê, `@default`, `@example` quando há mais de uma forma razoável de uso, `@throws`, `@see`).

7. Todo o texto do JSDoc gerado deve estar em **inglês**, independente do idioma da conversa.

8. Aplique as edições via `Edit`, preservando 100% do código existente — a skill documenta, não refatora. Se notar um code smell relevante ao lado do trecho que está documentando, siga a Regra do Escoteiro (`.claude/rules/039_regra-escoteiro-refatoracao-continua.md`) apenas para o que estiver diretamente no escopo da edição; não expanda o escopo para refatoração ampla.

9. Depois de editar todos os arquivos do alvo, rode `git diff --stat` sobre o(s) arquivo(s) tocado(s) e apresente um resumo curto ao usuário:
   - Quantos arquivos foram documentados.
   - Quantos construtos receberam JSDoc novo vs. quantos foram deliberadamente deixados sem comentário (e por quê, em uma frase).
   - Se algum arquivo já tinha JSDoc desatualizado ou redundante, liste-os separadamente como "revisados" em vez de "documentados".

## Observações

- Este comando nunca adiciona tipos ao código de implementação (`.js`/`.ts` sem tipagem) — só comentários JSDoc. A tipagem pública vive exclusivamente em `types.d.ts` separados, conforme a skill.
- Se o alvo (pasta) não tiver nenhum arquivo `.js`/`.ts`, informe o usuário e não crie arquivos novos.
- Não commite nem faça `git push` como parte deste comando — isso é responsabilidade do fluxo `/ship`.
