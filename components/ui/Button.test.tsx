import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders its label and calls onClick when pressed", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Enter Temple</Button>);

    const button = screen.getByRole("button", { name: "Enter Temple" });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies the scarce gold treatment only to the primary variant", () => {
    render(<Button variant="secondary">Begin Meditation</Button>);
    const button = screen.getByRole("button", { name: "Begin Meditation" });
    expect(button.className).not.toContain("bg-gold-primary");
  });

  it("meets the 44px minimum touch target height", () => {
    render(<Button>Enter Temple</Button>);
    const button = screen.getByRole("button", { name: "Enter Temple" });
    expect(button.className).toContain("min-h-[44px]");
  });
});
