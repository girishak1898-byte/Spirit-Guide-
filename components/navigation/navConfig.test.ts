import { describe, expect, it } from "vitest";
import { NAV_ITEMS, PRIMARY_CTA } from "./navConfig";

describe("navConfig", () => {
  it("matches the nav items specified in docs/SPIRIT-GUIDE-V4.md §3", () => {
    expect(NAV_ITEMS.map((item) => item.label)).toEqual([
      "Temple",
      "Meditate",
      "Wisdom",
      "Rituals",
      "Journal",
      "My Sanctuary",
    ]);
  });

  it("uses Enter Temple as the primary CTA", () => {
    expect(PRIMARY_CTA.label).toBe("Enter Temple");
  });
});
