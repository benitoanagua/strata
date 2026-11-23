import { describe, expect, it } from "vitest";
import { buildSnippet } from "../src/lib/snippet";
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

describe("highlightSnippet", () => {
  it("wraps tokens in inert spans and escapes the source", () => {
    const html = highlightSnippet(
      '<strata-button label="Save"></strata-button>',
    );
    expect(html).toContain('class="token tag"');
    expect(html).toContain('class="token attr-name"');
    expect(html).toContain("&lt;");
    // The raw tag must not appear unescaped — nothing executable renders.
    expect(html).not.toContain("<strata-button");
  });

  it("does not alter the source it highlights", () => {
    const code = buildSnippet({
      tagName: "strata-button",
      controls: [control("label", "text")],
      values: { label: "Save" },
    });
    const html = highlightSnippet(code);
    // Strip spans/entities back to text and compare with the source.
    const text = html
      .replace(/<[^>]+>/g, "")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");
    expect(text).toBe(code);
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
