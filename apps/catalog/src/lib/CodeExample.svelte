<script lang="ts">
  import type { ControlValue } from "./componentRegistry";
  import type { PropInfo } from "./props";
  import { buildExamples, type SnippetExample } from "./snippet";
  import {
    highlightSnippet,
    type HighlightedCode,
    type SnippetTheme,
  } from "./highlight";
  import { copyText } from "./clipboard";
  import type { ThemedToken } from "shiki/types";

  let {
    tagName,
    controls,
    values,
    slotHtml,
    slotContent,
    theme,
  }: {
    tagName: string;
    controls: readonly PropInfo[];
    values: Record<string, ControlValue>;
    slotHtml?: string;
    slotContent?: string;
    theme: SnippetTheme;
  } = $props();

  let tab = $state(0);
  let showLines = $state(true);
  let wrap = $state(false);
  let expanded = $state(false);
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | undefined;
  let highlighted = $state<HighlightedCode | null>(null);

  const examples = $derived(
    buildExamples({ tagName, controls, values, slotHtml, slotContent }),
  );
  const active = $derived<SnippetExample>(examples[tab]);

  const COLLAPSE_OVER = 14;
  const COLLAPSED_LINES = 10;
  const lineCount = $derived(
    active.code.replace(/\n$/, "").split("\n").length,
  );
  const collapsible = $derived(lineCount > COLLAPSE_OVER);
  const visibleCount = $derived(
    collapsible && !expanded ? COLLAPSED_LINES : lineCount,
  );

  $effect(() => {
    const { code, lang } = active;
    const t = theme;
    let alive = true;
    highlighted = null;
    highlightSnippet(code, lang, t).then((result) => {
      if (alive) highlighted = result;
    });
    return () => {
      alive = false;
    };
  });

  const displayLines = $derived.by((): ThemedToken[][] => {
    const lines =
      highlighted?.lines ??
      active.code
        .replace(/\n$/, "")
        .split("\n")
        .map((l) => [{ content: l, offset: 0 }]);
    return lines.slice(0, visibleCount);
  });

  function selectTab(index: number) {
    tab = index;
    expanded = false;
  }

  function onTabKeydown(event: KeyboardEvent) {
    const forward = event.key === "ArrowRight";
    const backward = event.key === "ArrowLeft";
    if (!forward && !backward && event.key !== "Home" && event.key !== "End")
      return;
    event.preventDefault();
    const last = examples.length - 1;
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? last
          : forward
            ? (tab + 1) % examples.length
            : (tab - 1 + examples.length) % examples.length;
    selectTab(next);
    const tabs = (event.currentTarget as HTMLElement).parentElement
      ?.querySelectorAll<HTMLElement>('[role="tab"]');
    tabs?.[next]?.focus();
  }

  async function copy() {
    const ok = await copyText(active.code);
    if (!ok) return;
    copied = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copied = false), 1600);
  }
</script>

<div class="code-block">
  <div class="code-head">
    <span class="eyebrow">USAGE</span>
    <div class="code-tabs" role="tablist" aria-label="Snippet language">
      {#each examples as ex, i (ex.id)}
        <button
          type="button"
          role="tab"
          id={`code-tab-${ex.id}`}
          aria-selected={tab === i}
          aria-controls="code-panel"
          tabindex={tab === i ? 0 : -1}
          class="code-tab"
          class:active={tab === i}
          onclick={() => selectTab(i)}
          onkeydown={onTabKeydown}
        >
          {ex.label}
        </button>
      {/each}
    </div>
    <div class="code-tools">
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <strata-tooltip text={showLines ? "Hide line numbers" : "Show line numbers"}>
        <strata-icon-button
          size="small"
          icon="carbon:list-numbered"
          label={showLines ? "Hide line numbers" : "Show line numbers"}
          pressed={showLines}
          onclick={() => (showLines = !showLines)}
        ></strata-icon-button>
      </strata-tooltip>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <strata-tooltip text={wrap ? "Disable line wrapping" : "Wrap long lines"}>
        <strata-icon-button
          size="small"
          icon="carbon:text-wrap"
          label={wrap ? "Disable line wrap" : "Wrap lines"}
          pressed={wrap}
          onclick={() => (wrap = !wrap)}
        ></strata-icon-button>
      </strata-tooltip>
      {#if collapsible}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <strata-icon-button
          size="small"
          icon={expanded ? "carbon:chevron-up" : "carbon:chevron-down"}
          label={expanded ? "Collapse code" : "Expand code"}
          expanded={expanded}
          onclick={() => (expanded = !expanded)}
        ></strata-icon-button>
      {/if}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <strata-button
        size="small"
        variant="text"
        icon={copied ? "carbon:checkmark" : "carbon:copy"}
        label={copied ? "Copied" : "Copy"}
        aria-label={copied
          ? `${active.label} snippet copied to clipboard`
          : `Copy ${active.label} snippet to clipboard`}
        onclick={copy}
      ></strata-button>
    </div>
  </div>
  <div
    class="code-scroll"
    class:wrap
    class:clamped={collapsible && !expanded}
    class:no-lines={!showLines}
    id="code-panel"
    role="tabpanel"
    aria-labelledby={`code-tab-${active.id}`}
    style:--code-fg={highlighted?.fg}
    style:--code-bg={highlighted?.bg}
  >
    {#each displayLines as line, i (i)}
      <div class="code-line">
        {#if showLines}
          <span class="line-no" aria-hidden="true">{i + 1}</span>
        {/if}
        <span class="line-text"
          >{#each line as token (token.offset)}<span
              class:tok-italic={(token.fontStyle ?? 0) & 1}
              style:color={token.color}>{token.content}</span
            >{/each}</span
        >
      </div>
    {/each}
  </div>
  <span class="sr-only" role="status" aria-live="polite">
    {copied ? `${active.label} snippet copied to clipboard.` : ""}
  </span>
</div>
