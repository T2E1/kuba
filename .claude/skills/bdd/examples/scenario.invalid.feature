# ❌ Cenário vazando implementação.
# Correto em: scenario.valid.feature

# language: pt
Funcionalidade: Checkout

  Cenário: POST /api/orders retorna 201
    Dado que existe um registro na tabela users com id 42
    E que o campo status da tabela carts é 'OPEN'
    Quando o cliente envia POST para /api/orders com body {"cartId": 17}
    Então a API retorna status 201
    E a tabela orders recebe uma linha com user_id = 42
    E o seletor .checkout-success fica visível no DOM

# Cada linha depende de algo que muda sem o comportamento mudar:
#
#   - status HTTP e rota: renomear o endpoint quebra o cenário
#   - nome de tabela e coluna: uma migration quebra o cenário
#   - IDs internos (42, 17): não significam nada para quem pediu a feature
#   - seletor CSS: um refactor de estilo quebra o cenário
#
# O resultado é um arquivo que quebra toda semana sem que nenhum
# comportamento tenha mudado — e que o stakeholder não consegue validar,
# perdendo justamente a razão de existir do Gherkin.
#
# Sinal claro: se o cenário pode ser lido apenas por quem conhece o schema
# do banco, ele deveria ser um teste de integração, não uma feature.
