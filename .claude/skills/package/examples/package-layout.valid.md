# ✅ Organização por razão-para-mudar — CCP (rule 016)

```
src/
├── user/
│   ├── User.js
│   ├── UserService.js
│   ├── UserRepository.js
│   └── UserFactory.js
└── billing/
    ├── Invoice.js
    ├── Payment.js
    └── BillingService.js
```

O agrupamento é por *quando a classe muda*. A feature de usuário vive num lugar
só: a mudança é local, o diff é legível e o pacote pode ser versionado sozinho
(REP, rule 015).

Como decidir onde um arquivo novo mora: pergunte com quais arquivos ele mudará
pela mesma razão. É com eles que ele fica.

Contrapeso: se `user/` crescer a ponto de um consumidor precisar importar o
pacote inteiro para usar duas classes, CRP (rule 017) passa a pedir a divisão.
O equilíbrio é o triângulo REP/CCP/CRP.
