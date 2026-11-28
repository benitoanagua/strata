<script lang="ts">
  import QuickPreview from "../lib/QuickPreview.svelte";
  import type { CatalogStory } from "./storyManifest";

  export interface GalleryStory extends CatalogStory {
    props: Record<string, unknown>;
  }

  let {
    tagName,
    stories,
    slotHtml,
    slotContent,
  }: {
    tagName: string;
    stories: GalleryStory[];
    slotHtml?: string;
    slotContent?: string;
  } = $props();

  let track = $state<HTMLDivElement>();
</script>

<section class="quick-view-gallery" aria-label="Quick view story gallery">
  <header class="quick-view-gallery-heading">
    <span class="playground-presets-label">Quick view</span>
    <span class="quick-view-gallery-count">{stories.length} stories</span>
  </header>
  <div class="quick-view-gallery-track" bind:this={track}>
    {#each stories as item (item.id)}
      <QuickPreview
        root={track}
        tagName={tagName}
        props={item.props}
        slotHtml={slotHtml}
        slotContent={slotContent}
        label={item.title}
        group={item.group}
      />
    {/each}
  </div>
</section>
