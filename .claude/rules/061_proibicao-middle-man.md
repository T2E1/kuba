# Proibição de Middle Man

**ID**: AP-19-061
**Severity**: 🟡 Medium
**Category**: Structural

---

## What it is

Middle Man ocorre quando uma classe delega a maioria de seus métodos para outra classe sem adicionar seu próprio valor. Se 50%+ dos métodos de uma classe apenas repassam chamadas (linha única `return this.obj.method(args)`), é um Middle Man inútil. É o inverso de Feature Envy: aqui, o middle man delega tudo; lá, o método faz o trabalho de outro objeto.

## Why it matters

- Complexidade desnecessária: mais arquivos, mais imports, mais nomes para aprender
- Manutenção duplicada: cada mudança na interface real requer mudança no Middle Man
- Debug mais lento: stack trace com camadas desnecessárias e confusão sobre onde está a lógica real
- Acoplamento indireto: se remover objeto real, middle man perde existência sem valor
- Indica over-engineering ou refatoração incompleta: classe foi útil uma vez mas perdeu propósito

## Objective Criteria

- [ ] 50%+ dos métodos da classe são delegates de uma linha sem adicionar valor
- [ ] Classe existe apenas para esconder outro objeto exposto diretamente inicialmente
- [ ] Sempre que adicionar método ao objeto real, adiciona mesma wrapper ao Middle Man
- [ ] Stack trace sempre mostra mesmos nomes de método em duas camadas consecutivas
- [ ] Middle Man não é usado/testado isoladamente — sempre precisa do objeto real funcionando

## Allowed Exceptions

- Padrões de Facade que simplificam interface complexa (adicionando valor via simplificação)
- Proxies com preocupações transversais (logging, caching, autenticação)
- Adapters que transformam interfaces de formatos diferentes
- DTOs/ViewModels que transformam objetos de entidade para camada de apresentação

## How to Detect

### Manual

- Ler classe: identificar métodos que apenas fazem `return this.obj.method(args)` sem modificação
- Buscar classes onde adicionar método sempre requer adicionar mesmo delegate em outra classe
- Verificar testes: testes do middle man apenas testam que ele repassa corretamente, não lógica própria

### Automatic

- Sem regra nativa de Biome para detectar padrão de delegação pura — detecção via revisão de código

## Related to

- [022 - Simplicity and Clarity (KISS)](022_priorizacao-simplicidade-clareza.md): reinforces
- [057 - Prohibition of Feature Envy](057_proibicao-feature-envy.md): complements
- [008 - Prohibition of Getters/Setters](008_proibicao-getters-setters.md): reinforces
- [011 - Open/Closed Principle (OCP)](011_principio-aberto-fechado.md): complements
- [065 - Prohibition of Poltergeists](065_proibicao-poltergeists.md): complements

---

**Created on**: 2026-03-28
**Updated on**: 2026-07-15
**Version**: 1.1
