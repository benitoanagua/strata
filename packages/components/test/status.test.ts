import { describe, expect, it } from "vitest";
import "../src/elements/index.ts";

// Statuses must never rely on color alone (docs/DESIGN-LAWS.md §4): every
// status surface carries an icon, text or other non-chromatic cue.

async function mount<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Record<string, string> = {},
) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) el.setAttribute(key, value);
  document.body.appendChild(el);
  await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
  return el;
}

describe("status semantics never depend on color alone", () => {
  it.each(["error", "warning", "success"] as const)(
    "strata-alert tone=%s renders a distinct icon and status role",
    async (tone) => {
      const el = await mount("strata-alert", { tone });
      const icon = el.shadowRoot?.querySelector("iconify-icon");
      expect(icon?.getAttribute("icon")).toMatch(/^carbon:/);
      expect(el.shadowRoot?.querySelector("[role='status']")).toBeTruthy();
      el.remove();
    },
  );

  it.each(["error", "warning", "success"] as const)(
    "strata-badge tone=%s renders a distinct icon",
    async (tone) => {
      const el = await mount("strata-badge", { tone });
      el.textContent = "Draft";
      await (el as unknown as { updateComplete: Promise<unknown> })
        .updateComplete;
      const icon = el.shadowRoot?.querySelector("iconify-icon");
      expect(icon?.getAttribute("icon")).toMatch(/^carbon:/);
      el.remove();
    },
  );

  it("strata-text-field exposes error via aria-invalid, described text and icon", async () => {
    const el = await mount("strata-text-field", {
      error: "",
      errorMessage: "Required field",
    });
    const input = el.shadowRoot?.querySelector("input");
    expect(input?.getAttribute("aria-invalid")).toBe("true");
    const describedBy = input?.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const error = el.shadowRoot?.querySelector(`[id='${describedBy}']`);
    expect(error?.getAttribute("role")).toBe("alert");
    expect(error?.textContent).toContain("Required field");
    expect(error?.querySelector("iconify-icon")).toBeTruthy();
    el.remove();
  });
});
