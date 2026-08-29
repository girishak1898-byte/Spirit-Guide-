import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(path.join(__dirname, "page.tsx"), "utf-8");

describe("HomePage assembly", () => {
  it("never renders development-placeholder copy or stub chapters", () => {
    expect(source).not.toMatch(/STUB_CHAPTERS/);
    expect(source).not.toMatch(/has not been built/i);
    expect(source).not.toMatch(/coming soon/i);
    expect(source).not.toMatch(/IMPLEMENTATION-PLAN\.md/);
  });
});
