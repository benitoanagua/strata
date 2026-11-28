<script lang="ts">
  import type { StrataTreeNode } from "@strata/components";
  import Controls from "./lib/PropertyControls.svelte";
  import CodeExample from "./lib/CodeExample.svelte";
  import { deriveControls, variantControls, type PropInfo } from "./lib/props";
  import {
    catalog,
    defaultsFor,
    entryById,
    type ControlValue,
  } from "./lib/componentRegistry";
  import { scenarioById } from "./lib/scenarios";
  import {
    buildTreeNodes,
    nodeIdForRoute,
  } from "./lib/treeData";
  import {
    canvasSurface,
    loadViewerPreferences,
    resolveTheme,
    saveViewerPreferences,
    type ViewerPreferences,
    type ViewerSettingsValue,
  } from "./lib/viewer";
  import {
    mountStrataElement,
    type StrataMountHandle,
    type StrataMountOptions,
  } from "./lib/renderer";
  import { mountStrata } from "./lib/mount";

  type Route =
    | { kind: "component"; id: string }
    | { kind: "scenario"; id: string };

  function parseHash(): Route {
    const hash = location.hash.replace(/^#\/?/, "");
    if (hash.startsWith("scenario/")) {
      const id = hash.slice("scenario/".length);
      if (scenarioById(id)) return { kind: "scenario", id };
    }
    if (hash && entryById(hash)) return { kind: "component", id: hash };
    return { kind: "component", id: "button" };
  }

  let route = $state<Route>(parseHash());
  let search = $state("");
  let sidebarOpen = $state(false);
  let previewHost = $state<HTMLDivElement>();
  let searchField = $state<HTMLElement>();

  // Viewer preferences: persisted under `strata-catalog-viewer`, never under
  // the global `strata-theme` key used by strata-theme-toggle.
  let prefs = $state<ViewerPreferences>(loadViewerPreferences());
  let systemDark = $state(false);

  const effectiveTheme = $derived(resolveTheme(prefs.theme, systemDark));
  const canvas = $derived(canvasSurface(prefs.surface, effectiveTheme));

  // The app chrome follows the theme preference on the document root; the
  // canvas surface is always scoped to the .canvas element itself.
  $effect(() => {
    const root = document.documentElement;
    if (prefs.theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", prefs.theme);
  });
  $effect(() => {
    const root = document.documentElement;
    if (prefs.motion === "reduced") root.setAttribute("data-motion", "reduced");
    else root.removeAttribute("data-motion");
  });
  $effect(() => {
    saveViewerPreferences(prefs);
  });
  $effect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => (systemDark = media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  });

  function onViewerChange(event: Event) {
    const value = (event as CustomEvent<{ value: ViewerSettingsValue }>)
      .detail?.value;
    if (value) prefs = { ...prefs, ...value };
  }

  let selectedEntry = $derived(
    route.kind === "component" ? entryById(route.id) : undefined,
  );
  let selectedScenario = $derived(
    route.kind === "scenario" ? scenarioById(route.id) : undefined,
  );

  let controls = $derived<PropInfo[]>(
    selectedEntry ? deriveControls(selectedEntry) : [],
  );
  let values = $state<Record<string, ControlValue>>({});

  const treeNodes = $derived(buildTreeNodes(search));
  const selectedNodeId = $derived(nodeIdForRoute(route));

  function defaults() {
    return Object.fromEntries(
      controls.map((c) => [c.name, c.defaultValue]),
    ) as Record<string, ControlValue>;
  }

  function onHashChange() {
    route = parseHash();
    sidebarOpen = false;
  }

  $effect(() => {
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  });

  // Reset values whenever the selection or derived controls change.
  $effect(() => {
    selectedEntry;
    controls;
    values = defaults();
  });

  function updateValue(name: string, value: ControlValue) {
    values = { ...values, [name]: value };
  }

  function resetValues() {
    values = defaults();
  }

  // Mount the real element once per entry; subsequent property updates go
  // through handle.update() so the instance is never recreated.
  let previewHandle: StrataMountHandle | undefined;
  let mountedTag = "";

  $effect(() => {
    const entry = selectedEntry;
    const host = previewHost;
    if (route.kind !== "component" || !entry || !host) {
      previewHandle?.destroy();
      previewHandle = undefined;
      mountedTag = "";
      return;
    }
    const props: Record<string, unknown> = {};
    for (const control of controls) {
      const value = values[control.name];
      if (value !== undefined) props[control.name] = value;
    }

    const articleEnhancers = new Set(["toc", "reading-progress", "heading-anchors"]);
    const needsArticleFixture = articleEnhancers.has(entry.id);
    if (needsArticleFixture) props.target = "#strata-catalog-article";

    if (previewHandle && mountedTag === entry.tagName) {
      previewHandle.update(props);
      return;
    }
    previewHandle?.destroy();
    previewHandle = undefined;
    host.replaceChildren();
    host.style.cssText = needsArticleFixture
      ? "display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:center;gap:24px;width:100%;"
      : "";

    let article: HTMLElement | undefined;
    if (needsArticleFixture) {
      article = document.createElement("article");
      article.id = "strata-catalog-article";
      article.className = "strata-catalog-article";
      article.innerHTML = `
        <p style="font:var(--strata-type-label-small) var(--strata-font-mono);color:var(--strata-color-text-secondary);margin:0 0 12px">ARTICLE PREVIEW / 01</p>
        <h2 id="catalog-introduction">Introduction</h2>
        <p>STRATA is an editorial design system for clear, composed reading experiences. This sample article gives navigation enhancers real content to work with.</p>
        <h2 id="catalog-history">History</h2>
        <p>Readable interfaces depend on hierarchy, spacing and meaningful navigation. Section anchors make each heading directly linkable.</p>
        <h3 id="catalog-origins">Origins</h3>
        <p>Small details support the reader without competing with the text.</p>
        <h2 id="catalog-geography">Geography</h2>
        <p>A stable article measure and visible section structure help demonstrate the table of contents and reading progress.</p>
        <h2 id="catalog-culture">Culture</h2>
        <p>Editorial systems earn trust by staying out of the way. Every rule, rule line and navigation cue exists to orient the reader, never to decorate the page.</p>
        <p>When the structure is honest, the interface disappears and only the argument remains.</p>
        <h3 id="catalog-typography">Typography</h3>
        <p>A single serif voice carries the prose; headings step down in scale rather than shouting in size or color.</p>
        <h2 id="catalog-future">Future</h2>
        <p>This fixture intentionally runs long enough for the page to scroll, so scroll-spy tables of contents and reading progress indicators have a real range to report.</p>
        <p>Scroll down and watch the progress bar advance; the contents rail highlights the section you are reading.</p>
      `;
      article.style.cssText = "box-sizing:border-box;flex:1 1 420px;min-width:0;max-width:720px;padding:24px;border:1px solid var(--strata-color-border-subtle);background:var(--strata-color-surface-page);color:var(--strata-color-text-primary);";
      article.querySelectorAll("h2").forEach((heading) => {
        (heading as HTMLElement).style.cssText = "margin:18px 0 8px;font:var(--strata-type-headline-small) var(--strata-font-serif);";
      });
      article.querySelectorAll("h3").forEach((heading) => {
        (heading as HTMLElement).style.cssText = "margin:14px 0 6px;font:var(--strata-type-title-large) var(--strata-font-serif);";
      });
      article.querySelectorAll("p:not(:first-child)").forEach((paragraph) => {
        (paragraph as HTMLElement).style.cssText = "margin:0 0 14px;line-height:1.6;max-width:65ch;";
      });
      host.appendChild(article);
    }

    mountedTag = entry.tagName;
    void mountStrataElement(host, {
      tagName: entry.tagName,
      props,
      slotHtml: entry.slotHtml,
      slotContent: entry.slotContent,
    }).then((handle) => {
      if (mountedTag !== entry.tagName) {
        handle.destroy();
        return;
      }
      previewHandle = handle;
      if (article) {
        handle.element.style.flex = entry.id === "reading-progress" ? "0 0 100%" : "0 0 220px";
        if (entry.id === "heading-anchors") handle.element.style.display = "none";
        host.insertBefore(handle.element, article);
      }
    });
  });

  function onTreeSelect(event: Event) {
    const detail = (
      event as CustomEvent<{ node?: StrataTreeNode }>
    ).detail;
    const href = detail?.node?.href;
    if (typeof href === "string" && href) location.hash = href;
  }

  interface DemoCell {
    key: string;
    label: string;
    group: string;
    options: StrataMountOptions;
  }

  const OVERLAY_TAGS = new Set([
    "strata-dialog",
    "strata-modal",
    "strata-drawer",
    "strata-bottom-sheet",
    "strata-popover",
    "strata-menu",
  ]);

  // Demo cells mount the element with its declared defaults plus the varied
  // prop, so every example is a complete, accessible instance. `open` is
  // stripped so overlays never cover the page, and overlay entries are
  // skipped entirely — a closed overlay has nothing to show.
  function demoBaseProps(): Record<string, unknown> {
    const base = { ...defaultsFor(controls) } as Record<string, unknown>;
    delete base.open;
    if (selectedEntry?.id === "card") {
      // The source Card's media variants need a visible image fixture.
      base.is_media = true;
      base.feature_image = "https://picsum.photos/seed/strata-card/1200/900";
      base.show_excerpt = true;
      base.excerpt = "A short supporting excerpt with enough text to appreciate the reading measure.";
    }
    if (selectedEntry?.id === "overlay") {
      base.feature_image = "https://picsum.photos/seed/strata-overlay/1200/900";
    }
    return base;
  }

  const variantDemos = $derived.by<DemoCell[]>(() => {
    const entry = selectedEntry;
    if (!entry || OVERLAY_TAGS.has(entry.tagName)) return [];
    const base = demoBaseProps();
    const cells: DemoCell[] = [];
    for (const control of variantControls(controls)) {
      for (const option of control.options ?? []) {
        cells.push({
          key: `variant-${control.name}-${option}`,
          label: `${control.label}: ${option}`,
          group: control.label,
          options: {
            tagName: entry.tagName,
            props: {
              ...base,
              ...control.demoProps,
              [control.name]: option,
            },
            slotHtml: entry.slotHtml,
            slotContent: entry.slotContent,
          },
        });
      }
    }
    return cells;
  });

  // Variant cells arrive grouped by control already; chunk them so the
  // section can label each property (Variant, Size, Color…) separately
  // instead of presenting one flat grid of mixed combinations.
  const variantGroups = $derived.by<{ label: string; cells: DemoCell[] }[]>(
    () => {
      const groups: { label: string; cells: DemoCell[] }[] = [];
      for (const cell of variantDemos) {
        const last = groups[groups.length - 1];
        if (last && last.label === cell.group) last.cells.push(cell);
        else groups.push({ label: cell.group, cells: [cell] });
      }
      return groups;
    },
  );

  const stateDemos = $derived.by<DemoCell[]>(() => {
    const entry = selectedEntry;
    if (!entry || OVERLAY_TAGS.has(entry.tagName)) return [];
    const base = demoBaseProps();
    return controls
      .filter((control) => control.type === "boolean" && control.name !== "open")
      .map((control) => ({
        key: `state-${control.name}`,
        label: control.label,
        group: "States",
        options: {
          tagName: entry.tagName,
          props: { ...base, ...control.demoProps, [control.name]: true },
          slotHtml: entry.slotHtml,
          slotContent: entry.slotContent,
        },
      }));
  });

  function onKeydown(event: KeyboardEvent) {
    if (
      event.key === "/" &&
      !(event.target instanceof HTMLInputElement) &&
      !(event.target instanceof HTMLTextAreaElement) &&
      !(event.target instanceof HTMLSelectElement)
    ) {
      event.preventDefault();
      const inner = searchField?.shadowRoot?.querySelector("input");
      (inner as HTMLInputElement | null)?.focus();
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<svelte:head>
  <title>
    {selectedEntry
      ? `${selectedEntry.name} — STRATA Catalog`
      : selectedScenario
        ? `${selectedScenario.name} — STRATA Catalog`
        : "STRATA Catalog"}
  </title>
</svelte:head>

<div class="app-shell" class:sidebar-open={sidebarOpen}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <strata-icon-button
    class="nav-toggle"
    size="small"
    icon="carbon:list-bulleted"
    label="Toggle navigation"
    aria-expanded={sidebarOpen}
    onclick={() => (sidebarOpen = !sidebarOpen)}
  ></strata-icon-button>

  <aside class="sidebar" aria-label="Component library">
    <a class="brand" href="#/button" aria-label="STRATA component catalog">
      <span class="brand-mark">S</span>
      <span class="brand-wordmark"><strong>STRATA</strong><small>DESIGN SYSTEM</small></span>
    </a>

    <strata-search-field
      bind:this={searchField}
      class="sidebar-search"
      label="Search components"
      placeholder="Search components…"
      value={search}
      onstrata-input={(event: Event) =>
        (search = String(
          (event as CustomEvent<{ value: unknown }>).detail?.value ?? "",
        ))}
    ></strata-search-field>

    <p class="sidebar-caption">LIBRARY · {catalog.length}</p>
    <nav class="sidebar-nav" aria-label="Component navigation">
      <strata-tree
        label="Component library"
        expand-mode="single"
        empty-label={'No components match "' + search + '".'}
        nodes={JSON.stringify(treeNodes)}
        selected-ids={JSON.stringify([selectedNodeId])}
        onstrata-select={onTreeSelect}
      ></strata-tree>
    </nav>

    <div class="sidebar-bottom">
      <span class="online-dot"></span><span>Local catalog</span><span class="version">v2.5.0</span>
    </div>
  </aside>
  {#if sidebarOpen}
    <button class="sidebar-scrim" type="button" aria-label="Close navigation" onclick={() => (sidebarOpen = false)}></button>
  {/if}

  <main class="main-content">
    {#if selectedEntry}
      {@const entry = selectedEntry}
      <header class="topbar">
        <div class="breadcrumbs">
          <span>Library</span><span class="breadcrumb-divider">/</span>
          <span>{entry.category}</span><span class="breadcrumb-divider">/</span>
          <strong>{entry.name}</strong>
        </div>
        <div class="topbar-meta">
          <strata-viewer-settings
            theme={prefs.theme}
            surface={prefs.surface}
            viewport={prefs.viewport}
            motion={prefs.motion}
            onstrata-change={onViewerChange}
          ></strata-viewer-settings>
          <span class="maturity maturity-{entry.maturity}">{entry.maturity}</span>
          <span class="topbar-divider"></span><span class="mono">{entry.tagName}</span>
        </div>
      </header>

      <div class="page-content">
        <section class="page-heading">
          <div>
            <p class="eyebrow">COMPONENT <span class="eyebrow-separator">/</span> {entry.category.toUpperCase()}</p>
            <h1>{entry.name}<span class="heading-period">.</span></h1>
            <p class="lead">{entry.description}</p>
          </div>
          <code class="element-tag">{entry.tagName}</code>
        </section>

        <section class="preview-block" aria-labelledby="preview-title">
          <div class="section-toolbar">
            <div class="section-heading">
              <span class="section-mark">▣</span><h2 id="preview-title">Preview</h2>
              <span class="section-subtitle">Live canvas</span>
            </div>
          </div>
          <div class="canvas" class:canvas-grid={canvas.grid} data-theme={canvas.theme}>
            <div class="preview-viewport viewport-{prefs.viewport}">
              <div class="canvas-labels"><span>PREVIEW AREA</span><span>{prefs.viewport.toUpperCase()} / 01</span></div>
              <div class="preview-stage" bind:this={previewHost}></div>
            </div>
            <span class="canvas-footer">STRATA COMPONENT CATALOG</span>
          </div>
        </section>

        {#if variantDemos.length}
          <section class="demo-block" class:demo-roomy={["card", "overlay", "grille"].includes(entry.id)} aria-labelledby="variants-title">
            <div class="section-heading">
              <span class="section-mark">◫</span><h2 id="variants-title">Variants</h2>
              <span class="section-subtitle">{variantDemos.length} combinations</span>
            </div>
            {#each variantGroups as group}
              <h3 class="demo-group-title">{group.label}</h3>
              <div class="demo-grid">
                {#each group.cells as cell (cell.key)}
                  <figure class="demo-cell">
                    <div class="demo-stage" use:mountStrata={cell.options}></div>
                    <figcaption><code>{cell.label}</code></figcaption>
                  </figure>
                {/each}
              </div>
            {/each}
          </section>
        {/if}

        {#if stateDemos.length}
          <section class="demo-block" class:demo-roomy={["card", "overlay", "grille"].includes(entry.id)} aria-labelledby="states-title">
            <div class="section-heading">
              <span class="section-mark">◉</span><h2 id="states-title">States</h2>
              <span class="section-subtitle">Boolean properties enabled</span>
            </div>
            <div class="demo-grid">
              {#each stateDemos as cell (cell.key)}
                <figure class="demo-cell">
                  <div class="demo-stage" use:mountStrata={cell.options}></div>
                  <figcaption><code>{cell.label}: true</code></figcaption>
                </figure>
              {/each}
            </div>
          </section>
        {/if}

        <strata-tabs class="detail-tabs">
          <strata-tab slot="tabs">Properties</strata-tab>
          <strata-tab slot="tabs">API</strata-tab>
          <strata-tab slot="tabs">Examples</strata-tab>
          <strata-tab slot="tabs">Accessibility</strata-tab>

          <strata-tab-panel slot="panels">
            <div class="details-grid">
              <section class="usage-panel">
                <p class="eyebrow">IMPLEMENTATION</p>
                <h2>Native by design.</h2>
                <p>
                  This element is registered by the Lit component package. Properties are assigned
                  directly to the DOM node so boolean, numeric and typed values remain intact.
                </p>
                <div class="metadata-line"><span>TAG</span><code>{entry.tagName}</code></div>
                <div class="metadata-line"><span>PROPERTIES</span><strong>{controls.length} reactive</strong></div>
                <div class="metadata-line"><span>MATURITY</span><strong>{entry.maturity}</strong></div>
                {#if entry.notes}<div class="metadata-line"><span>NOTES</span><span>{entry.notes}</span></div>{/if}
              </section>
              <Controls {controls} {values} onValueChange={updateValue} onReset={resetValues} />
            </div>
          </strata-tab-panel>

          <strata-tab-panel slot="panels">
            <section class="api-panel" aria-label="API reference">
              <h2>Properties</h2>
              <table class="api-table">
                <thead><tr><th>Property</th><th>Attribute</th><th>Type</th><th>Default</th></tr></thead>
                <tbody>
                  {#each controls as c}
                    <tr>
                      <td><code>{c.name}</code></td>
                      <td><code>{c.attribute ?? "—"}</code></td>
                      <td>{c.type}{c.propertyType ? ` (${c.propertyType})` : ""}</td>
                      <td><code>{JSON.stringify(c.defaultValue)}</code></td>
                    </tr>
                  {/each}
                </tbody>
              </table>
              {#if entry.events?.length}
                <h3>Events</h3>
                <table class="api-table">
                  <thead><tr><th>Event</th><th>Detail</th><th>Description</th></tr></thead>
                  <tbody>
                    {#each entry.events as ev}
                      <tr><td><code>{ev.name}</code></td><td><code>{ev.detail ?? "—"}</code></td><td>{ev.description}</td></tr>
                    {/each}
                  </tbody>
                </table>
              {/if}
              {#if entry.slots?.length}
                <h3>Slots</h3>
                <table class="api-table">
                  <thead><tr><th>Slot</th><th>Description</th></tr></thead>
                  <tbody>
                    {#each entry.slots as s}
                      <tr><td><code>{s.name}</code></td><td>{s.description}</td></tr>
                    {/each}
                  </tbody>
                </table>
              {/if}
            </section>
          </strata-tab-panel>

          <strata-tab-panel slot="panels">
            <section class="examples-panel" aria-label="Usage examples">
              <CodeExample tagName={entry.tagName} {controls} {values} slotHtml={entry.slotHtml} slotContent={entry.slotContent} theme={effectiveTheme} />
              <div class="usage-panel">
                <p class="eyebrow">COMPOSITION</p>
                <p>
                  {#if entry.slotHtml || entry.slotContent}
                    The preview above composes the element with its default fixture. Edit the
                    controls on the Properties tab and the snippet updates live.
                  {:else}
                    This element takes no slotted content; configure it entirely through properties.
                  {/if}
                </p>
                <p class="mono-note">
                  Import once: <code>import "@strata/components";</code> — styles:
                  <code>@strata/components/styles.css</code>, tokens:{" "}
                  <code>@strata/tokens/styles.css</code>.
                </p>
              </div>
            </section>
          </strata-tab-panel>

          <strata-tab-panel slot="panels">
            <section class="a11y-panel" aria-label="Accessibility notes">
              <h2>Accessibility</h2>
              {#if entry.a11y}
                <p>{entry.a11y}</p>
              {:else}
                <p>No specific notes — the element follows STRATA base semantics.</p>
              {/if}
              <h3>Keyboard & focus</h3>
              <ul>
                <li>Interactive elements are native controls or expose button/link roles.</li>
                <li>Overlays (dialog, modal, drawer, bottom-sheet) trap focus, close on Escape and restore focus.</li>
                <li>Tabs, menus, trees and accordions support arrow-key navigation where applicable.</li>
                <li>Reduced-motion preferences are respected by animated components.</li>
              </ul>
              <h3>Testing</h3>
              <p>
                Every catalog entry is mounted by the unit suite, axe-scanned per theme and covered
                by a visual baseline where geometry matters.
              </p>
            </section>
          </strata-tab-panel>
        </strata-tabs>

        <footer class="page-footer">
          <span>STRATA DESIGN SYSTEM</span><span>MONOCHROME · SEMANTIC COLOR · SCALE LAW</span>
        </footer>
      </div>
    {:else if selectedScenario}
      {@const scenario = selectedScenario}
      {@const ScenarioComponent = scenario.component}
      <header class="topbar">
        <div class="breadcrumbs">
          <span>Scenarios</span><span class="breadcrumb-divider">/</span><strong>{scenario.name}</strong>
        </div>
        <div class="topbar-meta">
          <strata-viewer-settings
            theme={prefs.theme}
            surface={prefs.surface}
            viewport={prefs.viewport}
            motion={prefs.motion}
            onstrata-change={onViewerChange}
          ></strata-viewer-settings>
          <span class="mono">{scenario.id}</span>
        </div>
      </header>
      <div class="page-content">
        <section class="page-heading">
          <div>
            <p class="eyebrow">SCENARIO</p>
            <h1>{scenario.name}<span class="heading-period">.</span></h1>
            <p class="lead">{scenario.description}</p>
          </div>
        </section>
        <section class="preview-block" aria-labelledby="preview-title">
          <div class="section-toolbar">
            <div class="section-heading">
              <span class="section-mark">◈</span><h2 id="preview-title">Live scenario</h2>
              <span class="section-subtitle">Real components</span>
            </div>
          </div>
          <div class="canvas" class:canvas-grid={canvas.grid} data-theme={canvas.theme}>
            <div class="preview-viewport viewport-{prefs.viewport} scenario-viewport">
              <div class="canvas-labels"><span>SCENARIO</span><span>{prefs.viewport.toUpperCase()}</span></div>
              <div class="preview-stage scenario-stage">
                <ScenarioComponent />
              </div>
            </div>
            <span class="canvas-footer">STRATA COMPONENT CATALOG</span>
          </div>
        </section>
        <footer class="page-footer">
          <span>STRATA DESIGN SYSTEM</span><span>SCENARIOS USE ONLY PUBLIC APIs</span>
        </footer>
      </div>
    {/if}
  </main>
</div>
