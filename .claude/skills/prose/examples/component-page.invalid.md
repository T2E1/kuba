# ❌ Página de componente com os sinais de texto gerado

Correto em: `component-page.valid.md`

O texto abaixo é o que uma página de `docs/components/` **não** deve parecer. Cada
comentário aponta o padrão do `references/catalogo.md`.

---

```markdown
# Progress

The `<kb-progress>` component stands as a **pivotal** element in the kuba design
system, serving as a testament to the library's commitment to accessible,
intuitive, and powerful user interfaces. Nestled at the intersection of form and
function, it marks a significant step in the evolution of progress indication.

## Key Features And Capabilities

- **Accessibility:** Accessibility is ensured through comprehensive ARIA support.
- **Flexibility:** Flexibility is enhanced by customizable styling options.
- **Performance:** Performance is optimized through efficient rendering.

It's not just a progress bar; it's a complete solution for communicating state.
The element serves as a bridge between the system and the user, showcasing how
thoughtful design contributes to better outcomes, highlighting the intricate
interplay between visual feedback and user confidence.

Experts in accessibility recommend progress indicators for long-running tasks.
Industry reports suggest that users abandon interfaces that appear unresponsive.

Despite its versatility, `<kb-progress>` faces challenges typical of progress
components — including determinate-only behavior. Despite these challenges, it
continues to serve as a vital part of the toolkit.

While specific details about browser support are limited based on available
information, it could potentially be argued that it might work in most modern
environments.

The future looks bright for progress indication in kuba. Exciting improvements
lie ahead! Let me know if you'd like me to expand on any section.
```

---

## O que está errado, linha a linha

| Trecho | Padrão |
|---|---|
| stands as a pivotal element, marks a significant step in the evolution | 1 — significado inflado |
| serving as a testament, commitment to | 4 — tom promocional |
| accessible, intuitive, and powerful · Accessibility, Flexibility, Performance | 10 — regra de três forçada |
| Nestled at the intersection | 4 — linguagem de anúncio |
| `## Key Features And Capabilities` | 16 — Title Case |
| `**Accessibility:** Accessibility is ensured...` | 15 — lista com cabeçalho redundante |
| It's not just a progress bar; it's a complete solution | 9 — paralelismo negativo |
| serves as a bridge | 8 — fuga do verbo *ser* |
| showcasing, highlighting, contributing to | 3 — análise superficial com `-ing` |
| intricate interplay | 7 — vocabulário de LLM |
| Experts in accessibility recommend · Industry reports suggest | 5 — atribuição vaga |
| Despite its versatility... Despite these challenges | 6 — seção formulaica |
| While specific details are limited based on available information | 20 — corte de conhecimento |
| could potentially be argued that it might | 23 — hedge empilhado |
| The future looks bright. Exciting improvements lie ahead! | 24 — conclusão genérica |
| Let me know if you'd like me to expand | 19 — resíduo de conversa |

Dezesseis padrões em vinte e nove linhas. E, apesar de todo o volume, o texto não informa
o que o elemento faz, que atributos aceita, nem quando não usá-lo.
