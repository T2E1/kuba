# Template: Feature Gherkin (pt-BR)

## Funcionalidade simples

```gherkin
# language: pt
Funcionalidade: [Nome da funcionalidade em linguagem de negócio]
  Como [papel/persona]
  Quero [ação/objetivo]
  Para [valor/benefício]

  Contexto:
    Dado que [pré-condição comum a todos os cenários]

  Cenário: [Nome descritivo do cenário — caminho feliz]
    Dado que [estado inicial]
    Quando [ação executada]
    Então [resultado esperado]
    E [resultado adicional, se necessário]

  Cenário: [Nome descritivo — cenário de erro]
    Dado que [estado que causa erro]
    Quando [ação executada]
    Então [mensagem ou comportamento de erro esperado]
```

## Cenário com múltiplos exemplos (Esquema)

```gherkin
  Esquema do Cenário: [Nome do cenário parametrizado]
    Dado que o campo "<campo>" tem o valor "<valor>"
    Quando o formulário é submetido
    Então o resultado deve ser "<resultado>"

    Exemplos:
      | campo  | valor              | resultado |
      | email  | alice@example.com  | válido    |
      | email  | nao-e-email        | inválido  |
      | nome   |                    | inválido  |
```
