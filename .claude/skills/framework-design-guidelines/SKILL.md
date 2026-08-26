---
name: framework-design-guidelines
model: opus
description: Nomes de namespace, pacote e grupo de pastas pelas .NET Framework Design Guidelines — o template Empresa.Produto.Feature.Subnamespace, os DO/CONSIDER/DO NOT de Cwalina e Abrams, a proibição de hierarquia organizacional como base, e as regras de conflito entre nome de namespace e nome de tipo. Use ao nomear um pacote, um grupo de pastas ou um módulo publicado, ao julgar se um nome de diretório é genérico demais, ou ao decidir a hierarquia de um monorepo. Não use para nomear classe, método, variável ou arquivo — é a skill naming; nem para design token — é a skill token.
---

# Names of Namespaces

## O que é

O critério de nomenclatura para **agrupamentos** — namespace, pacote, grupo de pastas —
das *Framework Design Guidelines* de Krzysztof Cwalina e Brad Abrams.

Um objetivo governa tudo o mais:

> Criar clareza suficiente para que o programador que usa o framework saiba **de imediato**
> o que provavelmente há dentro daquele agrupamento.

É o teste que reprova nomes como `core`, `common`, `util`, `service` e `manager`. Nenhum
deles diz o que há dentro; todos passam a impressão de que dizem.

## Quando usar

| Situação | Ação |
|---|---|
| Nomeando um pacote novo | Aplicar o template e o teste de imediatismo |
| Nomeando um grupo de pastas num monorepo | Idem, mais a proibição de hierarquia organizacional |
| Um diretório se chama `core`, `common` ou `util` | Reprovado pelo teste — renomear pelo conteúdo |
| Um pacote e um tipo dentro dele têm o mesmo nome | Regra de conflito, abaixo |
| Decidindo entre singular e plural | `CONSIDER` plural, com exceção de marca e acrônimo |
| Julgando um nome proposto por alguém | Os DO/DO NOT como grade |

**Não use para:** nomear classe, método, variável, campo ou arquivo — é a skill `naming`.
Nem para design token — é a skill `token`. Esta skill trata só do nome do **agrupamento**.

## Como aplicar

### O template

```
Empresa.(Produto | Tecnologia)[.Feature][.Subnamespace]
```

Exemplos da própria fonte: `Fabrikam.Math`, `Litware.Security`.

Num monorepo JavaScript o mapeamento direto é o escopo npm mais o caminho do pacote —
`@empresa/produto`, e as pastas de agrupamento ocupam a posição de `Feature`.

### As regras, com o verbo normativo original

| Verbo | Regra |
|---|---|
| **DO** | Prefixar com o nome da empresa, para que namespaces de empresas diferentes não colidam |
| **DO** | Usar no segundo nível um nome de produto **estável e independente de versão** |
| **DO NOT** | Usar hierarquia organizacional como base da hierarquia de nomes |
| **DO** | Usar PascalCasing, separando componentes por ponto — salvo se a marca usa outra grafia |
| **CONSIDER** | Plural quando couber: `System.Collections`, não `System.Collection` |
| **DO NOT** | Dar o mesmo nome a um namespace e a um tipo dentro dele |

**A regra da hierarquia organizacional é a mais subestimada.** A razão declarada é que nomes
de grupos dentro de empresas têm vida curta — o time muda, o nome fica. A instrução é
organizar a hierarquia em torno de **grupos de tecnologias relacionadas**, não de quem as
mantém. Vale igual para "quem consome": agrupar por consumidor é volátil pela mesma razão.

**A exceção do plural** é marca e acrônimo: `System.IO`, não `System.IOs`.

### Conflitos de nome de tipo

A diretriz mais citada, e a que mais se viola sem perceber:

> **DO NOT** introduzir nomes de tipo genéricos como `Element`, `Node`, `Log`, `Message`.

A probabilidade de colisão é altíssima. A correção é qualificar: `FormElement`, `XmlNode`,
`EventLog`, `SoapMessage`.

As guidelines separam quatro categorias de namespace, com rigor decrescente:

| Categoria | Regra de conflito |
|---|---|
| **Core** — `System`, `System.IO`, `System.Xml`, `System.Net` | Nunca dar a um tipo nome que colida com um tipo de Core. `Stream` está proibido |
| **Application model** — `System.Windows*`, `System.Web.UI*` | Não repetir nome de tipo dentro do mesmo modelo de aplicação |
| **Technology group** — mesmos dois primeiros nós | Tipos da mesma tecnologia não colidem entre si, nem com o modelo de aplicação com que a tecnologia é usada |
| **Infrastructure** — raramente importadas | Evitar conflito não é crítico |

