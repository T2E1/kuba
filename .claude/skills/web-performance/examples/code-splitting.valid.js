// ✅ A divisão na fronteira de navegação, com o crítico declarado.
// Incorreto em: code-splitting.invalid.js

// ─── app/routes.js ────────────────────────────────────────────────────────
// A fronteira é a rota: um recorte que já existe, que o produto entende, e
// que acompanha a organização de pastas (skill package-by-feature).
//
// A rota de entrada NÃO é adiada: quase todos chegam por ela, e adiá-la
// perderia o ganho justamente no caso majoritário.
import Order from '@feature/order'

const routes = [
  { path: '/', component: Order },

  // Adiadas: fluxos que uma fração dos usuários alcança.
  { path: '/reports', component: lazy(() => import('@feature/reports')) },
  { path: '/settings', component: lazy(() => import('@feature/settings')) },
]

// ─── app/index.html ───────────────────────────────────────────────────────
// O pedaço da rota de entrada é declarado no documento. Sem isto, ele só
// seria descoberto DEPOIS que o bundle principal executasse — a cascata que
// a divisão cria, somando duas idas à rede em série.
//
//   <link rel="modulepreload" href="/assets/order-[hash].js">

// ─── app/Router.js ────────────────────────────────────────────────────────
// Todo carregamento adiado tem os dois estados tratados. O de espera ocupa
// as dimensões do conteúdo final, ou a transição salta.
function Router() {
  return (
    <ErrorBoundary fallback={<RouteLoadError />}>
      <Suspense fallback={<RouteSkeleton />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  )
}

// ─── app/Link.js ──────────────────────────────────────────────────────────
// A rota provável é antecipada no primeiro sinal de intenção, em prioridade
// baixa. A espera da transição desaparece sem pesar na carga inicial.
function Link({ to, children }) {
  return (
    <a href={to} onPointerEnter={() => prefetchRoute(to)} onFocus={() => prefetchRoute(to)}>
      {children}
    </a>
  )
}

// Medido antes: bundle inicial 780KB, tempo até interação 4,1s.
// Medido depois: 470KB, 2,3s. Sem estes dois números, não houve otimização.
