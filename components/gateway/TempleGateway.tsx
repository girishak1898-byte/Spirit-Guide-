import { ReducedMotion } from "@/components/motion/ReducedMotion";
import { getHeroMediaStatus } from "@/lib/content/heroMedia";
import { TempleGatewayScene } from "./TempleGatewayScene";
import { TempleGatewayStatic } from "./TempleGatewayStatic";

/**
 * Server entry point for the Temple Gateway (Phase 2). Resolves hero-asset
 * availability once, server-side (see lib/content/heroMedia.ts), then hands
 * off to the client-rendered cinematic scene or its reduced-motion static
 * counterpart. No component here needs to change when the real hero binary
 * lands in the repo — `getHeroMediaStatus()` picks it up automatically on
 * the next build/server restart.
 */
export function TempleGateway() {
  const media = getHeroMediaStatus();

  return (
    <ReducedMotion fallback={<TempleGatewayStatic media={media} />}>
      <TempleGatewayScene media={media} />
    </ReducedMotion>
  );
}
