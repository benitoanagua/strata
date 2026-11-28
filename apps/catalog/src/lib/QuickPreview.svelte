<script lang="ts">
  import { mountStrataElement, type StrataMountHandle } from "./renderer";

  let {
    root = null,
    tagName,
    props,
    slotHtml,
    slotContent,
    label,
    group = "States",
  }: {
    root?: HTMLElement | null;
    tagName: string;
    props: Record<string, unknown>;
    slotHtml?: string;
    slotContent?: string;
    label: string;
    group?: string;
  } = $props();

  let card = $state<HTMLElement>();
  let host = $state<HTMLDivElement>();
  let nearViewport = $state(false);

  // All stories are known and listed immediately; only previews near the
  // horizontal viewport are mounted, keeping custom-element work bounded.
  $effect(() => {
    const target = card;
    const scrollRoot = root;
    if (!target) return;

    if (typeof IntersectionObserver === "undefined") {
      nearViewport = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        nearViewport = entry?.isIntersecting ?? false;
      },
      {
        root: scrollRoot,
        rootMargin: "260px 0px",
        threshold: 0,
      },
    );
    observer.observe(target);
    return () => observer.disconnect();
  });

  $effect(() => {
    const target = host;
    const active = nearViewport;
    const tag = tagName;
    const componentProps = props;
    if (!target) return;

    let cancelled = false;
    let mounted: StrataMountHandle | undefined;
    target.replaceChildren();

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
    });

    return () => {
      cancelled = true;
      mounted?.destroy();
    };
  });
</script>

<article class="quick-view-card" aria-label={`${group}: ${label}`} bind:this={card}>
  <div class="quick-view-stage" bind:this={host}></div>
  <div class="quick-view-caption">
    <span>{label}</span>
    <small>{group}</small>
  </div>
</article>
