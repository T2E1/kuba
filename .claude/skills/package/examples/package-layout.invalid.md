# ❌ Organização por tipo técnico — viola CCP (rule 016)

Correto em: `package-layout.valid.md`

```
src/
├── services/
│   ├── UserService.js
│   └── BillingService.js
├── repositories/
│   ├── UserRepository.js
│   └── InvoiceRepository.js
└── entities/
    ├── User.js
    └── Invoice.js
```

O agrupamento é por *o que a classe é*, não por *quando ela muda*.

Consequência: uma mudança no cadastro de usuário toca `entities/User.js`,
`services/UserService.js` e `repositories/UserRepository.js` — três pacotes,
uma razão. É Shotgun Surgery (rule 058) transformado em estrutura de pastas.

Sintoma que confirma: `git log --stat` mostra commits de features diferentes
sempre tocando os mesmos três diretórios.
