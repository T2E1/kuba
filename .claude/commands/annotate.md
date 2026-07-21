---
description: "Documenta um arquivo ou módulo (pasta) com JSDoc, criando primeiro o types.d.ts que faltar (skill types-standard) e então aplicando o padrão da skill jsdoc-standard (nível mínimo em código de implementação, nível completo em types.d.ts)."
argument-hint: "[caminho-do-arquivo-ou-pasta]"
allowed-tools: Bash(find *), Bash(git diff *), Bash(git status), Read, Edit, Write
---

## Propósito

Garante que o alvo tenha um `types.d.ts` correto e então documenta tudo com JSDoc — um arquivo único ou todos os arquivos de um módulo (pasta). Duas skills, nesta ordem:

1. `types-standard` — estrutura/nomeia o `types.d.ts` (só entra em ação quando falta um).
2. `jsdoc-standard` — escreve os comentários sobre o que já existe (implementação + `types.d.ts`, novo ou pré-existente).

A ordem importa: JSDoc completo de tipos públicos (`@default`, `@example`, `@throws`) só pode ser escrito depois que a forma final do `types.d.ts` — nomes, membros achatados de mixins, etc. — estiver definida. Documentar antes de estruturar geraria JSDoc para um contrato que ainda vai mudar.

Alvo solicitado: **$ARGUMENTS**

Status atual do repositório (referência para não misturar o diff deste comando com mudanças alheias):
!`git status --short`

## Instruções

1. Se `$ARGUMENTS` estiver vazio, pergunte ao usuário qual arquivo ou pasta documentar. Não assuma um alvo.

2. Resolva o alvo:
   - Se for um arquivo, o alvo é só ele.
   - Se for uma pasta (módulo), rode `find <pasta> -type f \( -name "*.js" -o -name "*.ts" \)` para listar os arquivos a processar. Ignore `node_modules`, arquivos de build/dist e arquivos de teste, a menos que o usuário peça explicitamente para incluí-los.

3. **Fase 1 — estruturar o `types.d.ts` que faltar.** Para cada pacote de custom element dentro do alvo (uma pasta contendo um arquivo de implementação com `@define(...)`, ex.: `packages/<categoria>/<nome>/<nome>.ts`):
   - Se já existir um `types.d.ts` nessa pasta, não toque na sua estrutura — só siga para a Fase 2. Retrofitar um `types.d.ts` existente para o padrão da skill `types-standard` (ex.: achatar um atributo de mixin que falta) é uma mudança estrutural fora do escopo deste comando; se notar a lacuna, mencione no resumo final em vez de editar.
   - Se **não** existir `types.d.ts` nessa pasta, carregue a skill `types-standard` (via Skill tool) e siga o fluxo dela: leia o arquivo de implementação inteiro, identifique getters/setters, métodos públicos e mixins na cadeia de `extends`, e crie o `types.d.ts` (via `Write`) com a classe `KUBA<PascalName>Element`, os tipos de atributo nomeados necessários, os membros achatados de mixins e o bloco `declare global`. Neste momento escreva **apenas a estrutura** (assinaturas, sem JSDoc) — os comentários vêm na Fase 2, já com a skill certa carregada.

4. **Fase 2 — JSDoc.** Carregue a skill `jsdoc-standard` (via Skill tool) antes de escrever qualquer comentário — ela define os dois níveis de detalhe (código interno vs. `types.d.ts`) e as regras de formatação/tags. Processe todos os arquivos do alvo, incluindo qualquer `types.d.ts` criado na Fase 1.

5. Para cada arquivo, classifique antes de editar:
   - Termina em `types.d.ts` (ou é claramente uma declaração de tipos pública) → aplique o padrão **completo** de `references/public-types.md`.
   - Qualquer outro `.js`/`.ts` de implementação → aplique o padrão **mínimo** de `references/internal-code.md`.

6. Leia o arquivo inteiro antes de editar (nunca gere JSDoc a partir de suposição sobre o conteúdo) — para um `types.d.ts` recém-criado na Fase 1, isso significa reler o arquivo que você mesmo acabou de escrever, não assumir seu conteúdo de memória.

7. Para cada construto do arquivo (classe, construtor, getter, setter, membro privado, método, static block, função, arrow function, `const`/`let`/`var`, interface, type alias), decida se merece JSDoc seguindo a "regra de ouro" da skill:
   - Se remover o comentário não perde informação que um leitor sem contexto precisaria, **não adicione comentário**.
   - Nunca documente o óbvio (getters/setters triviais, parâmetros já autoexplicativos).
   - Em `types.d.ts`, documente o contrato completo (o quê, `@default`, `@example` quando há mais de uma forma razoável de uso, `@throws`, `@see`).

8. Todo o texto do JSDoc gerado deve estar em **inglês**, independente do idioma da conversa.

9. Aplique as edições via `Edit` (ou `Write`, apenas para o `types.d.ts` novo criado na Fase 1), preservando 100% do código de implementação existente — o comando documenta e, quando necessário, estrutura tipos ausentes; não refatora. Se notar um code smell relevante ao lado do trecho que está documentando, siga a Regra do Escoteiro (`.claude/rules/039_regra-escoteiro-refatoracao-continua.md`) apenas para o que estiver diretamente no escopo da edição; não expanda o escopo para refatoração ampla.

10. Depois de processar todos os arquivos do alvo, rode `git diff --stat` sobre o(s) arquivo(s) tocado(s) e apresente um resumo curto ao usuário:
    - Quantos arquivos `types.d.ts` foram criados do zero (Fase 1) vs. apenas documentados (Fase 2).
    - Quantos arquivos de implementação foram documentados.
    - Quantos construtos receberam JSDoc novo vs. quantos foram deliberadamente deixados sem comentário (e por quê, em uma frase).
    - Se algum arquivo já tinha JSDoc desatualizado ou redundante, liste-os separadamente como "revisados" em vez de "documentados".
    - Se algum `types.d.ts` existente estava com membros de mixin faltando (detectado na Fase 1 mas não corrigido, por estar fora do escopo), liste-o à parte como observação para o usuário decidir se quer uma edição estrutural dedicada.

## Observações

- Este comando nunca adiciona tipos ao código de implementação (`.js`/`.ts` sem tipagem) — só comentários JSDoc. A tipagem pública vive exclusivamente em `types.d.ts` separados, estruturados pela skill `types-standard` e comentados pela skill `jsdoc-standard`.
- A criação de `types.d.ts` (Fase 1) só acontece quando o arquivo não existe. Um `types.d.ts` existente nunca é reestruturado por este comando — apenas documentado.
- Se o alvo (pasta) não tiver nenhum arquivo `.js`/`.ts`, informe o usuário e não crie arquivos novos.
- Não commite nem faça `git push` como parte deste comando — isso é responsabilidade do fluxo `/ship`.
