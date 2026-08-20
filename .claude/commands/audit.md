---
description: "Revisa um pacote, arquivo ou intervalo de commits contra as 31 rules que nenhuma ferramenta detecta, sem corrigir e sem commitar. Usar para pedir uma segunda opinião sobre código já escrito, fora do fluxo de encerrar uma mudança."
argument-hint: "[caminho | intervalo-de-commits]"
allowed-tools: Bash(git status), Bash(git diff *), Bash(git log *), Read
---

## Propósito

Pede ao `reviewer` uma segunda opinião sobre código já escrito, no momento em que o
consumidor escolher — não só no instante em que uma mudança está prestes a sair, que é o
único gatilho que o `/ship` oferece hoje. Não corrige nada: um achado aqui é informação,
não uma edição automática.

Estado atual:
!`git status --short`

## Fluxo

| # | Agent | Recebe | Entrega |
|---|---|---|---|
| 1 | `reviewer` | O escopo — pacote, arquivo ou intervalo de commits | Achados com `arquivo:linha` e veredito de merge |

Nenhum outro ofício entra neste fluxo. Corrigir o que o `reviewer` encontrar é trabalho do
`developer`, fora daqui; publicar é o `/ship`.

## Instruções

1. **Determinar o escopo**, a partir de `$ARGUMENTS`:
   - Vazio → `git diff HEAD`, o que está por commitar (mesmo padrão do `reviewer` sem
     escopo).
   - Um caminho (`packages/<categoria>/<nome>/` ou um arquivo) → auditoria do pacote ou
     arquivo inteiro, não só do que mudou.
   - Um intervalo de commits (`A..B`) ou número de pull request → esse intervalo.

2. **Acionar o `reviewer`** com o escopo decidido. Não passar `Write` nem `Edit` a ele —
   a restrição é o ofício: ele aponta o problema, não o resolve.

3. **Relatar** os achados na íntegra — `arquivo:linha`, a rule violada, o que quebra na
   prática, e o veredito (✅ aprovado · ⚠️ aprovado com ressalva · ❌ requer alteração).
   Perguntar se o usuário quer acionar o `developer` para corrigir; não presumir que sim.

## Observações

- **Este fluxo não corrige e não commita.** Corrigir é o `developer`; commitar e julgar
  versão é o `/ship`. `/audit` só informa.
- Rodar `/audit` de novo no mesmo escopo, depois de uma correção, é a forma de confirmar
  que o achado sumiu — não há atalho automático para essa conferência.
- Escopo grande demais para leitura íntegra: o `reviewer` já reporta isso sozinho
  ("escopo excedido") e diz quais arquivos ficaram de fora. Não fragmente o pedido por
  conta própria — deixe o próprio achado dizer o que falta.

---

**Criado em**: 2026-08-20
**Atualizado em**: 2026-08-20
**Versão**: 1.0
