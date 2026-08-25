---
description: "Revisa o que está por commitar, julga o impacto de versão, escreve o CHANGELOG e envia para o remoto. Usar ao concluir uma mudança, antes de ela sair do seu computador."
allowed-tools: Bash(git add *), Bash(git status), Bash(git diff *), Bash(git commit *), Bash(git push *), Bash(git log *), Bash(bun run test), Bash(bun run lint), Read, Edit
---

## Propósito

Leva o que está no working tree até o remoto, passando por duas decisões que não são
mecânicas: **o código está pronto para entrar** e **o que essa mudança custa para quem
consome o pacote**. Cada uma é de um ofício.

Estado atual:
!`git status --short`

Escopo das mudanças:
!`git diff --stat HEAD`

Commits recentes, como referência de estilo:
!`git log --oneline -5`

## Fluxo

| # | Agent | Recebe | Entrega |
|---|---|---|---|
| 1 | `reviewer` | O diff completo | Achados com `arquivo:linha` e veredito de merge |
| 2 | `releaser` | O intervalo desde a última versão | Impacto (major/minor/patch/nenhum), versão, CHANGELOG |

O `reviewer` só é acionado quando o diff toca `src/` ou `packages/`. Mudança restrita a `website/` ou
`.claude/` não tem o que revisar contra as 31 rules que ele cobre.

O `releaser` é acionado sempre, inclusive para responder "nenhum impacto" — é ele quem sabe
que mudança em `website/` e `.claude/` não versiona, porque não é publicada.

## Instruções

1. **Confirmar o escopo.** Ler o `git status` acima. Se houver arquivo que você não
   reconhece, pare e pergunte antes de seguir.

2. **Rodar as verificações locais.** `bun run lint` e `bun run test`. Vermelho aqui
   encerra o fluxo — não se envia o que não passa.

3. **Acionar o `reviewer`**, quando o diff toca `src/` ou `packages/`, passando o intervalo.
   - ❌ requer alteração → reportar os achados e parar. Corrigir é trabalho próprio.
   - ⚠️ com ressalva → seguir, e incluir os achados no relato final.
   - ✅ aprovado → seguir.

4. **Acionar o `releaser`**, passando o intervalo desde a última versão em `CHANGELOG.md`.
   Ele devolve o impacto, a versão nova e a entrada do CHANGELOG.
   - **Breaking identificado:** parar e reportar o que quebra. Publicar major é decisão
     sua, não do fluxo.

5. **Aplicar o que o `releaser` decidiu**, quando houver bump: `package.json` e
   `CHANGELOG.md`, via `Edit`.

6. **Preparar os arquivos** com `git add` explícito, um a um ou por diretório. Nunca
   `git add -A`.

7. **Commitar** em Conventional Commits, no imperativo, com o rodapé:

   ```
   Co-Authored-By: Cleber de M. Goncalves <cleber.engineer@gmail.com>
   ```

   O prefixo descreve **o que a mudança é** — `feat`, `fix`, `refactor`, `docs`, `chore`,
   `test`. O impacto de versão não vem daqui: vem do `releaser`, que julga pelo contrato
   público e não pelo prefixo escolhido.

8. **Enviar** com `git push`, e confirmar com `git status`.

9. **Relatar**: o que foi commitado, a versão resultante, e qualquer ressalva do `reviewer`
   que ficou sem correção.

## Observações

- Um commit por mudança independente. Três assuntos no working tree são três commits, e o
  `releaser` julga o impacto de cada um.
- Nunca commitar `.env` com valores reais, segredo ou credencial.
- O hook de `pre-commit` roda `biome check --write` no que está em stage: arquivos podem
  ser reformatados durante o commit. É esperado.
- Breaking change nunca sai em silêncio, mesmo com o `reviewer` aprovando: o veredito do
  `releaser` volta para você antes do push.

---

**Criado em**: 2026-04-19
**Atualizado em**: 2026-08-25
**Versão**: 2.2
