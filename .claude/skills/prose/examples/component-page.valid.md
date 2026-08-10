# ✅ Página de componente escrita para ser lida

Incorreto em: `component-page.invalid.md`

Adaptado de `docs/components/progress.md`, que é o padrão real deste repositório.

---

```markdown
# Progress

Shows how far along a task is, as a filled fraction of a horizontal track. It's
determinate only: `value` is a percentage you set, so the bar can't express
"working, duration unknown" — it would just sit at whatever number it was given.

## Usage

<kb-progress value="60" alt="Uploading"></kb-progress>

## When to use

- **A task with a known fraction complete** — an upload, a multi-step form, a
  batch job reporting items processed.
- **A quantity against a ceiling** — storage used, quota consumed.

## When not to use

- **Work of unknown duration.** Use a spinner. Parking the bar at an arbitrary
  value to mean "loading" tells the user something false.

## States and accessibility

- The host carries `role="progressbar"`, published through `ElementInternals`,
  with `value` mirrored onto `aria-valuenow` on every change. The scale is fixed
  at 0-100, because `value` is applied straight into CSS as a `%`.
- **Give it an `alt`.** The role and the number are announced, but nothing says
  *what* is progressing.
- The track defaults to `--color-pure-white`, which disappears on a white
  surface. On a light page, set `--progress-color-track` to a neutral.
- Never rely on the fill alone to convey a state change — pair a `danger` bar
  with text, since color is the only difference.
```

---

## Por que funciona

**A primeira frase diz o que é**, e a segunda já diz o limite: determinado apenas. O leitor
sabe em duas linhas se veio ao lugar certo.

**`When not to use` é tão específico quanto `When to use`**, e traz o julgamento junto:
"parking the bar at an arbitrary value tells the user something false". Isso é opinião, e
é o que impede o erro.

**Cada afirmação é verificável.** `role="progressbar"`, `aria-valuenow`, `0-100`,
`--color-pure-white`. Nada de "acessibilidade abrangente".

**O verbo é `is` e `has`.** Nenhum *serves as*, nenhum *boasts*.

**O ritmo varia.** Frases curtas ("Use a spinner.") entre frases longas.

**O único travessão da página** está onde uma vírgula ficaria ambígua.

Compare o volume: a versão inválida tem mais linhas e menos informação. É o efeito
característico — o texto inflado ocupa espaço no lugar de conteúdo.
