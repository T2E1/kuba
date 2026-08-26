---
description: "Revisa código contra as 31 rules que nenhuma ferramenta detecta, ou audita a organização de um diretório contra o grafo real de dependências — sem corrigir e sem commitar. Usar para pedir uma segunda opinião sobre o que já está escrito, fora do fluxo de encerrar uma mudança."
argument-hint: "[caminho | intervalo-de-commits | estrutura caminho]"
allowed-tools: Bash(git status), Bash(git diff *), Bash(git log *), Read
---

## Propósito

Pede uma segunda opinião sobre o que já está escrito, no momento em que o consumidor
escolher — não só no instante em que uma mudança está prestes a sair, que é o único
gatilho que o `/ship` oferece hoje. Não corrige nada: um achado aqui é informação, não uma
edição automática.

Dois ofícios auditam, e a diferença é a granularidade: o `reviewer` julga o código
**dentro** dos arquivos, o `surveyor` julga a organização **entre** eles.

Estado atual:
!`git status --short`

## Fluxo

| # | Agent | Recebe | Entrega |
|---|---|---|---|
| 1 | `reviewer` | O escopo — arquivo, pacote ou intervalo de commits | Achados com `arquivo:linha` e veredito de merge |
| 1 | `surveyor` | O escopo — um diretório que agrupa pacotes | Grafo observado, achados com caminho e veredito de estrutura |

**Um dos dois, nunca os dois.** Qual entra é decidido pela forma do escopo no passo 1 —
critério mecânico, não julgamento. Nenhum outro ofício entra: corrigir é trabalho do
`developer`, decidir a estrutura nova é do `architect`, publicar é o `/ship`.

## Instruções

1. **Determinar o escopo e o ofício**, a partir de `$ARGUMENTS`. O critério é a forma do
   escopo, verificável sem julgar o conteúdo:

   | `$ARGUMENTS` | Escopo | Ofício |
   |---|---|---|
   | Vazio | `git diff HEAD`, o que está por commitar | `reviewer` |
   | Intervalo (`A..B`) ou número de pull request | Esse intervalo | `reviewer` |
   | Um arquivo | O arquivo inteiro, não só o que mudou | `reviewer` |
   | Um diretório de pacote — tem `index.js` ou `types.d.ts` | O pacote inteiro | `reviewer` |
   | Um diretório que **agrupa** pacotes — `packages/`, `src/`, `src/<categoria>/` | A organização dele | `surveyor` |
   | Começa com a palavra `estrutura`, seguida de um caminho | Esse caminho | `surveyor` |

   Confirmar a distinção do quarto e quinto casos com `ls <caminho>`: diretório com
   `index.js` é um pacote; diretório só com subdiretórios agrupa pacotes. Na dúvida,
   perguntar — não escolher por conta própria.

2. **Acionar o ofício decidido**, um só, com o escopo. Nenhum dos dois recebe `Write` nem
   `Edit` — a restrição é o ofício: apontam o problema, não o resolvem.

3. **Relatar** os achados na íntegra.
   - Do `reviewer`: `arquivo:linha`, a rule violada, o que quebra na prática, e o veredito
     (✅ aprovado · ⚠️ aprovado com ressalva · ❌ requer alteração).
   - Do `surveyor`: o grafo observado, os achados com caminho e consequência, e o veredito
     (✅ se sustenta · ⚠️ se sustenta com ressalva · ❌ precisa reestruturar).

   Perguntar o que fazer com os achados — `developer` para corrigir código, `architect`
   para decidir estrutura nova. Não presumir que o usuário quer seguir.

## Observações

- **Este fluxo não corrige e não commita.** Corrigir é o `developer`, decidir a forma nova
  é o `architect`; commitar e julgar versão é o `/ship`. `/audit` só informa.
- Rodar `/audit` de novo no mesmo escopo, depois de uma correção, é a forma de confirmar
  que o achado sumiu — não há atalho automático para essa conferência.
- Escopo grande demais para leitura íntegra: os dois ofícios reportam isso sozinhos
  ("escopo excedido") e dizem o que ficou de fora. Não fragmente o pedido por conta
  própria — deixe o próprio achado dizer o que falta.
- **O `surveyor` não lê diff.** Auditar estrutura "só do que mudou" não existe: fronteira e
  nome se julgam contra o diretório inteiro e o grafo completo. Passar um intervalo de
  commits a ele é erro de escopo.
- Um pacote pode render achado dos dois tipos — código ruim dentro e organização ruim
  fora. São duas execuções do `/audit`, com escopos diferentes, não uma que faz as duas.

---

**Criado em**: 2026-08-20
**Atualizado em**: 2026-08-25
**Versão**: 1.2
