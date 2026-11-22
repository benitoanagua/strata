<script lang="ts">
  import type { ControlValue } from "./componentRegistry";
  import type { PropInfo } from "./props";

  let { tagName, controls, values, slotHtml, slotContent }: {
    tagName: string;
    controls: readonly PropInfo[];
    values: Record<string, ControlValue>;
    slotHtml?: string;
    slotContent?: string;
  } = $props();

  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  function toKebab(name: string) {
    return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  }

  const snippet = $derived.by(() => {
    const attrs: string[] = [];
    for (const control of controls) {
      const value = values[control.name];
      if (value === undefined || value === null) continue;
      if (control.type === "boolean") {
        if (value) attrs.push(control.attribute ?? toKebab(control.name));
      } else if (typeof value === "string" && value !== "") {
        attrs.push(
          `${control.attribute ?? toKebab(control.name)}="${value.replace(/"/g, "&quot;")}"`,
        );
      } else if (typeof value === "number") {
        attrs.push(
          `${control.attribute ?? toKebab(control.name)}="${value}"`,
        );
      }
    }
    const attrText = attrs.length ? " " + attrs.join(" ") : "";
    const inner = (slotHtml ?? slotContent ?? "").trim();
    const html = inner
      ? `<${tagName}${attrText}>\n  ${inner}\n</${tagName}>`
      : `<${tagName}${attrText}></${tagName}>`;
    return `import "@strata/components";\n\n${html}\n`;
  });

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = snippet;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    copied = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copied = false), 1600);
  }
</script>

<div class="snippet-block">
  <div class="snippet-head">
    <span class="eyebrow">USAGE</span>
    <button class="text-action" type="button" onclick={copy}>
      {copied ? "Copied" : "Copy"}
    </button>
  </div>
  <pre><code>{snippet}</code></pre>
</div>
