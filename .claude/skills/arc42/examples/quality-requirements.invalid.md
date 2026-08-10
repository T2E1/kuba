# ❌ §10 escrita com adjetivos

Correto em: `quality-requirements.valid.md`

```markdown
# §10 — Requisitos de Qualidade

O sistema deve ser rápido e responsivo.
A aplicação precisa ser segura e confiável.
O código deve ser fácil de manter.
A interface deve ser acessível.
```

## Por que isso não serve

Nenhuma das quatro frases pode ser verificada. "Rápido" para quem, medindo o
quê, em que percentil? Se ninguém consegue dizer se o requisito foi atendido,
ele não é um requisito — é uma intenção.

| Problema | Consequência |
|---|---|
| Sem métrica | Impossível saber se o sistema atende |
| Sem cenário | Não se sabe sob que carga ou condição |
| Sem prioridade | Tudo parece igualmente importante, então nada é |
| Sem responsável | Ninguém verifica |

O sintoma prático: numa discussão sobre performance, cada pessoa defende um
número diferente, e a §10 não desempata.
