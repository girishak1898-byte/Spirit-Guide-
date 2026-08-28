"use client";

import { Button } from "@/components/ui/Button";

/** Preview-only: scrolls to the existing Temple stub section. Does not open Temple Mode (Phase 4). */
export function TemplePreviewCta() {
  return (
    <Button
      variant="primary"
      onClick={() => document.getElementById("temple")?.scrollIntoView({ behavior: "smooth" })}
    >
      Enter Temple Mode
    </Button>
  );
}
