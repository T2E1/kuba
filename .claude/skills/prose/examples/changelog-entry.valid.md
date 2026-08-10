# ✅ Entrada de CHANGELOG escrita para quem consome

Incorreto em: `changelog-entry.invalid.md`

Texto real de `CHANGELOG.md`, versões `alpha.31` e `alpha.32`.

---

```markdown
## [0.1.0-alpha.32] — 2026-08-10

### Changed

- The file declaring a package's Symbol contracts is now named `interfaces.js`
  in every package. Six packages spelled it `interface.js` — `<kb-fetch>`,
  `<kb-dataset>`, `<kb-helper>`, `<kb-label>` and the `Hidden` and `Identity`
  mixins. The file is internal and never exported, so nothing consumers import
  changes.

## [0.1.0-alpha.31] — 2026-08-09

### Added

- `<kb-icon>` and `<kb-logo>` accept `alt`. Without it they now hide themselves
  from assistive technology, which is what you want whenever a visible label
  already carries the meaning — previously an icon was announced by its Material
  Symbols ligature name, so `use="cloud_upload"` was read aloud as
  "cloud_upload", and the logo was an unlabelled graphic. Given an `alt`, both
  become a named image.
```

---

## Por que funciona

**Nomeia o que mudou, exatamente.** `interface.js` → `interfaces.js`, e lista os seis
pacotes. Quem mantém um fork sabe o que fazer.

**Antecipa a pergunta do leitor e responde.** "The file is internal and never exported, so
nothing consumers import changes" — é a única coisa que o consumidor quer saber, e vem
antes de ele perguntar.

**Explica o efeito com o caso concreto.** Não "melhorias de acessibilidade", mas: o ícone
era anunciado como "cloud_upload". Quem já ouviu isso num leitor de tela reconhece o
problema na hora.

**Diz o comportamento nos dois lados.** Sem `alt` esconde; com `alt` vira imagem nomeada.
Os dois caminhos, não só o feliz.

**Nenhum adjetivo de qualidade.** Nada de *significantly*, *improved*, *enhanced*. O fato
carrega o juízo sozinho.

**O travessão faz trabalho** — introduz a lista de pacotes, onde vírgula seria ambígua
porque a própria lista já tem vírgulas.

Repare que o texto é longo. Prosa humana não é prosa curta: é prosa onde cada linha carrega
informação que o leitor não tinha.
