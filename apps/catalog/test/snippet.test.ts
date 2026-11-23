import { describe, expect, it } from "vitest";
import {
  buildExamples,
  buildJsSnippet,
  buildSnippet,
  INSTALL_SNIPPET,
} from "../src/lib/snippet";
import { highlightSnippet } from "../src/lib/highlight";
import { copyText } from "../src/lib/clipboard";
import type { PropInfo } from "../src/lib/props";

const control = (
  name: string,
  type: PropInfo["type"],
  extra: Partial<PropInfo> = {},
): PropInfo => ({
  name,
  label: name,
  type,
  defaultValue: type === "boolean" ? false : "",
  ...extra,
});

describe("buildSnippet", () => {
  it("emits the import line and a self-closing-free element", () => {
    const code = buildSnippet({
      tagName: "strata-button",
      controls: [control("label", "text")],
      values: { label: "Save" },
    });
    expect(code).toBe(
      'import "@strata/components";\n\n<strata-button label="Save"></strata-button>\n',
    );
  });

  it("represents boolean props as bare attributes", () => {
    const code = buildSnippet({
      tagName: "strata-button",
      controls: [control("disabled", "boolean"), control("loading", "boolean")],
      values: { disabled: true, loading: false },
    });
    expect(code).toContain("<strata-button disabled></strata-button>");
    expect(code).not.toContain("loading");
  });

  it("never emits HTML entities for ordinary quotes", () => {
    const code = buildSnippet({
      tagName: "strata-button",
      controls: [control("label", "text")],
      values: { label: 'Say "hi"' },
    });
    expect(code).toContain(`label='Say "hi"'`);
    expect(code).not.toContain("&quot;");
  });

  it("switches JSON-heavy attributes to single quotes", () => {
    const items = '[{"label":"Home","href":"/"},{"label":"Docs"}]';
    const code = buildSnippet({
      tagName: "strata-breadcrumb",
      controls: [
        control("size", "select"),
        control("tone", "select"),
        control("items", "list"),
      ],
      values: { size: "medium", tone: "neutral", items },
    });
    expect(code).toContain(`items='${items}'`);
    expect(code).not.toContain("&quot;");
  });

  it("formats multi-attribute tags one attribute per line", () => {
    const code = buildSnippet({
      tagName: "strata-breadcrumb",
      controls: [
        control("size", "select"),
        control("tone", "select"),
        control("items", "list"),
      ],
      values: { size: "medium", tone: "neutral", items: '[{"label":"A"}]' },
    });
    expect(code).toContain(
      '<strata-breadcrumb\n  size="medium"\n  tone="neutral"\n  items=\'[{"label":"A"}]\'\n></strata-breadcrumb>',
    );
  });

  it("indents slotted markup line by line", () => {
    const code = buildSnippet({
      tagName: "strata-button-group",
      controls: [],
      values: {},
      slotHtml:
        '<strata-button label="One"></strata-button>' +
        '<strata-button label="Two"></strata-button>',
    });
    expect(code).toContain(
      "<strata-button-group>\n" +
        '  <strata-button label="One"></strata-button>\n' +
        '  <strata-button label="Two"></strata-button>\n' +
        "</strata-button-group>",
    );
  });

  it("indents plain-text slot content", () => {
    const code = buildSnippet({
      tagName: "strata-alert",
      controls: [],
      values: {},
      slotContent: "Changes saved.",
    });
    expect(code).toContain("<strata-alert>\n  Changes saved.\n</strata-alert>");
  });

  it("skips empty and undefined values", () => {
    const code = buildSnippet({
      tagName: "strata-text-field",
      controls: [control("label", "text"), control("value", "text")],
      values: { label: "Name", value: "" },
    });
    expect(code).toBe(
      'import "@strata/components";\n\n<strata-text-field label="Name"></strata-text-field>\n',
    );
  });
});

