# Nome de grupo pelo conteúdo

Correto: cada nome responde *"o que provavelmente há aqui dentro?"* antes de a pasta ser
aberta.

```
packages/
├── messaging/          comunicação entre elementos
│   ├── echo/
│   └── event/
├── navigation/         decidir e trocar a página exibida
│   ├── router/
│   └── renderer/
└── pixel/              CSS: reset e design tokens
    ├── reset/
    └── tokens/
```

## Por que cada um passa

**`messaging`** — o assunto é como as partes se falam. Quem abre encontra um barramento e
helpers de handler, que é o que o nome faz esperar.

**`navigation`** — o vocabulário veio do próprio código: `router(path, page)` já usa a
palavra. Nome que o domínio sustenta não precisa ser defendido.

**`pixel`** — evocativo, mas ancorado: é a camada visual da biblioteca, e o conteúdo
(`reset/`, `tokens/`) confirma a promessa em vez de contrariá-la.

## As regras que estão sendo cumpridas

| Regra | Como aparece aqui |
|---|---|
| Nome estável e independente de versão | Nenhum carrega `v2`, `new`, `legacy` |
| Hierarquia de tecnologias, não organizacional | Nenhum nome de time ou de consumidor |
| Nome de grupo ≠ nome de pacote dentro dele | `messaging/echo`, não `events/event` |
| Teste de imediatismo | Os três dizem o assunto sem precisar de explicação |
| Plural considerado | Rejeitado aqui por serem substantivos de massa, não contáveis |

## O teste que decide

> Alguém que nunca abriu esta pasta sabe o que provavelmente há dentro, só pelo nome?

`navigation/` → rotas e troca de tela. Correto.
`messaging/` → eventos e barramento. Correto.
`pixel/` → estilo. Correto.
