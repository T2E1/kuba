// ❌ Divisão fina, cascata e prefetch sem critério.
// Correto em: code-splitting.valid.js

// ─── Erro 1 — dividir por componente, não por navegação ───────────────────
// Dezenas de arquivos pequenos. Mais requisições, compressão pior (a taxa
// melhora sobre arquivo maior), e nenhuma fronteira que signifique algo.
const Button = lazy(() => import('@ui/Button'))
const Card = lazy(() => import('@ui/Card'))
const Icon = lazy(() => import('@ui/Icon'))
const Avatar = lazy(() => import('@ui/Avatar'))

// ─── Erro 2 — adiar o que a primeira tela precisa ─────────────────────────
// A rota de entrada é adiada. O pedaço só é PEDIDO depois que o bundle
// principal baixa e executa: duas idas à rede em série onde havia uma. O
// resultado é mais lento que não dividir.
const Order = lazy(() => import('@feature/order'))

const routes = [{ path: '/', component: Order }]

// ─── Erro 3 — nenhuma declaração no documento ─────────────────────────────
// Nada de modulepreload. A cascata do erro 2 fica sem contrapeso.

// ─── Erro 4 — nenhum estado de espera nem de erro ─────────────────────────
// Sem fronteira de suspensão, a árvore quebra no primeiro carregamento.
// Sem fronteira de erro, uma falha de rede deixa a tela em branco — e isso
// acontece toda vez que uma publicação invalida o arquivo que o documento
// em cache aponta.
function Router() {
  return <Outlet />
}

// ─── Erro 5 — prefetch em tudo, sem previsão calculada ────────────────────
// Banda e dado do usuário gastos em rotas que ninguém vai abrir. Em conexão
// limitada o efeito é negativo, e a preferência por economia de dados que o
// navegador expõe foi ignorada.
useEffect(() => {
  routes.forEach((route) => prefetchRoute(route.path))
}, [])

// ─── Erro 6 — nenhuma medição, antes ou depois ────────────────────────────
// Não se sabe o que pesava, nem se pesava, nem se algo melhorou. É otimização
// prematura (rule 069) e ganho afirmado sem medida no mesmo diff —
// e, com seis mudanças juntas, se piorou não há como saber qual delas piorou.
