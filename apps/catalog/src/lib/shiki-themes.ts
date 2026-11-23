import tokens from "@strata/tokens/tokens.json";
import type { ThemeRegistration } from "shiki/types";

type DocsTheme = "light" | "dark";

/**
 * Maps palette roles to TextMate scopes. Order matters: the first rule
 * whose scope best matches a token wins, so specific scopes come first.
 */
const SCOPE_RULES: ReadonlyArray<{
  role: keyof (typeof tokens.syntaxDocs)[DocsTheme];
  scope: string[];
}> = [
  {
    role: "comment",
    scope: ["comment", "punctuation.definition.comment", "string.comment"],
  },
  {
    role: "string",
    scope: [
      "string",
      "punctuation.definition.string",
      "string.template",
      "string.regexp",
    ],
  },
  {
    role: "number",
    scope: [
      "constant.numeric",
      "constant.language",
      "constant.character",
      "constant.other",
      "constant",
    ],
  },
  {
    role: "keyword",
    scope: [
      "keyword",
      "storage",
      "storage.type",
      "storage.modifier",
      "keyword.control",
      "keyword.operator",
      "keyword.import",
      "keyword.export",
      "keyword.declaration",
      "support.type.primitive",
    ],
  },
  {
    role: "function",
    scope: [
      "entity.name.function",
      "support.function",
      "variable.function",
      "meta.function entity.name.function",
      "entity.name.method",
    ],
  },
  {
    role: "tag",
    scope: [
      "entity.name.tag",
      "entity.name.tag.html",
      "entity.name.tag.xml",
      "entity.name.tag.custom",
    ],
  },
  {
    role: "attrName",
    scope: [
      "entity.other.attribute-name",
      "meta.attribute",
      "support.type.property-name",
      "meta.object-literal.key",
      "variable.other.object.key",
    ],
  },
];

/**
 * Builds the two catalog documentation themes from `tokens.syntaxDocs`.
 * The palette is tokenized (single source of truth, contrast-checked by
 * tooling/token-validator) — component UI keeps the ink-ramp `syntax`
 * tokens; only docs code blocks use this chromatic palette.
 */
export function strataDocThemes(): ThemeRegistration[] {
  return (["light", "dark"] as const).map((name) => {
    const palette = tokens.syntaxDocs[name];
    const semantic = tokens.semantic[name];
    return {
      name: `strata-docs-${name}`,
      type: name === "dark" ? "dark" : "light",
      colors: {
        "editor.foreground": semantic.textPrimary,
        "editor.background": semantic.surfaceSubtle,
      },
      tokenColors: [
        ...SCOPE_RULES.map(({ role, scope }) => ({
          scope,
          settings: {
            foreground: palette[role],
            ...(role === "comment" ? { fontStyle: "italic" } : {}),
          },
        })),
      ],
    } satisfies ThemeRegistration;
  });
}
