# LLD — `kb-rating` (forma errada)

Viola o framework: pula direto para código sem os 5 passos.

```
Usuário: "cria um componente de rating"
Assistente: cria packages/kb-rating/component.js com:
  - atributo `stars` (não fica claro se é o valor atual, o máximo, ou os dois)
  - nenhum evento — o consumidor não sabe quando o usuário mudou a nota
  - `readOnly` como boolean flag misturado com `compact` como boolean flag
    no mesmo elemento (rule 037)
  - cinco custom elements <kb-star> separados, cada um com sua própria
    lógica de hover, sem necessidade — fragmentação sem razão de mudança
    independente (rule 064)
  - nenhuma menção a teclado ou leitor de tela até a revisão apontar
```

Por que é a forma errada:

- **Passo 1 pulado**: não ficou claro se é interativo, se precisa de formulário, se tem
  precisão de meia estrela — a implementação assume respostas em vez de perguntar.
- **Passo 2 pulado**: `stars` é um nome ambíguo que mistura dois conceitos (rule 035 —
  nomes enganosos). `readOnly`/`compact` como flags é exatamente o padrão que a rule 037
  proíbe, e que o passo 2 existe para pegar antes do código.
- **Passo 3 pulado**: cinco `<kb-star>` sem razão de mudança independente é
  overengineering (rule 064) — o mesmo erro que o framework original chama de
  "over-splitting a simple component".
- **Passo 4 pulado**: sem evento, o componente não pode ser controlado nem não
  controlado de forma previsível — o consumidor não tem como saber que o valor mudou.
- **Passo 5 pulado**: acessibilidade e teclado chegam como correção tardia em revisão, em
  vez de decisão registrada antes da implementação.
