<script lang="ts">
  // Scenario D — data components with consistent sample data.
  const regions = ["Altiplano", "Litoral", "Chaco", "Valles", "Puna", "Yungas", "Selva", "Pantanal"];
  let page = $state(1);
  let filter = $state("");
  let view = $state("list");
  let sort = $state("asc");

  const detail = (e: Event) => (e as CustomEvent).detail as Record<string, unknown>;

  let rows = $derived(
    regions
      .filter((r) => !filter || r.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => (sort === "desc" ? b.localeCompare(a) : a.localeCompare(b))),
  );
  const indexGroups =
    '[{"heading":"A","items":[{"label":"Altiplano","href":"#"},{"label":"Andes","href":"#"}]},{"heading":"B","items":[{"label":"Bosque seco","href":"#"},{"label":"Bañado","href":"#"}]},{"heading":"C","items":[{"label":"Chaco","href":"#"},{"label":"Cordillera","href":"#"}]}]';

  let tableRows = $derived(
    rows.map((name, i) => ({
      name,
      zone: ["Oeste", "Este", "Norte", "Centro", "Sur"][i % 5],
      articles: 12 + ((i * 37) % 140),
    })),
  );
  const tableColumns =
    '[{"label":"Región"},{"label":"Zona"},{"label":"Artículos","numeric":true}]';
  let tableRowsJson = $derived(
    JSON.stringify(tableRows.map((row) => [row.name, row.zone, row.articles])),
  );
</script>

<div class="scenario scenario-data">
  <strata-filter-bar
    items="Altiplano|Litoral|Chaco|Valles|Puna|Yungas|Selva|Pantanal"
    value={filter}
    view={view}
    sort={sort}
    onstrata-change={(e: Event) => {
      const d = detail(e);
      if (typeof d.category === "string") filter = d.category;
      if (typeof d.view === "string") view = d.view;
      if (typeof d.sort === "string") sort = d.sort;
    }}
  ></strata-filter-bar>

  <strata-data-table columns={tableColumns} rows={tableRowsJson}></strata-data-table>

  <div class="data-controls">
    <strata-pagination
      page={page}
      pages="4"
      onpagination-change={(e: Event) => (page = Number(detail(e).page ?? page))}
    ></strata-pagination>
    <span class="mono-note">{rows.length} resultados · página {page} de 4 · vista {view} · orden {sort}</span>
  </div>

  <div class="data-grid">
    <strata-index-list
      columns="2"
      groups={indexGroups}
    ></strata-index-list>
    <div class="data-side">
      <strata-ranked-list
        label="Más leídas"
        items="Salar de Uyuni|Lago Titicaca|Río Pilcomayo|Cordillera Real|Valle de la Luna"
        divider
      ></strata-ranked-list>
      <strata-grille desktop="2" mobile="1" gap="small">
        {#each rows.slice(0, 4) as name (name)}
          <strata-grille-item>
            <strata-card title={name} excerpt="Entrada de la serie regional." heading="4"></strata-card>
          </strata-grille-item>
        {/each}
      </strata-grille>
    </div>
  </div>
</div>
