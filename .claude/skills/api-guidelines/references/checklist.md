# O checklist completo das Rust API Guidelines

As 11 categorias com todos os itens `C-XXX`. Abrir quando o `SKILL.md` não cobrir o caso —
ele traz apenas os itens que atravessam para JavaScript.

A coluna **JS** diz se o item se aplica fora do Rust:

- **sim** — vale integralmente, e o `SKILL.md` o desenvolve
- **adaptado** — a ideia vale, o mecanismo muda
- **não** — depende de recurso exclusivo do Rust (traits, ownership, lifetimes, Cargo)

---

## 1. Naming — o pacote segue as convenções da linguagem

| Item | O que exige | JS |
|---|---|---|
| `C-CASE` | Casing conforme RFC 430 | sim |
| `C-CONV` | Conversões seguem `as_`, `to_`, `into_` | sim |
| `C-GETTER` | Getter sem prefixo `get_` | sim |
| `C-ITER` | Coleções produzem `iter`, `iter_mut`, `into_iter` | adaptado |
| `C-ITER-TY` | O tipo do iterador tem o nome do método que o produz | adaptado |
| `C-FEATURE` | Nome de feature sem palavra de enchimento | adaptado |
| `C-WORD-ORDER` | Ordem de palavras consistente | sim |

**`C-CASE` em detalhe.** Tipo e trait em `UpperCamelCase`; função, método e módulo em
`snake_case`; constante e estático em `SCREAMING_SNAKE_CASE`; parâmetro de tipo em uma
letra maiúscula. Duas regras finas: acrônimo em `UpperCamelCase` conta como **uma palavra**
(`Uuid`, não `UUID`), e em `snake_case` evita-se palavra de uma letra fora do fim
(`btree_map`, não `b_tree_map`). Nome de crate não leva sufixo `-rs` nem `-rust`.

**`C-CONV` em detalhe.** A tabela que o `SKILL.md` resume:

| Prefixo | Custo | Posse |
|---|---|---|
| `as_` | grátis | emprestado → emprestado |
| `to_` | caro | emprestado → emprestado ou possuído |
| `into_` | variável | possuído → possuído |

Exemplos canônicos: `str::as_bytes` é grátis e devolve vista; `str::to_lowercase` aloca e
devolve `String`; `String::into_bytes` é grátis mas consome a entrada. Wrapper de valor
único oferece `into_inner`.

**`C-ITER` em detalhe.** Vale para coleção homogênea. Tipo especializado não segue —
`str` oferece `bytes()` e `chars()`, não `iter()`. Em JavaScript o equivalente é
`Symbol.iterator` mais `entries`, `keys`, `values`.

**`C-FEATURE`.** Nome direto, sem palavra de enchimento: `std`, não `use-std` nem
`with-std`. Em JavaScript vale para condição de `exports` e flag de build.

---

## 2. Interoperability — o pacote convive com o resto do ecossistema

| Item | O que exige | JS |
|---|---|---|
| `C-COMMON-TRAITS` | Tipos implementam `Copy`, `Clone`, `Eq`, `Ord`, `Hash`, `Debug`, `Display`, `Default` | não |
| `C-CONV-TRAITS` | Conversões usam `From`, `AsRef`, `AsMut` | não |
| `C-COLLECT` | Coleções implementam `FromIterator` e `Extend` | adaptado |
| `C-SERDE` | Estruturas implementam `Serialize` e `Deserialize` | adaptado |
| `C-SEND-SYNC` | Tipos são `Send` e `Sync` quando possível | não |
| `C-GOOD-ERR` | Tipos de erro são significativos e bem-comportados | sim |
| `C-NUM-FMT` | Tipos numéricos oferecem formatação `Hex`, `Octal`, `Binary` | não |
| `C-RW-VALUE` | Funções genéricas de leitura e escrita recebem por valor | não |

Em JavaScript, `C-COLLECT` vira `Symbol.iterator` e aceitar iterável em vez de exigir
array; `C-SERDE` vira `toJSON` e um construtor estático correspondente; `C-GOOD-ERR` é a
rule 027 — erro de domínio nomeado, nunca `null` nem string solta.

---

## 3. Macros — o pacote apresenta macros bem-comportadas

| Item | O que exige | JS |
|---|---|---|
| `C-EVOCATIVE` | A sintaxe de entrada evoca a saída | adaptado |
| `C-MACRO-ATTR` | Macros compõem com atributos | não |
| `C-ANYWHERE` | Macros de item funcionam onde item é permitido | não |
| `C-MACRO-VIS` | Macros de item suportam especificador de visibilidade | não |
| `C-MACRO-TY` | Fragmentos de tipo são flexíveis | não |

`C-EVOCATIVE` é o único que atravessa: o equivalente mais próximo em JavaScript é o
decorator. `on.click` evoca o que produz; `handler(3)` não.

---

## 4. Documentation — o pacote é abundantemente documentado

