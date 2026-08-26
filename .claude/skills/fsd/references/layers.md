# As 7 layers em detalhe

Referência completa das layers do Feature-Sliced Design. Abrir quando a dúvida for
*"em que layer isto mora?"* — o `SKILL.md` traz a tabela resumida, aqui está o critério
de fronteira de cada uma.

Ordem de responsabilidade, do topo para a base. A regra que as liga: **um módulo só pode
importar de layers estritamente abaixo da sua.**

---

## 1. `app`

**O que é:** tudo que faz a aplicação rodar, técnico e de negócio.

**Contém:** configuração de router, montagem de store global, estilo global, providers de
contexto, integração de analytics, entrypoint do framework.

**Particularidade:** é layer **e** slice ao mesmo tempo. Não tem slices — contém segments
diretamente, e seus arquivos se importam livremente. A razão declarada: `app` só deve ter
código que diz respeito à aplicação inteira, então não há o que dividir por domínio.

**Fronteira:** se o código serve a uma tela só, é `pages`. Se serve a todas, é `app`.

---

## 2. `processes` — depreciado

**Status:** não é mais recomendada. O conteúdo migra para `features` ou `app`.

**Origem:** era válvula de escape para cenários que atravessavam várias páginas.

**O que fazer com ela:** nada. A doc a deixou deliberadamente sem definição, e a
recomendação é que aplicações novas não a criem.

---

## 3. `pages`

**O que é:** telas inteiras, ou partes grandes de tela em roteamento aninhado.
Corresponde a uma rota.

**Contém:** a UI da página, estados de carregamento, error boundaries, e as requisições de
leitura e escrita daquela tela.

**Fronteira:** não há limite de volume de código, desde que o time continue navegando bem.
Páginas parecidas podem ser agrupadas numa slice só — login e cadastro, por exemplo.

**Erro comum:** promover a `widgets` um bloco que só esta página usa. Bloco de uso único
pertence a `pages`.

---

## 4. `widgets`

**O que é:** blocos de UI grandes e autossuficientes, tipicamente reusados entre páginas.

**Contém:** componentes independentes com funcionalidade completa — layout, blocos de
router inteiros em roteamento aninhado.

**Fronteira — a que mais se erra:** o critério é **reuso entre páginas**. Um bloco grande
usado em uma página só não é widget: é parte daquela página. Widget existe para não
duplicar entre telas, não para "organizar" uma tela grande.

---

## 5. `features`

**O que é:** as interações principais que a aplicação oferece ao usuário — o que ela
*deixa fazer*.

**Contém:** formulários, chamadas de API, validação, estado interno da interação, feature
flags.

**Fronteira:** nem toda interação precisa virar feature. O critério declarado é
reusabilidade e descoberta. Uma interação usada num lugar só, e que ninguém procuraria por
nome, pode ficar na página.

**Erro comum, e o mais caro:** colocar lógica de feature em `entities`, ou lógica de
entity em `features`. A pergunta que separa: *isto descreve o que a coisa **é**, ou o que
o usuário **faz** com ela?* O primeiro é entity, o segundo é feature.

---

## 6. `entities`

**O que é:** os conceitos de negócio do mundo real com que o projeto trabalha.

**Contém:** modelo de armazenamento dos dados, schema de validação, funções de API
ligadas àquela entidade, e a representação visual dela.

**Exemplos:** numa rede social, `user`, `post`, `group`. Num app de fotos, `photo`.

**Cross-import:** é a **única** layer onde slices podem se referenciar, e só pela notação
`@x`. `entities/article/@x/comment` é lido como "article cruzado com comment", e expõe só
o que aquela relação precisa. A instrução é manter esses cross-imports no mínimo.

**Fronteira:** lógica que rege a *interação entre* duas entidades não é de nenhuma das
duas — sobe para uma layer acima.

---

## 7. `shared`

**O que é:** a base. Conexões com o exterior e bibliotecas internas, sem vínculo com o
negócio.

**Contém:** cliente de API, UI kit, libs internas de manipulação de data, cor e texto,
variáveis de ambiente, configuração global, constantes de rota, setup de tradução, logo.

**Particularidade:** como `app`, é layer e slice ao mesmo tempo — só segments, e todos os
arquivos se referenciam livremente. A razão declarada: `shared` não deve conter nenhuma
lógica de negócio, logo não tem significado de produto, logo não há o que dividir.

**Fronteira, e é a mais mal aplicada:** `shared` pode conter código *ciente da aplicação*
— constantes de rota, endpoints, ativos de marca, tipos comuns. O que ela **nunca** pode
conter é lógica de negócio, código de feature ou código de entidade. O sintoma do abuso é
que as fronteiras das entidades ficam travadas umas às outras, e o custo de refatorar
sobe.

---

## Por que não criar uma layer nova

A doc é explícita: acrescentar layer **não é recomendado**, porque a semântica das 7 é
padronizada — e é justamente a padronização que entrega a uniformidade que justifica
adotar FSD. A orientação prática, quando alguém sente falta de uma oitava:

> Se você acha que precisa de uma layer nova, provavelmente precisa de uma decomposição
> melhor.

Na prática, o que se apresenta como "layer faltando" costuma ser slice mal recortada, ou
um segment que cresceu até parecer outra coisa.

## Por que isto não se aplica a uma biblioteca

Traduzido ao pé da letra para uma biblioteca de componentes como o `kuba`, o resultado é
mecânico: nenhum pacote tem significado de produto, então tudo cai em `shared` — e
`shared` não tem slices, só segments. FSD devolveria a lista plana de pacotes.

Não é falha da metodologia: ela responde *"como recortar o domínio de uma aplicação"*, e
uma biblioteca não tem domínio para recortar. O recorte de biblioteca vem do grafo de
dependência e da razão-para-mudar — as skills [package](../../package/SKILL.md) e
[colocation](../../colocation/SKILL.md).

---

**Criado em**: 2026-08-25
**Atualizado em**: 2026-08-25
**Versão**: 1.0