describe("buildJsSnippet", () => {
  const input = {
    tagName: "strata-button",
    controls: [
      control("label", "text"),
      control("variant", "select"),
      control("disabled", "boolean"),
    ],
    values: { label: "Save", variant: "outlined", disabled: true },
  };

  it("creates the element, sets attributes and appends it", () => {
    const code = buildJsSnippet(input);
    expect(code).toContain('import "@strata/components";');
    expect(code).toContain(
      'const button = document.createElement("strata-button");',
    );
    expect(code).toContain('button.setAttribute("label", "Save");');
    expect(code).toContain('button.setAttribute("variant", "outlined");');
    expect(code).toContain('button.setAttribute("disabled", "");');
    expect(code).toContain("document.body.append(button);");
  });

  it("camelCases dashed tag names into a valid identifier", () => {
    const code = buildJsSnippet({
      ...input,
      tagName: "strata-text-field",
      controls: [],
      values: {},
    });
    expect(code).toContain(
      'const textField = document.createElement("strata-text-field");',
    );
  });

  it("escapes quotes, backslashes and template placeholders in strings", () => {
    const code = buildJsSnippet({
      tagName: "strata-button",
      controls: [control("label", "text")],
      values: { label: 'a"b\\c `${x}`' },
    });
    expect(code).toContain('button.setAttribute("label", "a\\"b\\\\c');
    expect(code).not.toContain('a"b');
  });

  it("renders slotted content as an escaped innerHTML template", () => {
    const code = buildJsSnippet({
      ...input,
      slotHtml:
        '<strata-button label="One"></strata-button>' +
        '<strata-button label="Two"></strata-button>',
    });
    expect(code).toContain("button.innerHTML = `");
    expect(code).toContain("<strata-button");
  });
});

describe("buildExamples", () => {
  it("returns HTML, JavaScript and Install tabs for every component", () => {
    const examples = buildExamples({
      tagName: "strata-button",
      controls: [control("label", "text")],
      values: { label: "Save" },
    });
    expect(examples.map((e) => e.id)).toEqual(["html", "js", "install"]);
    expect(examples.map((e) => e.lang)).toEqual(["html", "javascript", "bash"]);
    expect(examples[0].code).toContain("<strata-button");
    expect(examples[1].code).toContain("document.createElement");
    expect(examples[2].code).toBe(INSTALL_SNIPPET);
  });
});

describe("highlightSnippet", () => {
  it("returns per-line tokens whose contents reproduce the source", async () => {
    const code =
      'import "@strata/components";\n\n<strata-button label="Save"></strata-button>';
    const result = await highlightSnippet(code, "html", "light");
    const text = result.lines
      .map((line) => line.map((t) => t.content).join(""))
      .join("\n");
    expect(text).toBe(code);
    expect(result.fg).toMatch(/^#/);
    expect(result.bg).toMatch(/^#/);
  });

  it("produces multiple distinct token colors (chromatic theme)", async () => {
    const code = '<strata-button label="Save" disabled></strata-button>';
    const result = await highlightSnippet(code, "html", "light");
    const colors = new Set(
      result.lines
        .flat()
        .map((t) => t.color)
        .filter(Boolean),
    );
    expect(colors.size).toBeGreaterThanOrEqual(3);
  });

  it("switches colors between light and dark themes", async () => {
    const code = '<strata-button label="Save"></strata-button>';
    const light = await highlightSnippet(code, "html", "light");
    const dark = await highlightSnippet(code, "html", "dark");
    const lightColors = new Set(light.lines.flat().map((t) => t.color));
    const darkColors = new Set(dark.lines.flat().map((t) => t.color));
    expect(darkColors).not.toEqual(lightColors);
  });
});

describe("copyText", () => {
  it("reports failure instead of claiming success", async () => {
    const original = navigator.clipboard;
    // @ts-expect-error simulate missing Clipboard API
    delete navigator.clipboard;
    // @ts-expect-error jsdom has no execCommand
    document.execCommand = undefined;
    await expect(copyText("x")).resolves.toBe(false);
    Object.defineProperty(navigator, "clipboard", {
      value: original,
      configurable: true,
    });
  });
});
