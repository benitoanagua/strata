<script lang="ts">
  import type { Component } from "svelte";
  import Controls from "./lib/PropertyControls.svelte";
  import Snippet from "./lib/Snippet.svelte";
  import { deriveControls, type PropInfo } from "./lib/props";
  import {
    catalog,
    categories,
    entryById,
    type CatalogEntry,
    type ControlValue,
  } from "./lib/componentRegistry";
  import EditorialArticle from "./lib/scenarios/EditorialArticle.svelte";
  import WikiArticle from "./lib/scenarios/WikiArticle.svelte";
  import Social from "./lib/scenarios/Social.svelte";
  import DataScenario from "./lib/scenarios/Data.svelte";
  import FormsScenario from "./lib/scenarios/Forms.svelte";

  interface ScenarioDef {
    id: string;
    name: string;
    description: string;
    component: Component;
  }
  const scenarios: ScenarioDef[] = [
    {
      id: "editorial-article",
      name: "Artículo editorial",
      description: "Portada de revista: cabecera, meta, tags, cuerpo, galería, autor y navegación.",
      component: EditorialArticle,
    },
    {
      id: "wiki-article",
      name: "Artículo wiki",
      description: "Página de conocimiento: TOC con scroll-spy, citas, referencias, progreso y anchors.",
      component: WikiArticle,
    },
    {
      id: "social",
      name: "Interacción social",
      description: "Autor, compartir y hilo de comentarios con respuestas anidadas.",
      component: Social,
    },
    {
      id: "data",
      name: "Componentes de datos",
      description: "Tabla, paginación, filtros, índice, ranking y grille con datos coherentes.",
      component: DataScenario,
    },
    {
      id: "forms",
      name: "Formularios",
      description: "Todos los controles de formulario con validación en vivo.",
      component: FormsScenario,
    },
  ];

  type Route =
    | { kind: "component"; id: string }
    | { kind: "scenario"; id: string };

  function parseHash(): Route {
    const hash = location.hash.replace(/^#\/?/, "");
    if (hash.startsWith("scenario/")) {
      const id = hash.slice("scenario/".length);
      if (scenarios.some((s) => s.id === id)) return { kind: "scenario", id };
    }
    if (hash && entryById(hash)) return { kind: "component", id: hash };
    return { kind: "component", id: "button" };
  }

  let route = $state<Route>(parseHash());
  let search = $state("");
  let collapsed = $state<Set<string>>(new Set());
  function toggleCategory(category: string) {
    const next = new Set(collapsed);
    if (next.has(category)) next.delete(category);
    else next.add(category);
    collapsed = next;
  }
  let sidebarOpen = $state(false);
  let detailTab = $state<"properties" | "api" | "examples" | "a11y">("properties");
  let surface = $state<"light" | "dark" | "grid">("light");
  let viewport = $state<"desktop" | "tablet" | "mobile">("desktop");
  let previewHost = $state<HTMLDivElement>();
  let searchInput: HTMLInputElement;

  let selectedEntry = $derived(
    route.kind === "component" ? entryById(route.id) : undefined,
  );
  let selectedScenario = $derived(
    route.kind === "scenario"
      ? scenarios.find((s) => s.id === route.id)
      : undefined,
  );

  let controls = $derived<PropInfo[]>(
    selectedEntry ? deriveControls(selectedEntry) : [],
  );
  let values = $state<Record<string, ControlValue>>({});

  const filteredCatalog = $derived.by(() => {
    const q = search.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.id.includes(q) ||
        e.tagName.includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q),
    );
  });

  const grouped = $derived.by(() =>
    categories.map((category) => ({
      category,
      entries: filteredCatalog.filter((e) => e.category === category),
    })),
  );

  function defaults() {
    return Object.fromEntries(
      controls.map((c) => [c.name, c.defaultValue]),
    ) as Record<string, ControlValue>;
  }

  function selectComponent(id: string) {
    route = { kind: "component", id };
    location.hash = `#/${id}`;
    sidebarOpen = false;
  }

  function selectScenario(id: string) {
    route = { kind: "scenario", id };
    location.hash = `#/scenario/${id}`;
    sidebarOpen = false;
  }

  function onHashChange() {
    route = parseHash();
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
    detailTab = "properties";
  });

  function updateValue(name: string, value: ControlValue) {
    values = { ...values, [name]: value };
  }

  function resetValues() {
    values = defaults();
  }

  function renderPreview() {
    if (!previewHost || !selectedEntry) return;
    previewHost.replaceChildren();
    const element = document.createElement(selectedEntry.tagName) as HTMLElement &
      Record<string, unknown>;
    for (const control of controls) {
      const value = values[control.name];
      if (value !== undefined) element[control.name] = value;
    }
    if (selectedEntry.slotHtml) element.innerHTML = selectedEntry.slotHtml;
    else if (selectedEntry.slotContent) element.textContent = selectedEntry.slotContent;
    previewHost.append(element);
  }

  $effect(() => {
    selectedEntry;
    values;
    controls;
    if (previewHost && route.kind === "component") renderPreview();
  });

  function onKeydown(event: KeyboardEvent) {
    if (event.key === "/" && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
      event.preventDefault();
      searchInput?.focus();
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
  <button
    class="nav-toggle"
    type="button"
    aria-label="Toggle navigation"
    aria-expanded={sidebarOpen}
    onclick={() => (sidebarOpen = !sidebarOpen)}
  >
    ☰
  </button>

  <aside class="sidebar" aria-label="Component library">
    <a class="brand" href="#/button" aria-label="STRATA component catalog">
      <span class="brand-mark">S</span>
      <span class="brand-wordmark"><strong>STRATA</strong><small>DESIGN SYSTEM</small></span>
    </a>

    <div class="search-box">
      <input
        bind:this={searchInput}
        bind:value={search}
        type="search"
        placeholder="Search components…"
        aria-label="Search components"
      />
      <kbd>/</kbd>
    </div>

    <p class="sidebar-caption">SCENARIOS</p>
    <nav aria-label="Scenarios">
      {#each scenarios as scenario}
        <button
          type="button"
          class="nav-entry"
          class:selected={route.kind === "scenario" && route.id === scenario.id}
          aria-current={route.kind === "scenario" && route.id === scenario.id ? "page" : undefined}
          onclick={() => selectScenario(scenario.id)}
        >
          <span class="nav-glyph">◈</span><span>{scenario.name}</span>
        </button>
      {/each}
    </nav>

    <p class="sidebar-caption">LIBRARY · {catalog.length}</p>
    <nav aria-label="Component navigation">
      {#each grouped as section}
        {#if section.entries.length}
          <button
            type="button"
            class="category-label category-toggle"
            aria-expanded={!collapsed.has(section.category)}
            onclick={() => toggleCategory(section.category)}
          >{section.category}<span class="category-caret">{collapsed.has(section.category) ? "›" : "⌄"}</span></button>
          {#if !collapsed.has(section.category)}
          {#each section.entries as entry}
            <button
              type="button"
              class="nav-entry"
              data-entry-id={entry.id}
              aria-label={`◇ ${entry.name}`}
              class:selected={route.kind === "component" && route.id === entry.id}
              aria-current={route.kind === "component" && route.id === entry.id ? "page" : undefined}
              onclick={() => selectComponent(entry.id)}
            >
              <span class="nav-glyph">◇</span><span>{entry.name}</span>
              <code class="nav-tag">{entry.tagName.replace("strata-", "")}</code>
            </button>
          {/each}
          {/if}
        {/if}
      {/each}
      {#if !filteredCatalog.length}
        <p class="empty-search">No components match “{search}”.</p>
      {/if}
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
            <div class="toolbar-controls">
              <label><span>Surface</span>
                <select bind:value={surface} aria-label="Canvas surface">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="grid">Grid</option>
                </select>
              </label>
              <span class="toolbar-divider"></span>
              <label><span>Viewport</span>
                <select bind:value={viewport} aria-label="Canvas viewport">
                  <option value="desktop">Desktop</option>
                  <option value="tablet">Tablet</option>
                  <option value="mobile">Mobile</option>
                </select>
              </label>
            </div>
          </div>
          <div class="canvas canvas-{surface}" data-theme={surface === "dark" ? "dark" : "light"}>
            <div class="preview-viewport viewport-{viewport}">
              <div class="canvas-labels"><span>PREVIEW AREA</span><span>{viewport.toUpperCase()} / 01</span></div>
              <div class="preview-stage" bind:this={previewHost}></div>
            </div>
            <span class="canvas-footer">STRATA COMPONENT CATALOG</span>
          </div>
        </section>

        <div class="detail-tabs" role="tablist" aria-label="Component details">
          {#each [["properties", "Properties"], ["api", "API"], ["examples", "Examples"], ["a11y", "Accessibility"]] as [id, label]}
            <button
              type="button"
              role="tab"
              aria-selected={detailTab === id}
              class:selected={detailTab === id}
              onclick={() => (detailTab = id as typeof detailTab)}
            >{label}</button>
          {/each}
        </div>

        <div class="details-grid">
          {#if detailTab === "properties"}
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
          {:else if detailTab === "api"}
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
          {:else if detailTab === "examples"}
            <section class="examples-panel" aria-label="Usage examples">
              <Snippet tagName={entry.tagName} {controls} {values} slotHtml={entry.slotHtml} slotContent={entry.slotContent} />
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
          {:else}
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
                <li>Tabs, menus and accordions support arrow-key navigation where applicable.</li>
                <li>Reduced-motion preferences are respected by animated components.</li>
              </ul>
              <h3>Testing</h3>
              <p>
                Every catalog entry is mounted by the unit suite, axe-scanned per theme and covered
                by a visual baseline where geometry matters.
              </p>
            </section>
          {/if}
        </div>

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
        <div class="topbar-meta"><span class="mono">{scenario.id}</span></div>
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
            <div class="toolbar-controls">
              <label><span>Surface</span>
                <select bind:value={surface} aria-label="Canvas surface">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="grid">Grid</option>
                </select>
              </label>
              <span class="toolbar-divider"></span>
              <label><span>Viewport</span>
                <select bind:value={viewport} aria-label="Canvas viewport">
                  <option value="desktop">Desktop</option>
                  <option value="tablet">Tablet</option>
                  <option value="mobile">Mobile</option>
                </select>
              </label>
            </div>
          </div>
          <div class="canvas canvas-{surface}" data-theme={surface === "dark" ? "dark" : "light"}>
            <div class="preview-viewport viewport-{viewport} scenario-viewport">
              <div class="canvas-labels"><span>SCENARIO</span><span>{viewport.toUpperCase()}</span></div>
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
