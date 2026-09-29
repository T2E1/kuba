---
title: "God Component"
category: "Component Anti-Patterns"
type: reference
id: "STRUCTURAL-042"
severity: "🟠 High"
tags: [component-anti-patterns]
---

# God Component

## Explanation

### O que é

Exige que um componente tenha **uma** razão para mudar. Buscar dado, decidir navegação,
controlar formulário e desenhar a tela são quatro razões diferentes; reunidas num arquivo,
qualquer uma delas obriga a reabrir as outras três. Esta rule mede responsabilidades; o
tamanho em linhas é a rule 039.

*(Previne o anti-pattern Long Component with Too Much Responsibility: o componente que
concentra a feature inteira.)*

### Por que importa

- Quatro razões para mudar significam quatro motivos de conflito no mesmo arquivo, e o
  conflito de merge passa a ser rotina numa equipe pequena
- Nenhuma das responsabilidades é reusável isoladamente: a próxima tela que precisa só do
  formulário leva a busca de dado junto
- O teste tem de montar tudo para provar qualquer coisa, e a suíte fica lenta antes de
  ficar útil
- A revisão perde foco: o diff mistura mudança de dado, de fluxo e de aparência, e
  nenhuma delas é julgada com atenção
- O componente vira o lugar onde todo requisito novo cabe, e cresce por acúmulo até
  ninguém mais entender o todo

## How-to

### Exemplo

```tsx
// ❌ busca, valida, navega, formata e desenha — quatro razões para mudar
function PrescriptionPage() {
  const patient = useQuery(…); const drugs = useQuery(…)
  const [form, setForm] = useState(…); const navigate = useNavigate()
  useEffect(() => { /* sincroniza form com patient */ }, [patient])
  const total = drugs.data?.reduce(…)
  const submit = async () => { await api.post(…); navigate('/done') }
  return <form onSubmit={submit}>…</form>
}
```

```tsx
// ✅ cada responsabilidade com dono; a página só compõe
function PrescriptionPage() {
  return (
    <PrescriptionProvider>
      <PatientHeader />
      <DrugList />
      <PrescriptionForm onIssued={goToDone} />
    </PrescriptionProvider>
  )
}
```

Codetag sugerido para dívida não resolvida agora:

```typescript
// REFACTOR(077): PrescriptionPage acumula 4 responsabilidades
// TODO: extrair PatientHeader, DrugList, PrescriptionForm e o hook usePrescriptionDraft
```

## Reference

### Critérios Objetivos

- [ ] Um componente tem **1** razão para mudar, declarável numa frase sem a conjunção "e".
- [ ] No máximo **1** origem de dado remoto por componente.
- [ ] Nenhum componente reúne, ao mesmo tempo, obtenção de dado remoto, controle de
  navegação e controle de formulário.
- [ ] No máximo **3** hooks de estado ou efeito declarados no mesmo componente.
- [ ] Nenhum componente exportado que precise de mais de **1** frase para ter o propósito
  descrito na documentação.
- [ ] **1** componente exportado por arquivo.

### Exceções Permitidas

- **Componente-raiz de rota**: pode compor as quatro responsabilidades **delegando** cada
  uma a um filho ou a um hook — compor não é implementar, e a delegação precisa ser
  visível na leitura.
- **Provedor de contexto**: existe para prover, e o estado que ele guarda é a sua única
  responsabilidade, mesmo quando declara mais de três hooks.
- **Formulário com campos interdependentes**: quando a regra liga os campos entre si, o
  controle é uma responsabilidade só, ainda que precise de vários estados.
- **Código legado em migração**: com a divisão registrada como codetag `REFACTOR` e o
  recorte proposto anotado.

### Como Detectar

#### Manual

- Descrever o componente em uma frase; se aparecer "e", são dois componentes
- Contar as origens de dado remoto declaradas no arquivo
- Contar os hooks de estado e efeito no corpo
- Verificar se o arquivo exporta mais de um componente
- Ler o histórico do arquivo: se commits de temas diferentes tocam sempre o mesmo arquivo,
  são razões de mudança distintas convivendo

#### Automático

- `pnpm lint` — Biome `complexity/noExcessiveCognitiveComplexity` acusa o sintoma, não a causa
- Sem regra nativa de Biome para contagem de responsabilidades — detecção via revisão de código

## Related to

- [Single Responsibility Principle (SRP)](../skills/solid/SKILL.md): depends on
- [001 — The Blob (God Object)](001_anti-pattern-the-blob.md): reinforces
- [036 — Mudança Divergente (Divergent Change)](036_mudanca-divergente.md): reinforces
- [Common Closure Principle (CCP)](../skills/package/SKILL.md): complements
- [039 — Componente Grande (Big Component)](039_componente-grande.md): complements
- [043 — Lista Longa de Props (Long Props List)](043_lista-longa-props.md): reinforces
- [046 — Transformação de Dados no Componente (In-Component Data Transformation)](046_transformacao-dados-no-componente.md): reinforces
