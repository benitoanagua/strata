import type { ControlValue } from "./componentRegistry";
import type { PropInfo } from "./props";

export interface SnippetInput {
  tagName: string;
  controls: readonly PropInfo[];
  values: Record<string, ControlValue>;
  slotHtml?: string;
  slotContent?: string;
}

function toKebab(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Picks the quote style that keeps the attribute value readable: double
 * quotes by default, single quotes when the value contains `"` (JSON
 * payloads, nested markup). `&quot;` is only used when both quote
 * characters appear — it is valid HTML source, not a display artifact.
 */
function quoteAttr(value: string) {
  if (!value.includes('"')) return `"${value}"`;
  if (!value.includes("'")) return `'${value}'`;
  return `"${value.replace(/"/g, "&quot;")}"`;
}

interface SnippetAttr {
  name: string;
  value?: string;
}

function collectAttrs(
  controls: readonly PropInfo[],
  values: Record<string, ControlValue>,
): SnippetAttr[] {
  const attrs: SnippetAttr[] = [];
  for (const control of controls) {
    const value = values[control.name];
    if (value === undefined || value === null) continue;
    const name = control.attribute ?? toKebab(control.name);
    if (control.type === "boolean") {
      if (value) attrs.push({ name });
    } else if (typeof value === "string") {
      if (value !== "") attrs.push({ name, value });
    } else if (typeof value === "number") {
      attrs.push({ name, value: String(value) });
    }
  }
  return attrs;
}

const MULTILINE_ATTR_THRESHOLD = 3;
const MAX_SINGLE_LINE_ATTRS = 72;

function formatOpenTag(tagName: string, attrs: SnippetAttr[]) {
  if (!attrs.length) return `<${tagName}>`;
  const render = (a: SnippetAttr) =>
    a.value === undefined ? a.name : `${a.name}=${quoteAttr(a.value)}`;
  const inlineLength = attrs.reduce((n, a) => n + render(a).length + 1, 0);
  const multiline =
    attrs.length >= MULTILINE_ATTR_THRESHOLD ||
    inlineLength > MAX_SINGLE_LINE_ATTRS;
  if (!multiline) return `<${tagName} ${attrs.map(render).join(" ")}>`;
  return `<${tagName}\n${attrs.map((a) => `  ${render(a)}`).join("\n")}\n>`;
}

/**
 * Splits concatenated fixture markup (`<a></a><b></b>`) onto separate
 * lines so slotted content reads as real markup. Only `>` immediately
 * followed by an opening `<` is a boundary — `</` closers and `><`
 * inside quoted attribute values are left untouched.
 */
function formatSlot(inner: string) {
  return inner
    .replace(/>(?=<)(?!<\/)/g, ">\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `  ${line}`)
    .join("\n");
}

/**
 * Generates the canonical usage snippet: clean source code, one
 * attribute per line when the tag would otherwise be a long single
 * line, slotted content indented. The returned string is what the user
 * sees AND what the clipboard receives — highlighting happens later and
 * never feeds back into the source.
 */
export function buildSnippet(input: SnippetInput): string {
  const { tagName, controls, values, slotHtml, slotContent } = input;
  const attrs = collectAttrs(controls, values);
  const open = formatOpenTag(tagName, attrs);
  const inner = (slotHtml ?? slotContent ?? "").trim();
  const body = inner
    ? `${open}\n${formatSlot(inner)}\n</${tagName}>`
    : `${open}</${tagName}>`;
  return `import "@strata/components";\n\n${body}\n`;
}

function jsString(value: string) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function elementVarName(tagName: string) {
  const base = tagName.replace(/^strata-/, "");
  return base.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

/**
 * Framework-free DOM usage: import the package once, create the element,
 * set the same attributes shown in the HTML tab, append it. Real code a
 * vanilla-JS consumer can paste — not a framework conversion.
 */
export function buildJsSnippet(input: SnippetInput): string {
  const { tagName, controls, values, slotHtml, slotContent } = input;
  const attrs = collectAttrs(controls, values);
  const varName = elementVarName(tagName);
  const lines = [
    'import "@strata/components";',
    "",
    `const ${varName} = document.createElement("${tagName}");`,
  ];
  for (const attr of attrs) {
    lines.push(
      attr.value === undefined
        ? `${varName}.setAttribute(${jsString(attr.name)}, "");`
        : `${varName}.setAttribute(${jsString(attr.name)}, ${jsString(attr.value)});`,
    );
  }
  const inner = (slotHtml ?? slotContent ?? "").trim();
  if (inner) {
    const escaped = inner
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$\{/g, "\\${");
    lines.push(`${varName}.innerHTML = \`${escaped}\`;`);
  }
  lines.push("", `document.body.append(${varName});`, "");
  return lines.join("\n");
}

export const INSTALL_SNIPPET = "pnpm add @strata/components\n";

export interface SnippetExample {
  id: string;
  label: string;
  lang: "html" | "javascript" | "bash";
  code: string;
}

/**
 * The tab set every component page offers: markup usage, vanilla JS
 * usage and the real install command. No framework conversions — STRATA
 * ships Web Components, so HTML and DOM APIs are the honest examples.
 */
export function buildExamples(input: SnippetInput): SnippetExample[] {
  return [
    { id: "html", label: "HTML", lang: "html", code: buildSnippet(input) },
    {
      id: "js",
      label: "JavaScript",
      lang: "javascript",
      code: buildJsSnippet(input),
    },
    {
      id: "install",
      label: "Install",
      lang: "bash",
      code: INSTALL_SNIPPET,
    },
  ];
}