O que isto vira num repositório sem namespaces: **nome de grupo não pode ser igual a nome
de pacote dentro dele.** Um grupo `events/` contendo um pacote `event/` produz o caminho
`events/event` — ruído sem informação, e exatamente o que a regra proíbe.

### O teste de imediatismo

O que a fonte pede em uma pergunta, aplicável a qualquer nome de agrupamento proposto:

> Alguém que nunca abriu esta pasta sabe o que provavelmente há dentro, só pelo nome?

Reprovam por serem posição em vez de conteúdo: `core`, `base`, `common`, `shared`, `misc`,
`util`, `helpers`, `service`, `manager`, `infra`.

Reprova também o oposto — nome que promete o que não há dentro, que é a rule 035. Um grupo
chamado `reactive/` cujo código não é reativo mente com mais eficiência do que `core/`,
porque o leitor confia nele.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Nome de grupo pelo conteúdo versus por posição na arquitetura | [group-name.valid.md](examples/group-name.valid.md) | [group-name.invalid.md](examples/group-name.invalid.md) |
| Tipo qualificado versus nome genérico que colide | [type-conflict.valid.js](examples/type-conflict.valid.js) | [type-conflict.invalid.js](examples/type-conflict.invalid.js) |

## Checklist

- [ ] O nome diz o que há dentro, não onde fica na arquitetura
- [ ] Nenhum grupo chamado `core`, `common`, `util`, `shared`, `service` ou `manager`
- [ ] O nome não promete comportamento que o código não tem (rule 035)
- [ ] O segundo nível é estável e independente de versão
- [ ] A hierarquia é de tecnologias relacionadas, não de times nem de consumidores
- [ ] Nenhum nome de grupo igual ao nome de um pacote dentro dele
- [ ] Nenhum tipo com nome genérico: `Element`, `Node`, `Log`, `Message`, `Stream`
- [ ] Plural considerado, com exceção de marca e acrônimo

## Troubleshooting

### Todo nome que penso soa genérico

**Causa:** o agrupamento foi decidido por camada arquitetural, e camada não tem conteúdo
próprio para nomear — só posição.
**Solução:** o problema é o recorte, não o nome. Reagrupar pelo que os membros de fato
fazem; o nome aparece sozinho quando o grupo tem assunto.

### O nome bom já é o de um pacote dentro do grupo

**Causa:** o grupo tem um membro dominante, e os outros são satélites dele.
**Solução:** provavelmente não é um grupo — é um pacote com submódulos. Promover o membro
dominante a pacote e rebaixar os outros a segments dele.

### Preciso do nome de um time ou de um consumidor para desambiguar

**Causa:** dois agrupamentos com o mesmo assunto, separados por quem os usa.
**Solução:** é exatamente o `DO NOT` da hierarquia organizacional. Nome de time e de
consumidor tem vida curta; o assunto não. Desambiguar pela tecnologia, ou fundir os dois.

## Rules relacionadas

- [035 — Proibição de Nomes Enganosos](../../rules/035_proibicao-nomes-enganosos.md): o nome de agrupamento que promete o que não entrega é desinformação, e engana mais que o genérico.
- [006 — Proibição de Nomes Abreviados](../../rules/006_proibicao-nomes-abreviados.md): o teste de imediatismo é o mesmo critério, aplicado ao agrupamento em vez de ao identificador.
- [034 — Nomes de Classes e Métodos Consistentes](../../rules/034_nomes-classes-metodos-consistentes.md): substantivo para o que é uma coisa — o agrupamento segue a mesma gramática.
- [016 — Princípio do Fechamento Comum](../../rules/016_principio-fechamento-comum.md): um grupo só tem nome bom quando tem assunto, e o assunto vem da razão-para-mudar comum.
- [064 — Proibição de Overengineering](../../rules/064_proibicao-overengineering.md): grupo de um membro só é cerimônia, e nenhum nome o salva.

## Skills relacionadas

- [naming](../naming/SKILL.md): complements — esta nomeia o agrupamento; `naming` nomeia o que está dentro dele.
- [package](../package/SKILL.md): depends on — o recorte vem dos princípios de coesão e acoplamento; o nome só se decide depois que o grupo tem assunto.
- [fsd](../fsd/SKILL.md): complements — FSD dá a forma dos níveis; esta dá o critério de nome de cada um.
- [prose](../prose/SKILL.md): reinforces — o mesmo repúdio ao vocabulário genérico que não carrega significado.

---

**Criado em**: 2026-08-25
**Atualizado em**: 2026-08-25
**Versão**: 1.0
