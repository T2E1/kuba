---
description: "Atualiza branch atual com últimas mudanças do repositório remoto. Funciona em qualquer branch — main ou feature."
allowed-tools: Bash(git branch *), Bash(git fetch *), Bash(git pull *), Bash(git checkout *), Bash(git merge *), Bash(git status)
---

## Propósito

Sincroniza branch local com remoto, gerenciando branches de feature e main adequadamente.

Branch atual:
!`git branch --show-current`

Status atual:
!`git status --short`

## Instruções

1. Salvar nome da branch atual

2. `git fetch origin` — buscar mudanças sem aplicar

3. **Se em main/master:** `git pull origin main`

4. **Se em branch de feature:**
   - `git checkout main`
   - `git pull origin main`
   - `git checkout [branch-original]`
   - `git merge main`

5. Confirmar com `git status`

## Observações

- Adaptar `main` ou `master` conforme convenção do repositório.
