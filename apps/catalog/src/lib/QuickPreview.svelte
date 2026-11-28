<script lang="ts">
  import { mountStrataElement, type StrataMountHandle } from "./renderer";

  let {
    tagName,
    props,
    slotHtml,
    slotContent,
    label,
    group = "States",
  }: {
    tagName: string;
    props: Record<string, unknown>;
    slotHtml?: string;
    slotContent?: string;
    label: string;
    group?: string;
  } = $props();

  let card = $state<HTMLElement>();
  let host = $state<HTMLDivElement>();
  let previewLoaded = $state(false);
  let previewFailed = $state(false);

  // Each story stays unmounted until its own Load preview control is activated.
  $effect(() => {
    const target = host;
    const active = previewLoaded;
    const tag = tagName;
    const componentProps = props;
    if (!target) return;

    let cancelled = false;
    let mounted: StrataMountHandle | undefined;
    target.replaceChildren();
    previewFailed = false;

    if (!active) return;

    void mountStrataElement(target, {
      tagName: tag,
      props: componentProps,
      slotHtml,
      slotContent,
    }).then((handle) => {
      if (cancelled) {
        handle.destroy();
        return;
      }
      mounted = handle;
      handle.element.style.display = "block";
      handle.element.style.width = "100%";
      handle.element.style.minWidth = "0";
      handle.element.style.maxWidth = "100%";
    }).catch(() => {
      if (!cancelled) previewFailed = true;
    });

    return () => {
      cancelled = true;
      mounted?.destroy();
    };
  });
</script>

<article class="quick-view-card" aria-label={`${group}: ${label}`} bind:this={card}>
  <div class="quick-view-stage">
    {#if !previewLoaded}
      <div class="quick-view-placeholder">
        <span>{label}</span>
        <button
          class="quick-view-load"
          type="button"
          onclick={() => {
            previewFailed = false;
            previewLoaded = true;
          }}
        >Load preview</button>
      </div>
    {:else}
      <div class="quick-view-host" bind:this={host}></div>
      <button
        class="quick-view-unload"
        type="button"
        onclick={() => {
          previewLoaded = false;
          previewFailed = false;
        }}
      >Unload</button>
    {/if}
    {#if previewFailed}
      <span class="quick-view-error" role="status">Preview unavailable</span>
    {/if}
  </div>
  <div class="quick-view-caption">
    <span>{label}</span>
    <small>{group}</small>
  </div>
</article>

<style>
  .quick-view-placeholder {
    display: flex;
    height: 100%;
    min-height: 10rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    text-align: center;
  }

  .quick-view-load,
  .quick-view-unload {
    border: 1px solid var(--strata-color-border-strong, #bdbdbd);
    border-radius: var(--strata-radius-small, 2px);
    background: var(--strata-color-surface-raised, #fff);
    color: var(--strata-color-text-primary, #111);
    padding: 0.5rem 0.75rem;
    font: inherit;
    cursor: pointer;
  }

  .quick-view-load:hover,
  .quick-view-unload:hover {
    background: var(--strata-color-surface-selected, #f2f2f2);
  }

  .quick-view-unload {
    position: absolute;
    right: 0.5rem;
    bottom: 0.5rem;
    z-index: 1;
    font-size: 0.75rem;
  }
</style>
