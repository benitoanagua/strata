<script lang="ts">
  // Scenario C — social interaction: author, share and comment thread.
  let replies = $state(0);
</script>

<div class="scenario scenario-social">
  <strata-article-header
    category="Ensayo"
    heading="Notas sobre el diseño silencioso"
    deck="Por qué los sistemas serios susurran en lugar de gritar."
    author="Ana Ríos"
    date="20 nov 2026"
  ></strata-article-header>

  <strata-share networks="x|facebook|linkedin|whatsapp|email|copy" url="https://example.org/diseno" text="Notas sobre el diseño silencioso"></strata-share>

  <strata-author-box
    name="Ana Ríos"
    eyebrow="Autora"
    avatar="AR"
    meta="Editora|Desde 2021|128 artículos"
    description="Escribe sobre ciencia y cultura en los Andes."
    href="/autores/ana-rios"
  >
    <strata-share slot="links" networks="x|email" text="Ana Ríos" url="https://example.org"></strata-share>
  </strata-author-box>

  <strata-comment-thread heading="Discusión" count="3">
    <strata-comment
      author="Luis Mamani"
      avatar="LM"
      date="hace 2 h"
      date-time="2026-11-21T18:00"
      role-label="Lector"
      replyable
      onstrata-reply={() => (replies += 1)}
    >
      <p>La idea del «filete» como firma tipográfica es precisa. Me recuerda a los divisores dobles de la edición de 1904 que mencionas en el otro artículo.</p>
      <strata-comment slot="replies" author="Ana Ríos" avatar="AR" date="hace 1 h" role-label="Autora">
        <p>Exacto — el filete no decora, estructura. Buena observación.</p>
      </strata-comment>
    </strata-comment>
    <strata-comment author="Carla Quispe" avatar="CQ" date="hace 45 min" role-label="Lector" replyable>
      <p>¿El sistema contempla modo de alto contraste para impresión? El gris de los filetes me preocupa en láser barato.</p>
    </strata-comment>
    <strata-comment author="Diego Vargas" avatar="DV" date="hace 10 min" role-label="Moderador">
      <p>Sobre impresión: los tokens usan colores de sistema en @media print justamente por eso. Lo documento en TESTING.md.</p>
    </strata-comment>
    <div slot="form" class="comment-form">
      <strata-text-field label="Tu nombre" placeholder="Nombre"></strata-text-field>
      <strata-text-field label="Comentario" placeholder="Escribe tu comentario…"></strata-text-field>
      <strata-button label="Publicar comentario" variant="filled"></strata-button>
    </div>
  </strata-comment-thread>

  {#if replies > 0}
    <p class="reply-note" role="status">Respuesta solicitada ({replies}).</p>
  {/if}
</div>
