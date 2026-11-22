# STRATA — Auditoría consolidada

Este documento fusiona las antiguas auditorías de arquitectura, API y accesibilidad. Describe el estado verificado del sistema y sus límites conocidos.

## Arquitectura interna

### Principios

1. Tokens son la única fuente de valores de diseño.
2. `StrataElement` concentra comportamiento y estilos verdaderamente compartidos.
3. Cada componente mantiene su CSS específico junto a su implementación.
4. No existe una capa Tailwind ni utilidades visuales.
5. No existe bridge legacy ni código de compatibilidad sin consumidores.
6. Los eventos públicos usan `bubbles: true` y `composed: true` cuando deben cruzar Shadow DOM.

### Correcciones aplicadas

- Eliminada inyección de estilos `theme-vars` sin consumidor.
- Eliminado listener `resize` anónimo que no podía ser removido en `Grille`.
- Eliminados tipos `any` innecesarios en hooks de actualización.
- Centralizado foco visible en `component-base.css`.
- Catálogo y API pública se mantienen separados de las implementaciones internas.
- `iconify.ts` registra solo los íconos Carbon usados, no la colección completa.
- `ThemeToggle`, `Carousel`, `Card` y `Progress`/`Skeleton`/`Divider` son tolerantes a entornos sin `localStorage`, `matchMedia` ni `ResizeObserver`, y los componentes de ancho intrínseco cero tienen `width: 100%` para no colapsar en contenedores flex.

### Deuda aceptable

`TitleRendererMixin` conserva un genérico de constructor porque implementa una fábrica reutilizable; no contiene estado global ni efectos laterales.

## Contrato interactivo de la API

Los controles de formulario exponen su valor mediante la propiedad pública `value`/`checked` y emiten `strata-input` durante la edición y `strata-change` al confirmar. El detalle del evento usa `{ value }` y los eventos burbujean a través de Shadow DOM.

Los componentes con estado reflejan atributos HTML para estados booleanos con significado externo (`disabled`, `open`, `checked`, `active`) y exponen el estado ARIA correspondiente en sus controles interactivos.

La gestión del scroll corporal de Modal preserva y restaura el `overflow` previo del consumidor. El cierre por Escape sigue la propiedad `close-on-escape` en vivo, no solo su valor inicial.

## Accesibilidad

### Cubierto y verificado

- Foco visible consistente para controles interactivos mediante `:focus-visible`.
- Dialog con nombre accesible, `aria-modal`, foco inicial, retorno del foco y ciclo de `Tab`.
- Modal con identificador de título único y ciclo de foco.
- Drawer y BottomSheet exponen semántica de diálogo y cierre por Escape.
- Switch tiene nombre accesible y estado nativo `disabled`.
- Avatar sin nombre accesible deja de anunciarse como imagen.
- Tabs usan `role="tab"`/`tablist`/`tabpanel`, `aria-selected` y roving tabindex.
- `strata-progress` expone `role="progressbar"` con nombre accesible (`label`).
- Iconos decorativos se mantienen `aria-hidden`.
- Animaciones respetan `prefers-reduced-motion`.
- axe se ejecuta por componente y tema (claro/oscuro) en `packages/testing/visual/components.spec.ts` y falla con violaciones `critical` y `serious`.

### Limitaciones conocidas

- Las referencias ARIA por IDREF (`aria-controls`, `aria-labelledby`) no cruzan los límites de Shadow DOM. Por eso `strata-tab` no emite `aria-controls`: el `id` del panel vive en otro árbol de sombras y la referencia siempre sería inválida. La asociación tab↔panel se mantiene por estructura (`tablist`/`tabpanel`), estado (`aria-selected`) y comportamiento de teclado.
- `tab`, `menu-item` y `list-item` son componentes fragmento: fuera de su contenedor (`tabs`, `menu`, `list`) violan `aria-required-parent` por diseño. El spec de axe documenta esta excepción y los contenedores sí se verifican completos.
- Los componentes cuyo contenido depende de slots requieren validación adicional con contenido real del consumidor; el catálogo cubre el caso nominal.

## Visual testing

- `packages/testing/visual/components.spec.ts` runs axe (critical+serious) and `toHaveScreenshot` per component × theme (96 cases).
- `page.route` stubs `fonts.googleapis.com`/`fonts.gstatic.com` with empty CSS, so renders use the fixed fallback font stack and never depend on the network.
- Playwright runs with `colorScheme`, `reducedMotion: "reduce"` and `animations: "disabled"`.
- Screenshot baselines live under `components.spec.ts-snapshots/` as **local artifacts — images are never tracked in git** (`.gitignore` covers `*-snapshots/`). With no committed baselines Playwright generates them on first run (`missing` mode) and still exercises render + axe; pixel-diff only compares on machines that already have local baselines (`maxDiffPixelRatio: 0.02`). Regenerate locally with `pnpm test:visual:update`.
- Fragment components (`tab`, `menu-item`, `list-item`) are axe-tested inside their required parents (`strata-tabs`, `strata-menu`, `strata-list`) — no exceptions remain.
