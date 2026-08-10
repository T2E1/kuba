# ✅ Cálculo de Instabilidade, Abstração e Distância

Módulo `domain/`, medido a partir do grafo de imports:

```
Fan-in  = 15   (15 módulos importam domain/)
Fan-out = 3    (domain/ importa 3 módulos)

I = saídas / (entradas + saídas) = 3 / (15 + 3) = 0.167
A = abstrações / total          = 8 / 12        = 0.667
D = |A + I − 1|                 = |0.667 + 0.167 − 1| = 0.166
```

Leitura:

- **I = 0.167** — estável. Muita gente depende dele, ele depende de pouco.
  Satisfaz SDP (rule 019), que pede I < 0.5 em módulos de política.
- **A = 0.667** — 67% abstrato, coerente com a estabilidade. Satisfaz SAP
  (rule 020), que pede mais de 60% de abstrações em pacotes de alto nível.
- **D = 0.166** — próximo da Main Sequence. A rule 020 pede D ≤ 0.1, então
  este módulo está aceitável mas com folga pequena: introduzir uma classe
  concreta a mais o empurra para fora.

## Os dois extremos a evitar

| Zona | A | I | Sintoma |
|---|---|---|---|
| Zona da Dor | 0 | 0 | Concreto e muito dependido — mudá-lo quebra tudo |
| Zona da Inutilidade | 1 | 1 | Abstrato e sem consumidores — abstração inventada |

Um módulo na Zona da Dor não se resolve reduzindo dependentes: resolve-se
aumentando A, colocando abstrações na fronteira por onde os dependentes entram.
