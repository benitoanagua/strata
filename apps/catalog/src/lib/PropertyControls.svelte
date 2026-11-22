<script lang="ts">
  import type { ControlValue, PropControl } from "./componentRegistry";
  import type { PropInfo } from "./props";
  let { controls, values, onValueChange, onReset }: {
    controls: readonly PropInfo[];
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
      <label for={"prop-" + control.name}>
        {control.label}
        {#if control.attribute}<code class="prop-attr">{control.attribute}</code>{/if}
      </label>
      {#if control.type === "boolean"}
        <input id={"prop-" + control.name} type="checkbox" checked={Boolean(values[control.name])}
          onchange={(event) => onValueChange(control.name, event.currentTarget.checked)} />
      {:else if control.type === "select"}
        <select id={"prop-" + control.name} value={String(values[control.name])}
          onchange={(event) => onValueChange(control.name, event.currentTarget.value)}>
          {#each control.options ?? [] as option}<option value={option}>{option}</option>{/each}
        </select>
      {:else if control.type === "list"}
        <textarea id={"prop-" + control.name} rows="3" spellcheck="false"
          placeholder="JSON array or pipe-separated values"
          value={String(values[control.name] ?? "")}
          oninput={(event) => onValueChange(control.name, event.currentTarget.value)}></textarea>
      {:else}
        <input id={"prop-" + control.name} type={control.type === "number" ? "number" : "text"}
          value={String(values[control.name] ?? "")}
          oninput={(event) => onValueChange(control.name, control.type === "number" ? Number(event.currentTarget.value) : event.currentTarget.value)} />
      {/if}
    </div>
  {/each}
</section>
