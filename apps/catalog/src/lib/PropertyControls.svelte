<script lang="ts">
  import type { ControlValue } from "./componentRegistry";
  import type { PropInfo } from "./props";

  interface Props {
    controls: PropInfo[];
    values: Record<string, unknown>;
    onValueChange: (name: string, value: ControlValue) => void;
    onReset: () => void;
  }

  let { controls, values, onValueChange, onReset }: Props = $props();

  function detailValue(event: Event): ControlValue {
    return (event as CustomEvent<{ value: ControlValue }>).detail
      ?.value as ControlValue;
  }
</script>

<section class="controls-panel" aria-labelledby="controls-heading">
  <div class="panel-heading">
    <div>
      <p class="eyebrow">CONFIGURATION</p>
      <h2 id="controls-heading">Properties</h2>
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <strata-button
      label="Reset"
      variant="text"
      size="small"
      onclick={onReset}
    ></strata-button>
  </div>

  <div class="control-list">
    {#each controls as control (control.name)}
      <div class="control-field">
        {#if control.type === "boolean"}
          <strata-checkbox
            label={control.label}
            checked={Boolean(values[control.name] ?? control.defaultValue)}
            onstrata-change={(event: Event) =>
              onValueChange(control.name, detailValue(event))}
          ></strata-checkbox>
        {:else if control.type === "number"}
          <strata-number-field
            label={control.label}
            value={Number(values[control.name] ?? control.defaultValue)}
            onstrata-input={(event: Event) =>
              onValueChange(control.name, detailValue(event))}
          ></strata-number-field>
        {:else if control.type === "select"}
          <strata-select
            label={control.label}
            value={String(values[control.name] ?? "")}
            options={control.options ?? []}
            onstrata-change={(event: Event) =>
              onValueChange(control.name, detailValue(event))}
          ></strata-select>
        {:else if control.type === "list"}
          <label class="control-label" for="prop-{control.name}">
            {control.label}
            {#if control.attribute}<code class="prop-attr"
                >{control.attribute}</code
              >{/if}
          </label>
          <textarea
            id="prop-{control.name}"
            rows="3"
            spellcheck="false"
            value={Array.isArray(values[control.name])
              ? (values[control.name] as unknown[]).join("\n")
              : String(values[control.name] ?? "")}
            oninput={(event: Event) =>
              onValueChange(
                control.name,
                (event.currentTarget as HTMLTextAreaElement).value,
              )}
          ></textarea>
        {:else}
          <strata-text-field
            label={control.label}
            value={String(values[control.name] ?? "")}
            onstrata-input={(event: Event) =>
              onValueChange(control.name, detailValue(event))}
          ></strata-text-field>
        {/if}
        {#if control.attribute && control.type !== "list"}
          <code class="prop-attr">{control.attribute}</code>
        {/if}
      </div>
    {/each}
  </div>
</section>
