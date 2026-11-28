<script lang="ts">
  let {
    label,
    group = "States",
    selected = false,
    onSelect,
  }: {
    label: string;
    group?: string;
    selected?: boolean;
    onSelect: () => void;
  } = $props();
</script>

<button
  class="quick-view-card"
  class:selected
  type="button"
  aria-pressed={selected}
  onclick={onSelect}
>
  <span class="quick-view-card-title">{label}</span>
  <span class="quick-view-card-action">
    {selected ? "Previewing above" : "Show in preview"}
  </span>
  <span class="quick-view-caption">
    <span>{label}</span>
    <small>{group}</small>
  </span>
</button>
