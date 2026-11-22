<script lang="ts">
  // Scenario A — editorial article page composition.
</script>

<div class="scenario scenario-article">
  <strata-article-header
    category="Geografía"
    heading="El río que cambió de rumbo"
    deck="Una cronología de tres siglos de cartografía fluvial andina."
    author="Ana Ríos"
    date="21 nov 2026"
  >
    <strata-share slot="share" networks="x|email|copy" url="https://example.org/rio"></strata-share>
  </strata-article-header>

  <strata-meta items="21 nov 2026|Geografía|Ana Ríos|6 min de lectura"></strata-meta>
  <strata-tag-list items="Historia|Ríos|Cartografía|Andes" hue="auto"></strata-tag-list>

  <strata-prose>
    <p class="hatnote">Este artículo forma parte de la serie <em>Geografía viva</em>.</p>
    <p>Durante tres siglos, los mapas del altiplano andino dibujaron el mismo río de tres maneras distintas. La primera Cartografía del Pilcomayo, levantada en 1742, lo muestra serpenteando hacia el sur; un siglo después, los agrimensores del nuevo Estado lo enderezan casi por completo; y la edición de 1904, ya con fotografía aérea, revela que nunca se movió — solo cambiaron los ojos que lo miraban.</p>
    <strata-section-header heading="Los primeros levantamientos" subheading="1742–1820" level="2"></strata-section-header>
    <p>Los primeros levantamientos no buscaban precisión geodésica sino soberanía. Cada curva del trazado era una declaración: el río pertenecía a una jurisdicción, drenaba una provincia, pagaba un tributo. Cuando el Pilcomayo "cambió de rumbo" en los mapas de 1788, lo que cambió en realidad fue la frontera que los cartógrafos estaban dispuestos a reconocer.</p>
    <strata-quote cite="Ana Ríos" source="https://example.org/entrevista">
      La cartografía es una forma de memoria compartida: lo que un mapa calla, la historia lo repite.
    </strata-quote>
    <strata-section-header heading="La fotografía aérea" subheading="1950–2000" level="2"></strata-section-header>
    <p>Con la fotografía aérea el debate quedó zanjado. El curso del Pilcomayo era el mismo que en 1742; lo que había mutado era la escala del mapa y la ambición de sus lectores. Los ingenieros de la segunda mitad del siglo XX proyectaron represas sobre un río que, para ellos, por fin era real.</p>
  </strata-prose>

  <strata-gallery columns="3" label="Levantamientos históricos">
    <figure><div class="ph ph-tall"></div><figcaption>Fig. 1 — Traza de 1742</figcaption></figure>
    <figure><div class="ph"></div><figcaption>Fig. 2 — Plano de 1824</figcaption></figure>
    <figure><div class="ph ph-tall"></div><figcaption>Fig. 3 — Foto aérea 1958</figcaption></figure>
  </strata-gallery>

  <strata-prose>
    <p>Hoy el río sigue su curso, indiferente a trescientos años de líneas. Lo que permanece es la lección metodológica: cada generación cree que el mapa anterior se equivocó, cuando en realidad cada mapa responde a una pregunta distinta.</p>
  </strata-prose>

  <strata-author-box
    name="Ana Ríos"
    eyebrow="Autora"
    avatar="AR"
    meta="Editora|Desde 2021|128 artículos"
    description="Escribe sobre ciencia y cultura en los Andes. Doctora en geografía histórica."
    href="/autores/ana-rios"
  >
    <strata-share slot="links" networks="x|linkedin|email" text="Ana Ríos" url="https://example.org/rio"></strata-share>
  </strata-author-box>

  <strata-article-nav prev="Cuenca del Plata" prev-href="/prev" next="Río Bermejo" next-href="/next"></strata-article-nav>
</div>
