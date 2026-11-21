<script lang="ts">
  import Controls from "./lib/Controls.svelte";
  import { catalog, categories, defaultsFor, type CatalogEntry, type ControlValue } from "./lib/registry";

  let selectedId = $state("button");
  let values = $state<Record<string, ControlValue>>(defaultsFor(catalog[0]));
  let surface = $state("light");
  let viewport = $state("desktop");
  let previewHost: HTMLDivElement;
  let selectedEntry = $derived(catalog.find((entry) => entry.id === selectedId) ?? catalog[0]);
  let sections = $derived(categories.map((category) => ({ category, entries: catalog.filter((entry) => entry.category === category) })));

  function selectEntry(entry: CatalogEntry) { selectedId = entry.id; values = defaultsFor(entry); }
  function updateValue(name: string, value: ControlValue) { values = { ...values, [name]: value }; }
  function resetValues() { values = defaultsFor(selectedEntry); }
  function renderPreview() {
    if (!previewHost || !selectedEntry) return;
    previewHost.replaceChildren();
    const element = document.createElement(selectedEntry.tagName) as HTMLElement & Record<string, unknown>;
    for (const [name, value] of Object.entries(values)) element[name] = value;
    if (selectedEntry.slotContent) element.textContent = selectedEntry.slotContent;
    previewHost.append(element);
  }
  $effect(() => { selectedId; values; if (previewHost) renderPreview(); });
</script>

<svelte:head>
  <title>{selectedEntry.name} — STRATA Catalog</title>
  <meta name="description" content="Explore STRATA components using native design tokens and Lit elements." />
</svelte:head>

<div class="app-shell">
  <aside class="sidebar">
    <a class="brand" href="/" aria-label="STRATA component catalog">
      <span class="brand-mark">S</span><span class="brand-wordmark"><strong>STRATA</strong><small>DESIGN SYSTEM</small></span>
    </a>
    <p class="sidebar-caption">LIBRARY</p>
    <div class="library-entry"><span>▦</span><span>Components</span><span class="entry-count">{catalog.length.toString().padStart(2, "0")}</span></div>
    <nav aria-label="Component navigation">
      {#each sections as section}
        <p class="category-label">{section.category}</p>
        {#each section.entries as entry}
          <button type="button" class="nav-entry" class:selected={selectedId === entry.id}
            aria-current={selectedId === entry.id ? "page" : undefined} onclick={() => selectEntry(entry)}>
            <span class="nav-glyph">◇</span><span>{entry.name}</span>
            {#if selectedId === entry.id}<span class="selected-mark"></span>{/if}
          </button>
        {/each}
      {/each}
    </nav>
    <div class="sidebar-bottom"><span class="online-dot"></span><span>Local catalog</span><span class="version">v2.5.0</span></div>
  </aside>

  <main class="main-content">
    <header class="topbar">
      <div class="breadcrumbs"><span>Library</span><span class="breadcrumb-divider">/</span><strong>{selectedEntry.name}</strong></div>
      <div class="topbar-meta"><span class="online-dot"></span><span>Interactive preview</span><span class="topbar-divider"></span><span class="mono">STRATA / UI</span></div>
    </header>
    <div class="page-content">
      <section class="page-heading">
        <div><p class="eyebrow">COMPONENT <span class="eyebrow-separator">/</span> {selectedEntry.category.toUpperCase()}</p>
          <h1>{selectedEntry.name}<span class="heading-period">.</span></h1><p class="lead">{selectedEntry.description}</p>
        </div>
        <code class="element-tag">{selectedEntry.tagName}</code>
      </section>
      <section class="preview-block" aria-labelledby="preview-title">
        <div class="section-toolbar">
          <div class="section-heading"><span class="section-mark">▣</span><h2 id="preview-title">Preview</h2><span class="section-subtitle">Live canvas</span></div>
          <div class="toolbar-controls">
            <label><span>Surface</span><select bind:value={surface} aria-label="Canvas surface"><option value="light">Light</option><option value="dark">Dark</option><option value="grid">Grid</option></select></label>
            <span class="toolbar-divider"></span>
            <label><span>Viewport</span><select bind:value={viewport} aria-label="Canvas viewport"><option value="desktop">Desktop</option><option value="tablet">Tablet</option><option value="mobile">Mobile</option></select></label>
          </div>
        </div>
        <div class={"canvas canvas-" + surface} data-theme={surface === "dark" ? "dark" : "light"}>
          <div class={"preview-viewport viewport-" + viewport}>
            <div class="canvas-labels"><span>PREVIEW AREA</span><span>{viewport.toUpperCase()} / 01</span></div>
            <div class="preview-stage" bind:this={previewHost}></div>
          </div>
          <span class="canvas-footer">STRATA COMPONENT CATALOG</span>
        </div>
      </section>
      <div class="details-grid">
        <section class="usage-panel">
          <p class="eyebrow">IMPLEMENTATION</p><h2>Native by design.</h2>
          <p>This element is registered by the Lit component package. Properties are assigned directly to the DOM node so boolean and typed values remain intact.</p>
          <div class="metadata-line"><span>TAG</span><code>{selectedEntry.tagName}</code></div>
          <div class="metadata-line"><span>CONTROLS</span><strong>{selectedEntry.controls.length} properties</strong></div>
        </section>
        <Controls controls={selectedEntry.controls} {values} onValueChange={updateValue} onReset={resetValues} />
      </div>
      <footer class="page-footer"><span>STRATA DESIGN SYSTEM</span><span>MONOCHROME · SEMANTIC COLOR · SCALE LAW</span></footer>
    </div>
  </main>
</div>
