import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { recordCompletedSession } from "@/lib/storage/localStorageService";
import { MySanctuarySection } from "./MySanctuarySection";

describe("MySanctuarySection — Practice object", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("shows the honest empty state with zero sessions", async () => {
    render(<MySanctuarySection />);
    expect(await screen.findByText("No practice recorded yet.")).toBeInTheDocument();
  });

  it("reflects real completed history, not fabricated stats", async () => {
    recordCompletedSession(7);
    recordCompletedSession(12);
    render(<MySanctuarySection />);

    const body = await screen.findByText(/sessions completed/);
    expect(body.textContent).toContain("2 sessions completed");
    expect(body.textContent).toContain("12 min");
    expect(body.textContent).not.toMatch(/streak|goal|%/i);
  });
});
