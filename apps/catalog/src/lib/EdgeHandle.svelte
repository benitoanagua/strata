<script lang="ts">
  let {
    open = false,
    onToggle,
  }: {
    open?: boolean;
    onToggle: () => void;
  } = $props();
</script>

<button
  class="edge-handle"
  class:edge-handle-open={open}
  type="button"
  aria-label={open ? "Close Playground" : "Open Playground"}
  aria-expanded={open}
  aria-controls="playground-properties"
  aria-haspopup="dialog"
  onclick={onToggle}
>
  <span class="edge-handle-chevron" aria-hidden="true"></span>
  <span class="edge-handle-label">Playground</span>
</button>

<style>
  .edge-handle {
    position: fixed;
    z-index: 82;
    top: 50%;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 34px;
    min-height: 132px;
    padding: 12px 7px;
    transform: translateY(-50%);
    border: 1px solid var(--strata-color-border-strong);
    border-right: 0;
    border-radius: var(--strata-radius-small) 0 0 var(--strata-radius-small);
    background: var(--strata-color-surface-raised);
    color: var(--strata-color-text-primary);
    box-shadow: var(--catalog-shadow-1);
    cursor: pointer;
    transition: right 180ms ease, background 120ms ease, color 120ms ease;
  }

  .edge-handle:hover {
    background: var(--strata-color-surface-hover);
  }

  .edge-handle:focus-visible {
    outline: 2px solid var(--strata-color-border-focus);
    outline-offset: 2px;
  }

  .edge-handle-open {
    right: max(0px, calc(var(--catalog-playground-width) - 34px));
    border-right: 1px solid var(--strata-color-border-strong);
    border-radius: var(--strata-radius-small) 0 0 var(--strata-radius-small);
  }

  .edge-handle-chevron {
    display: block;
    width: 8px;
    height: 8px;
    flex: 0 0 8px;
    border: solid currentColor;
    border-width: 0 2px 2px 0;
    transform: rotate(135deg);
    transition: transform 180ms ease;
  }

  .edge-handle-open .edge-handle-chevron {
    transform: rotate(-45deg);
  }

  .edge-handle-label {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font: 9px var(--strata-font-mono);
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  @media (prefers-reduced-motion: reduce) {
    .edge-handle {
      transition: none;
    }
  }
</style>
