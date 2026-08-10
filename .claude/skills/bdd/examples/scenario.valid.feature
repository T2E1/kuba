# ✅ Cenário em linguagem de negócio — sobrevive a refactor.

# language: pt
Funcionalidade: Finalização de compra
  Como cliente da loja
  Quero finalizar minha compra
  Para receber os produtos que escolhi

  Contexto:
    Dado que Maria está autenticada
    E que o carrinho de Maria tem 2 produtos

  Cenário: Compra finalizada com sucesso
    Quando Maria finaliza a compra
    Então Maria vê a confirmação do pedido
    E Maria recebe o e-mail de confirmação

  Cenário: Compra bloqueada por estoque insuficiente
    Dado que um dos produtos ficou sem estoque
    Quando Maria finaliza a compra
    Então Maria vê o aviso de produto indisponível
    E o pedido não é criado

  Esquema do Cenário: Frete calculado por região
    Dado que Maria informa o CEP <cep>
    Quando Maria finaliza a compra
    Então o frete cobrado é <frete>

    Exemplos:
      | cep       | frete   |
      | 01310-100 | R$ 12   |
      | 69900-000 | R$ 48   |
      | 88010-000 | R$ 22   |

# Por que este sobrevive:
#
#   - Nenhum termo técnico: renomear rota, tabela ou classe não o afeta.
#   - Maria tem nome: o cenário se lê como uma história, não como um setup.
#   - Verbos no presente, sempre.
#   - Cenário feliz primeiro, erro depois.
#   - O Esquema do Cenário substitui três cenários quase idênticos.
#   - Quem pediu a funcionalidade consegue ler e dizer "não é isso" —
#     que é exatamente o que o formato existe para permitir.
