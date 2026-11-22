import { describe, expect, it } from "vitest";
import { STRATA_COMPONENT_CATALOG } from "@strata/components";

describe("STRATA component catalog", () => {
  it("contains the canonical 76 components", () => {
    expect(STRATA_COMPONENT_CATALOG).toHaveLength(76);
    expect(new Set(STRATA_COMPONENT_CATALOG).size).toBe(76);
  });
});
