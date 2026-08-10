# ❌ Entrada de CHANGELOG que não diz o que mudou

Correto em: `changelog-entry.valid.md`

---

```markdown
## [0.1.0-alpha.32] — 2026-08-10

### Changed

- Significantly enhanced the naming consistency across the codebase, marking an
  important step in our ongoing commitment to code quality. This refactoring
  underscores the project's dedication to maintainability, showcasing best
  practices in action.
- Improved the styling architecture with clearer, more intuitive, and more
  maintainable function names, contributing to a better developer experience.

### Added

- Various improvements to the accessibility layer, enhancing the overall user
  experience for all users.
```

---

## Os problemas

| Trecho | Padrão | Consequência real |
|---|---|---|
| Significantly enhanced | 24 + 7 | *Quanto?* O leitor não consegue decidir se atualiza |
| marking an important step in our ongoing commitment | 1 | Fala do projeto, não da mudança |
| underscores the project's dedication | 1 + 7 | Autoelogio no lugar do fato |
| showcasing, contributing to | 3 | Enche sem informar |
| clearer, more intuitive, and more maintainable | 10 | Tríade de adjetivos sem medida |
| Various improvements | 5 | Quais? Um CHANGELOG existe para responder isso |
| enhancing the overall user experience for all users | 4 + 22 | "for all users" é redundância pura |

**O defeito que importa:** um CHANGELOG responde a uma pergunta — *o que muda para mim se
eu atualizar?* Nenhuma das três entradas responde. Quem lê não descobre que arquivo foi
renomeado, se algum import quebra, nem o que ganhou em acessibilidade.

O texto está gramaticalmente perfeito e é inútil.
