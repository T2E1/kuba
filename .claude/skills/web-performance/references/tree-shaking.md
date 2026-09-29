# Tree Shaking

**Categoria:** Carregamento
**Intenção:** Eliminar do bundle o código exportado que ninguém importa.

---

## Quando Usar

- Sempre, como propriedade do build — não como intervenção pontual.
- Ao avaliar uma dependência nova: se ela não é eliminável, entra inteira, e o custo é
  permanente.

## Quando NÃO Usar

- Como explicação para um bundle grande sem antes olhar o relatório. Na maioria das
  vezes o peso é de algo genuinamente importado, não de código morto.

## Estrutura Mínima

Três condições, e todas precisam valer:

1. **Import e export nomeados.** Importar o módulo inteiro para usar uma função impede a
   eliminação.
2. **Ausência de efeito colateral no topo do módulo**, declarada no manifesto do pacote.
   Um efeito no carregamento obriga o empacotador a manter tudo, por segurança.
3. **Formato de módulo analisável estaticamente.** Formatos antigos não permitem a
   análise.

## O que custa

- Nada em execução. O custo é de disciplina: uma reexportação descuidada ou um efeito
  colateral no topo desliga a eliminação silenciosamente, para o pacote inteiro.
- A falha é invisível — nada quebra, o bundle só fica maior.

## Relacionado a

- [static-import.md](static-import.md): depende — a análise estática é o pré-requisito
- [module.md](../../revelation/SKILL.md): reforça — exportação nomeada é o que torna a eliminação possível
- [bundle-splitting.md](bundle-splitting.md): complementa — reduzir antes de dividir
- [rule 004 — Proibição de Código Zombie](../../../rules/004_codigo-zombie-lava-flow.md): complementa
- [skill `clean-code` — Restrição de Funções com Efeitos Colaterais](../../clean-code/references/restricao-funcoes-efeitos-colaterais.md): reforça

---

**Fonte:** patterns.dev — /vanilla/tree-shaking
