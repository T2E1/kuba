# Visão Geral de Estratégias de Renderização

Guia de decisão para escolher entre CSR, SSR, SSG, ISR e RSC no React (2026).

---

## Matriz de Decisão

| Estratégia | SEO | TTI | Bundle | Infraestrutura | Quando Usar |
|------------|-----|-----|--------|----------------|-------------|
| **CSR** | ❌ | Lento | Grande | Simples | Dashboards, apps internos |
| **SSR** | ✅ | Médio | Grande | Complexa | Conteúdo dinâmico + SEO |
| **SSG** | ✅ | Rápido | Médio | Simples | Blogs, docs, marketing |
| **ISR** | ✅ | Rápido | Médio | Médio | SSG + atualizações frequentes |
| **RSC** | ✅ | Muito rápido | Pequeno | Complexa | Reduzir bundle, busca de dados no servidor |

---

## Client-Side Rendering (CSR)

**Como funciona:** JavaScript renderiza tudo no navegador.

**Quando usar:**
- Dashboards administrativos
- Ferramentas internas
- Apps altamente interativos sem SEO
- Ambientes controlados

**Quando NÃO usar:**
- Páginas públicas com SEO
- Sites com muito conteúdo
- Time-to-Interactive crítico

**Exemplo (Vite + React):**
```tsx
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

---

## Server-Side Rendering (SSR)

**Como funciona:** HTML renderizado no servidor a cada requisição.

**Quando usar:**
- Conteúdo dinâmico + SEO crítico
- Personalização por usuário
- Performance inicial importante

**Quando NÃO usar:**
- Conteúdo estático (usar SSG)
- Alta carga no servidor sem cache

**Exemplo (Next.js App Router):**
```tsx
// app/page.tsx
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>{/* renderizar dados */}</div>;
}
```

---

## Static Site Generation (SSG)

**Como funciona:** HTML gerado no momento do build.

**Quando usar:**
- Blogs, docs, páginas de marketing
- Conteúdo que muda raramente
- SEO crítico + máxima performance

**Quando NÃO usar:**
- Conteúdo personalizado por usuário
- Dados que mudam frequentemente (usar ISR)

**Exemplo (Next.js):**
```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  return <article>{/* renderizar post */}</article>;
}
```

---

## Incremental Static Regeneration (ISR)

**Como funciona:** SSG + revalidação incremental (regenera páginas em background).

**Quando usar:**
- Conteúdo semi-estático (atualizações diárias/semanais)
- E-commerce (páginas de produto)
- Notícias

**Quando NÃO usar:**
- Dados em tempo real (usar SSR ou CSR)
- Conteúdo completamente estático (usar SSG puro)

**Exemplo (Next.js):**
```tsx
// app/products/[id]/page.tsx
export const revalidate = 3600; // revalidar a cada 1 hora

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return <div>{/* renderizar produto */}</div>;
}
```

---

## React Server Components (RSC)

**Como funciona:** Componentes renderizam no servidor sem enviar JavaScript ao cliente.

**Quando usar:**
- Reduzir drasticamente o tamanho do bundle
- Busca de dados diretamente no componente
- Acesso a banco/API no lado do servidor
- Bibliotecas grandes (parsers de markdown, etc.)

**Quando NÃO usar:**
- Componentes com interatividade (event handlers)
- Componentes usando React hooks
- APIs exclusivas do navegador

**Exemplo (Next.js 13+ App Router):**
```tsx
// app/page.tsx (Server Component por padrão)
async function Page() {
  const data = await db.query('SELECT * FROM users'); // acesso direto ao banco
  return (
    <div>
      {data.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
      <LikeButton /> {/* Client Component */}
    </div>
  );
}

// components/LikeButton.tsx (Client Component)
'use client';
import { useState } from 'react';

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>Curtir</button>;
}
```

---

## Abordagem Híbrida (Recomendada para 2026)

**Next.js 13+ App Router:** SSR + RSC + Streaming + Hidratação Seletiva

```tsx
// app/layout.tsx (Server Component)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header /> {/* Server Component */}
        <Suspense fallback={<Loading />}>
          {children} {/* Pode ser Server ou Client Component */}
        </Suspense>
        <Footer /> {/* Server Component */}
      </body>
    </html>
  );
}

// app/dashboard/page.tsx (Server Component)
import { ClientChart } from './ClientChart';

export default async function Dashboard() {
  const data = await fetchDashboardData(); // lado do servidor

  return (
    <div>
      <h1>Dashboard</h1>
      <ServerStats data={data} /> {/* Server Component */}
      <ClientChart data={data} /> {/* Client Component com interatividade */}
    </div>
  );
}
```

---

## Checklist de Decisão

```
1. Precisa de SEO?
   ├─ Não → CSR
   └─ Sim → continuar

2. O conteúdo é estático ou dinâmico?
   ├─ Estático → SSG ou ISR
   └─ Dinâmico → continuar

3. Precisa reduzir drasticamente o bundle?
   ├─ Sim → RSC
   └─ Não → SSR

4. Com que frequência o conteúdo muda?
   ├─ Raramente (< 1x/dia) → SSG
   ├─ Periodicamente (1x/hora) → ISR
   └─ Constantemente (tempo real) → SSR ou CSR com polling

5. Framework disponível?
   ├─ Next.js → usar App Router (RSC + SSR + ISR)
   ├─ Remix → SSR nativo
   └─ Vite → CSR ou SSR manual
```

---

## Métricas de Performance (típicas)

| Métrica | CSR | SSR | SSG | ISR | RSC |
|---------|-----|-----|-----|-----|-----|
| **TTFB** | Rápido | Médio | Rápido | Rápido | Médio |
| **FCP** | Lento | Médio | Rápido | Rápido | Médio |
| **TTI** | Lento | Médio | Rápido | Rápido | Rápido |
| **Bundle** | 200KB+ | 200KB+ | 150KB | 150KB | 50KB |

---

**Fonte:** [patterns.dev/react](https://www.patterns.dev/react), Next.js Docs, React Docs
**Atualizado em**: 2026-04-01
**Versão**: 1.0
