import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import html from "shiki/langs/html.mjs";
import javascript from "shiki/langs/javascript.mjs";
import bash from "shiki/langs/bash.mjs";
import { strataDocThemes } from "./shiki-themes";
import type { HighlighterCore, ThemedToken } from "shiki/types";

export type SnippetLang = "html" | "javascript" | "bash";
export type SnippetTheme = "light" | "dark";

export interface HighlightedCode {
  fg: string;
  bg: string;
  lines: ThemedToken[][];
}

let highlighterPromise: Promise<HighlighterCore> | null = null;

/**
 * One shared highlighter for the whole catalog: the JavaScript regex
 * engine (no WASM), only the three grammars the snippets use, and both
 * documentation themes registered up front so theme switches are a
 * synchronous re-tokenize.
 */
export function getHighlighter(): Promise<HighlighterCore> {
  highlighterPromise ??= createHighlighterCore({
    themes: strataDocThemes(),
    langs: [html, javascript, bash],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighterPromise;
}

export async function highlightSnippet(
  code: string,
  lang: SnippetLang,
  theme: SnippetTheme,
): Promise<HighlightedCode> {
  const highlighter = await getHighlighter();
  const result = highlighter.codeToTokens(code, {
    lang,
    theme: `strata-docs-${theme}`,
  });
  return {
    fg: result.fg ?? "#000000",
    bg: result.bg ?? "#ffffff",
    lines: result.tokens,
  };
}
