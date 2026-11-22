<script lang="ts">
  // Scenario E — form controls with live validation states.
  let name = $state("");
  let email = $state("");
  let qty = $state(2);
  let plan = $state("pro");
  let notify = $state(true);
  let volume = $state(60);
  let fileCount = $state(0);
  let submitted = $state(false);

  const detail = (e: Event) => (e as CustomEvent).detail as Record<string, unknown>;
  const emailError = $derived(
    email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? "Correo inválido." : "",
  );
</script>

<div class="scenario scenario-forms">
  <form
    class="form-grid"
    onsubmit={(e: Event) => {
      e.preventDefault();
      submitted = true;
    }}
  >
    <strata-text-field
      label="Nombre completo"
      placeholder="Ana Ríos"
      value={name}
      onstrata-input={(e: Event) => (name = String(detail(e).value ?? ""))}
    ></strata-text-field>
    <strata-search-field label="Buscar" placeholder="Buscar en el archivo…"></strata-search-field>
    <strata-text-field
      label="Correo"
      placeholder="ana@example.org"
      value={email}
      error={Boolean(emailError)}
      errorMessage={emailError}
      onstrata-input={(e: Event) => (email = String(detail(e).value ?? ""))}
    ></strata-text-field>
    <strata-number-field
      label="Unidades"
      min="1"
      max="50"
      step="1"
      value={qty}
      onstrata-change={(e: Event) => (qty = Number(detail(e).value ?? qty))}
    ></strata-number-field>
    <strata-date-field label="Fecha de envío" value="2026-11-22"></strata-date-field>
    <strata-select label="Región" value="andean">
      <option value="andean">Andina</option>
      <option value="litoral">Litoral</option>
      <option value="chaco">Chaco</option>
    </strata-select>
    <strata-file-upload
      label="Adjuntar archivo"
      accept=".pdf,.md"
      multiple
      onstrata-change={(e: Event) => (fileCount = (detail(e).value as string[] | undefined)?.length ?? 0)}
    ></strata-file-upload>
    <div class="stepper-block">
      <span class="field-label">Cantidad de pasos</span>
      <strata-stepper value="1" min="0" max="5"></strata-stepper>
    </div>
  </form>

  <fieldset class="choice-group">
    <legend>Opciones</legend>
    <strata-radio-group label="Plan">
      {#each [["starter", "Starter"], ["pro", "Pro"], ["enterprise", "Enterprise"]] as [value, label]}
        <strata-radio
          name="plan"
          {label}
          {value}
          checked={plan === value}
          onstrata-change={(e: Event) => (plan = String(detail(e).value ?? plan))}
        ></strata-radio>
      {/each}
    </strata-radio-group>
    <div class="choice-row">
      <strata-checkbox label="Acepto los términos" checked></strata-checkbox>
      <strata-switch
        label="Notificaciones por correo"
        checked={notify}
        onstrata-change={(e: Event) => (notify = Boolean(detail(e).value))}
      ></strata-switch>
    </div>
  </fieldset>

  <div class="slider-block">
    <span class="field-label">Volumen ({volume})</span>
    <strata-slider
      min="0"
      max="100"
      step="5"
      value={volume}
      onstrata-input={(e: Event) => (volume = Number(detail(e).value ?? volume))}
    ></strata-slider>
  </div>

  <div class="form-actions">
    <strata-button type="submit" label="Enviar" variant="filled" disabled={!name}></strata-button>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <strata-button
      label="Restablecer"
      variant="outlined"
      onclick={() => {
        name = "";
        email = "";
        submitted = false;
      }}
    ></strata-button>
    {#if submitted}
      <span class="status-ok" role="status">Enviado como {name} · plan {plan} · {qty} uds.</span>
    {/if}
    {#if fileCount}
      <span class="mono-note">{fileCount} archivo(s) adjunto(s)</span>
    {/if}
  </div>
</div>
