# Contribuir

kuba está en `0.1.0-alpha` y en desarrollo activo. Úsalo, da tu opinión, y
contribuye a esa evolución.

Se distribuye bajo la licencia **MIT** — úsalo para cualquier fin, comercial
incluido; solo mantén los créditos en
[`LICENSE`](https://github.com/T2E1/kuba/blob/main/LICENSE).

## Ejecutarlo localmente

```sh
git clone https://github.com/T2E1/kuba.git
cd kuba
bun install
```

El repositorio no tiene dependencias de runtime, así que `bun install` solo
descarga las herramientas. Los scripts — servir la documentación, la suite de
pruebas, el linter, el build — están listados en
[`CONTRIBUTING.md`](https://github.com/T2E1/kuba/blob/main/CONTRIBUTING.md), que
es donde se mantiene al día la configuración de desarrollo.

## La forma de un cambio

Dos compuertas se ejecutan antes de que un commit aterrice, ambas mediante
husky: **`lint-staged`** ejecuta `biome check --write` sobre los archivos en
stage — el formato no es tema de revisión, lo decide la herramienta — y
**`commitlint`** rechaza cualquier mensaje que no sea un
[Conventional Commit](https://www.conventionalcommits.org/) antes de que llegue
al historial.

```
feat(input): add a pattern attribute
fix(echo): tear down the arc on disconnect
docs(card): document the outlined variant
```

El prefijo no es decoración: es lo que determina el incremento de versión.

El [`CONTRIBUTING.md`](https://github.com/T2E1/kuba/blob/main/CONTRIBUTING.md)
del repositorio lleva el resto — la estructura del proyecto, con qué llega un
elemento nuevo, y qué se espera de un pull request.

Antes de escribir nada, revisa [Nomenclatura](/foundations/naming) — el
cambio puede ser un Bloque (una composición de Elementos existentes) en lugar de
un Elemento nuevo, y en ese caso necesita markup, no un paquete.

## La documentación es parte del cambio

Este sitio es markdown renderizado por docsify en el navegador, y carga kuba
**desde el CDN en una versión fijada**, declarada en `docs/index.html` — las
mismas dos etiquetas que escribiría cualquier consumidor. Cada ejemplo en vivo
aquí se ejecuta contra el paquete publicado, así que una regresión aparece como
un ejemplo muerto, en lugar de pasar en verde contra un código fuente que solo
existe en la máquina de quien desarrolla.

Dos consecuencias para quien contribuye:

- **Un release actualiza la versión fijada.** Publicar una versión sin
  actualizar `docs/index.html` deja la documentación describiendo un
  comportamiento que el paquete publicado no tiene. El workflow de Pages falla
  el build cuando la versión fijada apunta a algo no publicado, pero no puede
  detectar una que esté simplemente desactualizada.
- **La página es parte del elemento.** Un elemento nuevo o modificado llega con
  su página en `docs/components/` en el mismo pull request.

## Reportar algo

Abre un [issue](https://github.com/T2E1/kuba/issues). La opinión positiva
también es bienvenida — saber qué funciona ayuda tanto como saber qué no.

Para un bug, la forma útil es: el markup, qué esperabas, qué ocurrió, y qué
versión. Una reproducción en vivo vale más que una descripción, y como kuba no
necesita paso de build, un único archivo HTML con las dos etiquetas del CDN
suele bastar.

Un problema de seguridad va al
[`SECURITY.md`](https://github.com/T2E1/kuba/blob/main/SECURITY.md) — en
privado, no mediante un issue público.

## Construir tu producto sobre él

¿Empiezas tu propio producto y quieres kuba como base? Instálalo, o clona el
repositorio y usa la estructura de paquetes como punto de partida. Adapta los
design tokens a tu marca — mira [Temas](/build-ui/theming) — y ajusta los
componentes según necesites.

kuba no es un framework que dicte una única forma de trabajar. Es una referencia
para estudiar, entender y adaptar a la realidad de cada producto; las garantías
vienen de los [principios](/foundations/principles), no de una API que deba
obedecerse al pie de la letra.

Solo recuerda mantener los créditos de la licencia, como exige la licencia MIT.
