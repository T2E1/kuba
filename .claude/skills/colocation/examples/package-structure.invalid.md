# ❌ Organização por tipo técnico

Correto em: `package-structure.valid.md`

```
packages/
├── components/
│   ├── button.ts
│   ├── card.ts
│   └── icon.ts
├── styles/
│   ├── button.style.js
│   ├── card.style.js
│   └── icon.style.js
├── types/
│   ├── button.d.ts
│   ├── card.d.ts
│   └── icon.d.ts
├── stories/
│   ├── button.stories.js
│   └── card.stories.js
└── tests/
    ├── button.test.js
    └── card.test.js
```

## Por que não funciona

Adicionar um atributo ao Button obriga a tocar cinco diretórios: implementação,
estilo, tipo, story e teste. É Shotgun Surgery (rule 058) codificado na
estrutura de pastas — a mudança é uma só, os lugares são cinco.

| Consequência | Detalhe |
|---|---|
| Diff ilegível | O PR toca `styles/`, `types/`, `tests/` sem relação aparente |
| Esquecimento provável | Atualizar o tipo e esquecer a story é o caso mais comum |
| Impossível extrair o pacote | Publicar só o Button exige caçar seus arquivos em cinco lugares |
| Navegação cara | Entender um componente exige abrir cinco diretórios |

O sintoma que confirma: `git log --stat` mostra que todo commit de feature
toca exatamente os mesmos cinco diretórios, sempre.
