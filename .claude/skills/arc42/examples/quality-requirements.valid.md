# ✅ §10 com cenários mensuráveis

```markdown
# §10 — Requisitos de Qualidade

## Árvore de qualidade

| Fator | Prioridade | Alvo |
|---|---|---|
| Correctness | Alta | 0 regressão em componente publicado |
| Efficiency | Alta | First render abaixo de 100 ms |
| Testability | Alta | Cobertura de linha ≥ 85% no domínio |
| Usability | Média | 0 violação de a11y nível AA |
| Portability | Baixa | Suporte às duas últimas versões de cada navegador |

## Cenários de qualidade

### Q-01 — Tempo de primeiro render

**Fonte:** usuário navega para uma página com 20 componentes kuba.
**Estímulo:** carregamento inicial, cache frio.
**Ambiente:** conexão 4G simulada, dispositivo de referência.
**Resposta:** todos os custom elements definidos e renderizados.
**Medida:** abaixo de 100 ms no p95, medido no CI a cada release.

### Q-02 — Acessibilidade de componente

**Fonte:** usuário de leitor de tela navega por um formulário.
**Estímulo:** foco percorre todos os campos.
**Resposta:** cada campo anuncia rótulo, estado e mensagem de erro.
**Medida:** 0 violação de nível AA no eixo do Storybook, verificada por
`a11y: { test: 'error' }` na story do componente.
```

## O que torna isso verificável

| Elemento | Papel |
|---|---|
| Alvo numérico | Desempata discussão; "100 ms no p95" não admite interpretação |
| Cenário com fonte, estímulo e resposta | Diz sob que condição o número vale |
| Medida com instrumento | Diz **onde** é verificado — CI, Storybook, teste |
| Prioridade | Permite negociar quando dois requisitos conflitam |

O vínculo com a skill `quality` é direto: cada fator da tabela é um dos 12
fatores McCall, e o alvo definido aqui é o que calibra a severidade de uma
violação lá.
