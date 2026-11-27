import { describe, expect, it } from "vitest";
import { STRATA_COMPONENT_CATALOG } from "@strata/components";

describe("STRATA component catalog", () => {
  it("contains the canonical 77 components", () => {
    expect(STRATA_COMPONENT_CATALOG).toHaveLength(77);
    expect(new Set(STRATA_COMPONENT_CATALOG).size).toBe(77);
  });
});
