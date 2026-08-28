"use client";

import { Button } from "@/components/ui/Button";
import { useTempleMode } from "@/components/temple/TempleModeProvider";

/** Reuses the existing canonical Temple Mode API — never a second overlay implementation. */
export function ClosingCta() {
  const { openTemple } = useTempleMode();
  return (
    <Button variant="primary" onClick={() => openTemple()}>
      Enter Temple
    </Button>
  );
}
