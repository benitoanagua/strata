<script lang="ts">
  // Scenario B — knowledge-base article with navigation chrome.
  const hatnoteItems =
    '[{"label":"Pilcomayo (desambiguación)","href":"#"},{"label":"Cuenca del Plata","href":"#"}]';
  const references =
    '[{"id":"r1","label":"Servicio Geográfico Militar. Atlas de Bolivia. La Paz, 1987."},{"id":"r2","label":"Bonetto, C. & Waisman, S. (1995). Cuencas sedimentarias del Plata. Buenos Aires: Eudeba."},{"id":"r3","label":"Missions records, Archivo General de la Nación, Buenos Aires."}]';
</script>

<div class="scenario scenario-wiki">
  <strata-hatnote lead="Para otros usos, véase" items={hatnoteItems}></strata-hatnote>

  <header class="wiki-head">
    <h1 class="wiki-title">Río Pilcomayo</h1>
    <strata-meta items="Última edición: 20 nov 2026|Ver historial"></strata-meta>
    <strata-reading-time target="#wiki-body" label="min de lectura" show-words></strata-reading-time>
  </header>

  <strata-reading-progress target="#wiki-body" placement="inline" label="Progreso de lectura"></strata-reading-progress>

  <div class="wiki-body" id="wiki-body">
    <strata-prose>
      <p>El <strong>río Pilcomayo</strong> es un curso de agua de la cuenca del Plata que nace en la cordillera de Los Andes, en el departamento boliviano de Tarija, y desemboca en el Paraguay tras recorrer unos 1.590 kilómetros.<sup><strata-cite ref="r1"></strata-cite></sup> Es conocido por sus dos brazos: el Pilcomayo norte, que forma frontera entre Paraguay y Argentina, y el Pilcomayo sur, que riega el Chaco.</p>

      <h2>Curso y cuenca</h2>
      <p>El Pilcomayo desciende desde los 4.000 metros de la Puna hasta las llanuras chaqueñas. Su régimen es tropical con lluvias concentradas en verano, lo que produce crecidas abruptas y una llanura de inundación extensa.<sup><strata-cite ref="r2"></strata-cite></sup></p>
      <p>La cuenca abarca partes de Bolivia, Argentina, Paraguay y Brasil, con una superficie aproximada de 270.000 km². Es una de las pocas cuencas del mundo donde conviven cuatro países con marcos jurídicos distintos para el uso del agua.</p>

      <h2>Historia</h2>
      <h3>Los primeros registros</h3>
      <p>Los misioneros jesuitas documentaron el río en el siglo XVII como frontera natural de las reducciones. Los mapas coloniales lo denominaban «río de los toxos», por las comunidades tonocotés que habitaban sus márgenes.<sup><strata-cite ref="r3"></strata-cite></sup></p>
      <h3>La guerra del Chaco</h3>
      <p>Durante la guerra del Chaco (1932–1935), el control del Pilcomayo fue un objetivo estratégico: quien dominaba el río dominaba el abastecimiento de la retaguardia. El conflicto dejó el trazado fronterizo actual entre Paraguay y Argentina.</p>

      <h2>Geografía física</h2>
      <p>El curso superior es de montaña, con valles angostos y rápidos. A la altura de Formosa el río se divide en dos brazos que delimitan el Gran Pantanal chaqueño. El brazo sur, más caudaloso, alimenta los esteros y bañado del Chaco central.</p>
      <p>La sedimentación es intensa: el Pilcomayo transporta arenas que colmatan su propio cauce, lo que explica los cambios de trayectoria documentados desde el siglo XIX.</p>

      <h3>Regulación y uso</h3>
      <p>Existen presas en el curso boliviano (Pilar y San Andrés) y en el argentino (Las Lomitas). El uso consuntivo es principalmente agrícola; la navegación comercial solo es posible en el tramo paraguayo durante la estación de lluvias.</p>

      <h2>Problemas ambientales</h2>
      <p>La deforestación del Chaco seco y la expansión agrícola del soja han incrementado la sedimentación y reducido los caudales medios. Organizaciones de cuenca binacionales trabajan en un plan maestro que aún no se ha ratificado.</p>

      <strata-references
        heading="Referencias"
        items={references}
      ></strata-references>

      <strata-article-nav prev="Río Paraguay" prev-href="#" next="Gran Chaco" next-href="#"></strata-article-nav>
    </strata-prose>
  </div>

  <aside class="wiki-aside">
    <strata-toc target="#wiki-body" variant="rail" levels="2-3" heading="Contenido" numbered></strata-toc>
  </aside>

  <strata-back-to-top variant="floating" label="Volver arriba" target="#wiki-body"></strata-back-to-top>
  <strata-heading-anchors target="#wiki-body" levels="2-4"></strata-heading-anchors>
</div>
