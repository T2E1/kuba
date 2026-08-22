# Proibição de Dado de Consumidor Vazado

**ID**: STRUCTURAL-071
**Severity**: 🟠 High
**Category**: Structural

---

## What it is

Proíbe que código publicado por esta biblioteca — o que roda no shadow DOM de um elemento,
não um exemplo de uso — contenha conteúdo editorial de um consumidor real: nome de
empresa, linha de copyright, ano fixo, endereço ou texto de marketing. Uma biblioteca não
decide o produto de quem a consome.

*(Variante de vazamento de dado do anti-pattern Lava Flow: aqui o resíduo não é código
morto, é conteúdo vivo, testado e documentado como se fosse decisão de produto.)*

## Why it matters

- Um fallback de slot com dado de terceiro publica, sem consentimento, o nome de um
  consumidor real para todo novo consumidor da biblioteca
- O conteúdo tende a ser tratado como decisão de forma pelos ofícios seguintes — `architect`,
  `tester`, `writer` — que documentam e cobrem o lixo como se fosse produto
  legítimo, exatamente porque nenhum deles tem como saber a origem do texto
- Ano fixo (`© 2025`) expira sozinho, sem nada que force a correção
- Idioma isolado (uma única string em português num componente cujo resto é inglês) é
  sinal de que o texto não nasceu como exemplo didático da biblioteca

## Objective Criteria

- [ ] Nenhum literal de conteúdo editorial — nome de organização, linha de copyright, ano
  calendário fixo, endereço, texto de marketing — em template (`component.js`) de elemento
  publicado.
- [ ] Exemplos em `docs/`, testes e JSDoc usam apenas placeholder reservado ou canônico:
  `example.com` (RFC 2606), `Your Company`, `acme`, `ada`.
- [ ] Nenhuma string do template ou do exemplo está num idioma diferente do resto do
  arquivo, sem justificativa de i18n explícita.

## Allowed Exceptions

- **Metadados da própria biblioteca**: nome, licença e ano de copyright do próprio `kuba`
  (ex.: `package.json`, `LICENSE`), que são dado de produto legítimo do repositório.
- **Fixture de teste de terceiro**: dado de organização usado deliberadamente para provar
  isolamento ou sanitização (ex.: teste de `escaping` que injeta um nome malicioso), desde
  que marcado como tal no próprio teste.

## How to Detect

### Manual

- Ler o `component.js` de cada elemento publicado: qualquer nome próprio, ano fixo ou
  copyright ali é suspeito por padrão
- Buscar string num idioma que destoa do resto do arquivo — sinal de dado copiado de outro
  projeto, não escrito para o exemplo

### Automatic

- Sem regra nativa de Biome para conteúdo editorial em template — `grep -rniE
  "©|copyright" src/**/component.js` deve retornar vazio; viável como checagem de CI.

## Related to

- [024 - Prohibition of Magic Constants](024_proibicao-constantes-magicas.md): complements — magic constants cobre valor/tipo/estado; esta cobre conteúdo editorial.
- [056 - Prohibition of Zombie Code (Lava Flow)](056_proibicao-codigo-zombie-lava-flow.md): reinforces — mesma família de resíduo não questionado, aqui como conteúdo vivo em vez de código morto.
- [035 - Prohibition of Misleading Names](035_proibicao-nomes-enganosos.md): complements — o dado vazado engana o leitor sobre o que é produto da biblioteca.

---

**Created on**: 2026-08-21
**Updated on**: 2026-08-21
**Version**: 1.0
