"use client";

import type { Ref } from "react";
import { GATEWAY_CONTENT } from "./gatewayContent";

interface GatewayRitualDockProps {
  dockRef: Ref<HTMLDivElement>;
}

/**
 * Phase 2 handoff only — five labels resolving in as the sequence ends,
 * establishing that Temple Mode exists just beyond this scene. Not
 * interactive yet (Temple Mode itself is Phase 4); each item is a
 * non-functional placeholder, not a Unicode/emoji icon, per
 * docs/03_VISUAL_BIBLE.md's forbidden-patterns list.
 */
export function GatewayRitualDock({ dockRef }: GatewayRitualDockProps) {
  return (
    <div ref={dockRef} className="pointer-events-none absolute inset-x-0 bottom-10 z-content flex justify-center">
      <div className="gateway-ritual-shell flex gap-2 rounded-card border border-border-subtle bg-[var(--glass-surface)] px-3 py-2 opacity-0 backdrop-blur-[var(--glass-blur)] sm:gap-4 sm:px-5">
        {GATEWAY_CONTENT.ritualLabels.map((label) => (
          <span
            key={label}
            className="gateway-ritual-item px-2 text-ui-label text-ink-secondary opacity-0"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
