# ❌ A mesma decisão em duas camadas

Correto em: `layer-choice.valid.md`

Este é o caso real que aconteceu neste repositório, e o defeito que a escolha de camada
existe para evitar. O erro não é de forma — os dois arquivos passavam no validador.

---

## O que existia

**`commands/ship.md`** trazia a tabela de impacto de versão:

```markdown
4. Determinar o impacto de versão a partir do tipo do commit:

   | Tipo | Bump |
   |---|---|
   | `feat!:` ou `BREAKING CHANGE:` | major |
   | `feat:` | minor |
   | `fix:`, `perf:`, `refactor:` | patch |
   | `docs:`, `chore:`, `test:` | nenhum |
```

**`agents/releaser.md`** trazia outra:

```markdown
| Mudança | Impacto |
|---|---|
| Renomear ou remover evento despachado | **major** |
| Renomear ou remover atributo ou propriedade | **major** |
| Elemento, atributo ou variante novos | **minor** |
| Correção de comportamento que estava errado | **patch** |
```

## Por que quebra

As duas respondem à mesma pergunta e **discordam**. Renomear o evento `change` para
`changed`:

| Segundo | Critério | Veredito |
|---|---|---|
| `ship` | o commit foi escrito como `feat:` | **minor** |
| `releaser` | quebra HTML que já existe no consumidor | **major** |

O `releaser` está certo. Mas nada no repositório dizia qual das duas valia, e a versão
saiu conforme quem chegou primeiro.

## O erro de camada

O `/ship` é um **command**: sequencia. Determinar impacto de versão é **julgamento** sobre
o caso concreto — se aquele HTML específico deixa de funcionar. Julgamento é agent.

O command tinha absorvido a decisão porque, no momento em que foi escrito, era mais rápido
do que acionar alguém. A tabela envelheceu sozinha, sem ninguém para mantê-la.

## O sinal genérico

> Se a mesma tabela de decisão existe em dois artefatos, um deles está na camada errada.

Não importa qual parece mais completa. A pergunta é: **isto é julgar ou sequenciar?**
