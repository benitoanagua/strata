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
  <span class="edge-handle-chevron" aria-hidden="true">{open ? "‹" : "›"}</span>
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
    box-shadow: -5px 3px 18px rgb(0 0 0 / 10%);
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
    right: clamp(320px, 30vw, 440px);
    border-right: 1px solid var(--strata-color-border-strong);
    border-radius: var(--strata-radius-small) 0 0 var(--strata-radius-small);
  }

  .edge-handle-chevron {
    font: 24px/1 var(--strata-font-sans);
  }

  .edge-handle-label {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font: 9px var(--strata-font-mono);
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  @media (max-width: 700px) {
    .edge-handle-open {
      right: min(100vw, 420px);
    }
  }

  @media (max-width: 420px) {
    .edge-handle-open {
      right: 100vw;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .edge-handle {
      transition: none;
    }
  }
</style>
