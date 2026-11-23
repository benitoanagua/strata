<script lang="ts">
  import type { ControlValue } from "./componentRegistry";
  import type { PropInfo } from "./props";
  import { buildSnippet } from "./snippet";
  import { highlightSnippet } from "./highlight";
  import { copyText } from "./clipboard";

  let { tagName, controls, values, slotHtml, slotContent }: {
    tagName: string;
    controls: readonly PropInfo[];
    values: Record<string, ControlValue>;
    slotHtml?: string;
    slotContent?: string;
  } = $props();

  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  const snippet = $derived(
    buildSnippet({ tagName, controls, values, slotHtml, slotContent }),
  );
  const highlighted = $derived(highlightSnippet(snippet));

  async function copy() {
    const ok = await copyText(snippet);
    if (!ok) return;
    copied = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copied = false), 1600);
  }
</script>

<div class="snippet-block">
  <div class="snippet-head">
    <span class="eyebrow">USAGE</span>
    <span class="snippet-meta">
      <span class="snippet-lang">HTML</span>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <strata-button
        size="small"
        variant="text"
        icon={copied ? "carbon:checkmark" : "carbon:copy"}
        label={copied ? "Copied" : "Copy"}
        aria-label={copied ? "Snippet copied to clipboard" : "Copy snippet to clipboard"}
        onclick={copy}
      ></strata-button>
    </span>
  </div>
  <pre><code>{@html highlighted}</code></pre>
  <span class="sr-only" role="status" aria-live="polite">
    {copied ? "Snippet copied to clipboard." : ""}
  </span>
</div>
