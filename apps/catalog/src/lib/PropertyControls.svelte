<script lang="ts">
  import type { ControlValue, PropControl } from "./componentRegistry";
  let { controls, values, onValueChange, onReset }: {
    controls: readonly PropControl[];
    values: Record<string, ControlValue>;
    onValueChange: (name: string, value: ControlValue) => void;
    onReset: () => void;
  } = $props();
</script>

<section class="controls-panel" aria-labelledby="controls-heading">
  <div class="panel-heading">
    <div><p class="eyebrow">CONFIGURATION</p><h2 id="controls-heading">Properties</h2></div>
    <button class="text-action" type="button" onclick={onReset}>Reset</button>
  </div>
  {#each controls as control (control.name)}
    <div class="control-row">
      <label for={"prop-" + control.name}>{control.label}</label>
      {#if control.type === "boolean"}
        <input id={"prop-" + control.name} type="checkbox" checked={Boolean(values[control.name])}
          onchange={(event) => onValueChange(control.name, event.currentTarget.checked)} />
      {:else if control.type === "select"}
        <select id={"prop-" + control.name} value={String(values[control.name])}
          onchange={(event) => onValueChange(control.name, event.currentTarget.value)}>
          {#each control.options ?? [] as option}<option value={option}>{option}</option>{/each}
        </select>
      {:else}
        <input id={"prop-" + control.name} type={control.type} value={String(values[control.name])}
          oninput={(event) => onValueChange(control.name, control.type === "number" ? Number(event.currentTarget.value) : event.currentTarget.value)} />
      {/if}
    </div>
  {/each}
</section>
