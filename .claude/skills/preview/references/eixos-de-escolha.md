# Os três eixos de escolha

Quase todo componente visível oferece variante, cor e tamanho. Os três parecem estética e
nenhum é: cada um comunica algo, e documentá-los como "opções disponíveis" desperdiça a
única chance de dizer **como escolher**.

---

## Variante — hierarquia de ênfase

`variant` expressa a importância da ação em relação às irmãs, não gosto. A tabela precisa
dar o critério, não a aparência:

| Variante | Ênfase | Use para |
|---|---|---|
| `solid` (padrão) | A mais alta | A única ação primária de uma área. Mais de uma por área e nenhuma lê como primária. |
| `naked` | Média | Ação secundária ao lado de uma `solid` — "Cancelar" ao lado de "Salvar". |
| `ghost` | Baixa | Ação terciária, onde a presença não deve competir com o conteúdo. |
| `link` | A mais baixa | Ação que se comporta como texto dentro de um parágrafo. |

Regras ao escrever a seção:

- Extraia as variantes dos estados reais em `style.js`. **Nunca invente uma variante que
  o componente não implementa** — a página vira promessa quebrada.
- A coluna que importa é "use para", não "aparência". A aparência o bloco de preview mostra.
- Diga o limite: quantas de cada por área, e o que acontece quando se ultrapassa.

## Cor — semântica, não paleta

`color` mapeia para tokens em `packages/pixel/tokens/color.css`, e cada um carrega um
significado que o componente respeita. A seção documenta o significado, não o valor:

| Cor | Significa | Use para |
|---|---|---|
| `primary` | A ação esperada | O caminho feliz |
| `danger` | Consequência destrutiva ou irreversível | Excluir, revogar, cancelar assinatura |
| `warning` | Requer atenção antes de prosseguir | Confirmação de operação sensível |

Duas armadilhas:

- **Cor sozinha não comunica.** Quem não distingue as cores só vê a forma. Toda cor com
  significado precisa de texto que o carregue — é requisito de acessibilidade, e vale
  dizê-lo na seção de estados.
- **Não documente o valor hexadecimal.** O token é o contrato; o valor muda (rule 024).

## Tamanho e largura — contexto de uso

`width` e afins não são escolha visual: dizem em que contexto o componente vive.

| Valor | Contexto |
|---|---|
| padrão | Fluxo normal, largura pelo conteúdo |
| `full` | Formulário em coluna única, ou mobile, onde o alvo de toque precisa da linha inteira |

Documente o **contexto**, não a mecânica da normalização — essa já está na tabela de
atributos e no `types.d.ts`.

---

## O teste que decide se o eixo merece seção

> Existe uma escolha errada que alguém faria sem esta seção?

Se sim, escreva a seção. Se o atributo só tem formas equivalentes sem consequência, ele
fica na tabela de atributos e pronto — seção sem regra é volume sem informação.

---

**Criado em**: 2026-08-10
**Atualizado em**: 2026-08-10