| Item | O que exige | JS |
|---|---|---|
| `C-CRATE-DOC` | Doc de nível de pacote é completa e tem exemplo | sim |
| `C-EXAMPLE` | Todo item tem exemplo na documentação | sim |
| `C-QUESTION-MARK` | Exemplos não usam `unwrap` | adaptado |
| `C-FAILURE` | A doc da função cobre erro, panic e segurança | sim |
| `C-LINK` | A prosa tem link para o que cita | sim |
| `C-METADATA` | O manifesto tem os metadados comuns | sim |
| `C-RELNOTES` | As notas de release cobrem toda mudança significativa | sim |
| `C-HIDDEN` | A doc não mostra detalhe de implementação inútil | sim |

`C-QUESTION-MARK` em JavaScript: o exemplo trata o erro de verdade, em vez de ignorar a
promise ou engolir o `catch`. `C-METADATA` é o `package.json` completo — `description`,
`license`, `repository`, `homepage`, `keywords`.

---

## 5. Predictability — o código age como parece que age

| Item | O que exige | JS |
|---|---|---|
| `C-SMART-PTR` | Ponteiro inteligente não adiciona método próprio | adaptado |
| `C-CONV-SPECIFIC` | A conversão vive no tipo mais específico envolvido | sim |
| `C-METHOD` | Função com receptor claro é método | sim |
| `C-NO-OUT` | Função não recebe parâmetro de saída | sim |
| `C-OVERLOAD` | Sobrecarga de operador não surpreende | adaptado |
| `C-DEREF` | Só ponteiro inteligente implementa `Deref` | não |
| `C-CTOR` | Construtor é método estático inerente | sim |

`C-SMART-PTR` em JavaScript é sobre `Proxy`: um proxy que envolve outro objeto não deve
introduzir métodos próprios que colidam com os do alvo. `C-OVERLOAD` cobre `toString`,
`valueOf`, `Symbol.toPrimitive` e `Symbol.iterator`.

---

## 6. Flexibility — o pacote atende casos reais diversos

| Item | O que exige | JS |
|---|---|---|
| `C-INTERMEDIATE` | Funções expõem resultado intermediário, evitando trabalho repetido | sim |
| `C-CALLER-CONTROL` | Quem chama decide onde copiar e alocar | adaptado |
| `C-GENERIC` | Funções minimizam suposições sobre os parâmetros | sim |
| `C-OBJECT` | Traits são object-safe quando úteis como objeto | não |

`C-GENERIC` em JavaScript: aceitar iterável em vez de exigir array; aceitar
`ArrayLike` em vez de exigir `NodeList`.

---

## 7. Type Safety — o pacote usa bem o sistema de tipos

| Item | O que exige | JS |
|---|---|---|
| `C-NEWTYPE` | Newtypes criam distinção estática | sim |
| `C-CUSTOM-TYPE` | Argumentos comunicam significado por tipo, não por `bool` nem `Option` | sim |
| `C-BITFLAG` | Conjunto de flags é bitflags, não enum | adaptado |
| `C-BUILDER` | Builders constroem valores complexos | sim |

Os três que atravessam correspondem, nesta ordem, às rules 003, 037 e 033.

---

## 8. Dependability — o pacote dificilmente faz a coisa errada

| Item | O que exige | JS |
|---|---|---|
| `C-VALIDATE` | Funções validam os próprios argumentos | sim |
| `C-DTOR-FAIL` | Destrutores nunca falham | adaptado |
| `C-DTOR-BLOCK` | Destrutor que pode bloquear oferece alternativa | adaptado |

Os dois de destrutor viram, em custom elements, `disconnectedCallback`: ele não pode
lançar, e limpeza que precisa esperar algo oferece um método explícito.

---

## 9. Debuggability — o pacote é fácil de depurar

| Item | O que exige | JS |
|---|---|---|
| `C-DEBUG` | Todo tipo público tem representação de depuração | sim |
| `C-DEBUG-NONEMPTY` | A representação nunca é vazia | sim |

---

## 10. Future Proofing — o pacote evolui sem quebrar quem o usa

| Item | O que exige | JS |
|---|---|---|
| `C-SEALED` | Traits seladas impedem implementação de fora | adaptado |
| `C-STRUCT-PRIVATE` | Estruturas têm campos privados | sim |
| `C-NEWTYPE-HIDE` | Newtypes encapsulam detalhe de implementação | sim |
| `C-STRUCT-BOUNDS` | Estruturas não duplicam bounds derivados | não |

**É o grupo que separa biblioteca de aplicação.** `C-SEALED` em JavaScript se aproxima com
`Symbol` não exportado: sem a chave, ninguém implementa o contrato de fora.
`C-STRUCT-PRIVATE` é campo `#`.

---

## 11. Necessities — para quem importa, importa muito

| Item | O que exige | JS |
|---|---|---|
| `C-STABLE` | Dependência pública de pacote estável é estável | sim |
| `C-PERMISSIVE` | O pacote e suas dependências têm licença permissiva | sim |

`C-STABLE` tem uma consequência que se esquece: se o tipo de um terceiro aparece na
assinatura pública, a versão dele passou a fazer parte do seu contrato.

---

**Criado em**: 2026-08-25
**Atualizado em**: 2026-08-25
**Versão**: 1.0
