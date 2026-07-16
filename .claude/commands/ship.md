---
description: "Prepara mudanças, cria commit Conventional Commits, ajusta a versão em package.json conforme o tipo do commit e envia para remoto. Usar após completar Feature, Task ou Quick fix."
allowed-tools: Bash(git add *), Bash(git status), Bash(git diff *), Bash(git commit *), Bash(git push *), Bash(git log *), Read, Edit
---

## Propósito

Commita e envia mudanças atuais para repositório remoto, mantendo a versão em `package.json` sincronizada com o tipo semântico do commit.

Estado atual:
!`git status --short`

Commits recentes (referência de estilo):
!`git log --oneline -5`

Versão atual:
!`node -p "require('./package.json').version"`

## Instruções

1. Executar `git status` — confirmar arquivos a commitar

2. Executar `git diff --stat` — entender escopo das mudanças

3. Elaborar mensagem de commit seguindo Conventional Commits:

   | Prefixo | Quando usar |
   |---------|-------------|
   | `feat:` | Nova funcionalidade |
   | `fix:` | Correção de bug |
   | `refactor:` | Refatoração sem mudança de comportamento |
   | `docs:` | Mudanças de documentação |
   | `chore:` | Manutenção, configs, scripts |
   | `test:` | Adicionar ou corrigir testes |

4. Determinar o impacto de versão a partir do tipo/escopo do commit definido no passo 3:

   | Tipo/marcador | Bump | Exemplo |
   |---------------|------|---------|
   | `feat!:` ou rodapé `BREAKING CHANGE:` | **major** | `1.4.2` → `2.0.0` |
   | `feat:` | **minor** | `1.4.2` → `1.5.0` |
   | `fix:`, `perf:`, `refactor:` | **patch** | `1.4.2` → `1.4.3` |
   | `docs:`, `chore:`, `test:`, `style:`, `ci:`, `build:` | **nenhum** | versão inalterada |

   - Se a versão atual tiver um sufixo de *prerelease* (ex.: `0.1.0-alpha.4`) e o bump for **minor** ou **patch**, incrementar apenas o número do prerelease (`-alpha.4` → `-alpha.5`) em vez do núcleo semver — a base só muda em um bump **major** ou em uma decisão explícita de sair do prerelease.
   - Múltiplos commits de tipos diferentes preparados juntos: usar o de maior impacto (major > minor > patch > nenhum).

5. Se houver bump, atualizar o campo `version` em `package.json` (via Edit) e incluir o arquivo no mesmo commit.

6. Preparar arquivos com `git add` específico (evitar `git add -A` com arquivos sensíveis) — incluindo `package.json` se a versão mudou

7. Criar commit com HEREDOC:
   ```bash
   git commit -m "$(cat <<'EOF'
   tipo: descrição concisa no imperativo

   Co-Authored-By: Cleber de M. Goncalves <cleber.engineer@gmail.com>
   EOF
   )"
   ```

8. Enviar: `git push`

9. Confirmar: `git status`

## Observações

- Não commitar: `.env` com valores reais, secrets, credenciais hardcoded.
- Não versionar (bump) quando o commit for apenas `docs:`, `chore:`, `test:`, `style:`, `ci:` ou `build:`.
