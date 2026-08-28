"use client";

import { Button } from "@/components/ui/Button";
import { useTempleMode } from "@/components/temple/TempleModeProvider";

/** Preview CTA: opens the real Temple Mode overlay (Phase 4) at its default state. */
export function TemplePreviewCta() {
  const { openTemple } = useTempleMode();
  return (
    <Button variant="primary" onClick={() => openTemple()}>
      Enter Temple Mode
    </Button>
  );
}
