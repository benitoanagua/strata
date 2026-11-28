import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/elements/index.ts";

type AlertElement = HTMLElement & {
  open: boolean;
  mode: "inline" | "snackbar";
  closable: boolean;
  duration: number;
  updateComplete: Promise<unknown>;
};

async function mountAlert(): Promise<AlertElement> {
  const alert = document.createElement("strata-alert") as AlertElement;
  document.body.appendChild(alert);
  await alert.updateComplete;
  return alert;
}

afterEach(() => {
  vi.useRealTimers();
  document.body.querySelectorAll("strata-alert").forEach((element) => element.remove());
});

describe("strata-alert unified feedback API", () => {
  it("keeps inline alerts visible and non-closable by default", async () => {
    const alert = await mountAlert();
    expect(alert.mode).toBe("inline");
    expect(alert.open).toBe(true);
    expect(alert.closable).toBe(false);
    expect(alert.shadowRoot?.querySelector("button")).toBeNull();
  });

  it("supports optional manual dismissal and emits the shared event", async () => {
    const alert = await mountAlert();
    alert.closable = true;
    await alert.updateComplete;
    const dismiss = vi.fn();
    alert.addEventListener("strata-dismiss", dismiss);
    alert.shadowRoot?.querySelector("button")?.click();
    await alert.updateComplete;
    expect(alert.open).toBe(false);
    expect(dismiss).toHaveBeenCalledTimes(1);
    expect(dismiss.mock.calls[0][0].detail).toEqual({ reason: "manual" });
  });

  it("auto-dismisses snackbar mode and reports timeout reason", async () => {
    vi.useFakeTimers();
    const alert = await mountAlert();
    alert.mode = "snackbar";
    alert.duration = 500;
    await alert.updateComplete;
    const dismiss = vi.fn();
    alert.addEventListener("strata-dismiss", dismiss);
    await vi.advanceTimersByTimeAsync(500);
    await alert.updateComplete;
    expect(alert.open).toBe(false);
    expect(dismiss).toHaveBeenCalledTimes(1);
    expect(dismiss.mock.calls[0][0].detail).toEqual({ reason: "timeout" });
  });

  it("duration zero disables auto-dismiss", async () => {
    vi.useFakeTimers();
    const alert = await mountAlert();
    alert.mode = "snackbar";
    alert.duration = 0;
    await alert.updateComplete;
    await vi.advanceTimersByTimeAsync(5000);
    expect(alert.open).toBe(true);
  });
});
