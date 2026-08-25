---
description: "Cria um pacote novo em src/ (elemento consumível) ou packages/ (mixin) do zero: forma, aparência, implementação, testes e documentação, cada etapa com o ofício que lhe cabe. Usar ao adicionar um custom element ou um mixin ao design system."
argument-hint: "[o que o elemento faz, em uma frase]"
allowed-tools: Bash(ls *), Bash(find *), Bash(mkdir *), Bash(bun run lint), Bash(bun run test), Bash(git status), Read, Write, Edit, Glob, Grep
---

## Propósito

Leva um pacote de "não existe" a "documentado e testado", acionando os cinco ofícios na
ordem em que as decisões dependem umas das outras. A forma vem antes da aparência, que vem
antes do código, que vem antes da prova, que vem antes da documentação — inverter qualquer
par produz retrabalho.

O que criar: **$ARGUMENTS**

Categorias de elemento existentes (`src/`):
!`ls "$(git rev-parse --show-toplevel)/src/"`

Categorias de infraestrutura existentes (`packages/`):
!`ls "$(git rev-parse --show-toplevel)/packages/"`

Mixins disponíveis para a cadeia:
!`ls "$(git rev-parse --show-toplevel)/packages/mixin/"`

## Fluxo

| # | Agent | Recebe | Entrega |
|---|---|---|---|
| 1 | `architect` | O comportamento esperado | Categoria, cadeia de mixins, contratos de Symbol, superfície pública, ≥3 critérios de aceitação |
| 2 | `designer` | A forma decidida | Mapa de tokens, estados, papel e nome acessível |
| 3 | `developer` | Forma e aparência | Os arquivos do pacote em `src/<categoria>/<nome>/` ou `packages/mixin/<nome>` |
| 4 | `tester` | O pacote implementado | `<nome>.test.js`, e o veredito |
| 5 | `writer` | O contrato e o comportamento provado | A página em `website/docs/components/<nome>.mdx` |

O `designer` é pulado quando o pacote não tem representação visual — mixin, elemento
headless em `src/data/`. Nesse caso o passo 2 não acontece, e o `developer` recebe
só a forma.

O `writer` também é pulado para mixin e infraestrutura: `website/docs/components/` documenta o que
o consumidor escreve no HTML.

## Instruções

1. **Exigir o comportamento.** Se `$ARGUMENTS` estiver vazio ou disser apenas o nome,
   pergunte o que o elemento faz e **onde ele para** — o limite é o que o `architect`
   precisa para decidir a cadeia de mixins, e o que o `writer` vai transformar na abertura
   da página. Não assuma.

2. **Acionar o `architect`** com o comportamento e a lista de categorias acima.
   - Se ele bloquear por ambiguidade, traga a pergunta dele para você e pare.
   - A entrega dele define o caminho: `src/<categoria>/<nome>/` para elemento consumível
     (custom element que vai para o HTML de página), `packages/mixin/<nome>` para mixin.

3. **Acionar o `designer`**, quando o elemento for visível, passando a forma decidida.
   Ele devolve que token governa cada propriedade e que custom properties o consumidor
   poderá sobrescrever — decisões que viram contrato público, e que é caro mudar depois.

4. **Criar o diretório** com `mkdir -p`, no caminho que o `architect` definiu.

5. **Acionar o `developer`** com a forma e, quando houver, o mapa de tokens. Ele escreve
   os arquivos do pacote e roda `bun run lint` e `bun run test` antes de reportar.

6. **Acionar o `tester`** com o pacote implementado. Ele escreve os testes de comportamento
   e emite veredito.
   - ❌ reprovado por bug → reportar o teste que falha, acionar o `developer` para corrigir,
     e voltar ao `tester`. Quem decide reiterar é você, não o fluxo.
   - ✅ aprovado → seguir.

7. **Acionar o `writer`**, quando o elemento for visível, com o `types.d.ts` e o
   comportamento que os testes provaram. A página só se escreve depois dos testes: o que
   não passou não é comportamento, é intenção.

8. **Registrar o elemento** no `index.js` do repositório, se ele não for alcançado
   automaticamente. Conferir com `bun run test`, cujo setup importa o `index.js` da raiz —
   elemento não registrado falha ali.

9. **Relatar** o caminho criado, os arquivos, o veredito do `tester` e o que ficou de fora.

## Observações

- Este fluxo não commita. Terminar aqui e disparar `/ship` mantém a revisão e o julgamento
  de versão no lugar deles.
- Um pacote por vez. Dois elementos criados juntos escondem qual deles quebrou a suíte.
- Categoria nova exige justificativa escrita do `architect` — as existentes agrupam pelo
  que o elemento **é**, e uma categoria a mais muda como todo mundo procura.
- Reaproveitar mixin existente vem antes de escrever comportamento novo. `packages/mixin/`
  está listado no contexto acima justamente para essa conferência.

---

**Criado em**: 2026-08-10
**Atualizado em**: 2026-08-25
**Versão**: 1.2
