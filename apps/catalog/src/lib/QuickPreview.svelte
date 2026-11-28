<script lang="ts">
  import { mountStrataElement, type StrataMountHandle } from "./renderer";

  let { tagName, props, slotHtml, slotContent, label } = $props<{
    tagName: string;
    props: Record<string, unknown>;
    slotHtml?: string;
    slotContent?: string;
    label: string;
  }>();

  let host = $state<HTMLDivElement>();

  $effect(() => {
    const target = host;
    const tag = tagName;
    const componentProps = props;
    if (!target) return;

    let cancelled = false;
    let mounted: StrataMountHandle | undefined;
    target.replaceChildren();

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
      handle.element.style.maxWidth = "100%";
    });

    return () => {
      cancelled = true;
      mounted?.destroy();
    };
  });
</script>

<article class="quick-view-card" aria-label={label}>
  <div class="quick-view-stage" bind:this={host}></div>
  <div class="quick-view-caption">{label}</div>
</article>
