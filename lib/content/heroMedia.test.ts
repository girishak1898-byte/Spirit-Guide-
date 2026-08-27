import { afterEach, describe, expect, it, vi } from "vitest";

function mockExistsSync(result: boolean) {
  vi.doMock("node:fs", () => ({ existsSync: () => result, default: { existsSync: () => result } }));
}

describe("getHeroMediaStatus", () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock("node:fs");
  });

  it("resolves the canonical Level-1 hero path, dimensions, and alt text regardless of availability", async () => {
    mockExistsSync(false);
    const { getHeroMediaStatus } = await import("./heroMedia");

    const media = getHeroMediaStatus();
    expect(media.src).toBe("/assets/hero/hero-sanctuary-level1-source.png");
    expect(media.width).toBe(1672);
    expect(media.height).toBe(941);
    expect(media.alt.length).toBeGreaterThan(0);
  });

  it("reports unavailable when the file does not exist on disk", async () => {
    mockExistsSync(false);
    const { getHeroMediaStatus } = await import("./heroMedia");

    expect(getHeroMediaStatus().available).toBe(false);
  });

  it("reports available the moment the file exists — no code change required", async () => {
    mockExistsSync(true);
    const { getHeroMediaStatus } = await import("./heroMedia");

    expect(getHeroMediaStatus().available).toBe(true);
  });
});
