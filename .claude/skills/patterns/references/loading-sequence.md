# Optimize Your Loading Sequence

## Problema

O navegador prioriza recursos de um jeito que frequentemente diverge da expectativa do
desenvolvedor, sub-otimizando métricas como FCP, LCP e FID.

## Como funciona

Define uma ordem preferencial: CSS crítico inline → fontes críticas com preconnect →
imagem hero (LCP) com preload → JS de primeira parte → imagens acima da dobra → CSS não
crítico assíncrono → JS de terceiros controlado por prioridade → imagens abaixo da
dobra com lazy loading.

## Quando não aplicar

- Sem medição real (Core Web Vitals de produção): reordenar carregamento às cegas é
  otimização prematura (rule 069) tanto quanto qualquer outra.

## Relação com as rules deste repositório

- Consome os patterns [preload.md](preload.md), [prefetch.md](prefetch.md) e
  [third-party.md](third-party.md) como peças da sequência — este arquivo é o checklist
  de ordem, não uma técnica isolada.
