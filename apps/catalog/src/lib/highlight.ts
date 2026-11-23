import Prism from "prismjs";
import "prismjs/components/prism-markup";

export type SnippetLanguage = "markup";

/**
 * Returns HTML with Prism token spans. Prism escapes the source before
 * tokenizing, so the output is inert markup — it cannot execute the
 * snippet it renders. The clipboard always receives the raw source from
 * `buildSnippet`, never this HTML.
 */
export function highlightSnippet(code: string): string {
  return Prism.highlight(code, Prism.languages.markup, "markup");
}
