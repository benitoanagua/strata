export interface ListItem {
  label: string;
  href?: string;
}

/** Allow http(s), mailto, fragments and relative URLs; drop everything else. */
export function safeHref(value: unknown): string {
  if (typeof value !== "string") return "";
  const href = value.trim();
  if (!href) return "";
  if (/^(?:https?:|mailto:|tel:|#|\/|\.\/|\.\.\/)/i.test(href)) return href;
  return /^[a-z][a-z0-9+.-]*:/i.test(href) ? "" : href;
}

function normalize(entry: unknown): ListItem | null {
  if (typeof entry === "string") return entry ? { label: entry } : null;
  if (entry && typeof entry === "object") {
    const e = entry as Record<string, unknown>;
    const label = String(e.label ?? e.title ?? "");
    if (!label) return null;
    const href = safeHref(e.href ?? e.url);
    return href ? { label, href } : { label };
  }
  return null;
}

/**
 * Accepts a JS array, a JSON array string (`[{"label","href"}]`) or the
 * pipe-delimited form used elsewhere in STRATA (`one|two|three`).
 */
export function parseItems(value: unknown): ListItem[] {
  if (Array.isArray(value))
    return value.map(normalize).filter((x): x is ListItem => x !== null);
  if (typeof value !== "string") return [];
  const raw = value.trim();
  if (!raw) return [];
  if (raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parseItems(parsed);
    } catch {
      /* fall through to pipe form */
    }
  }
  return raw
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((label) => ({ label }));
}
