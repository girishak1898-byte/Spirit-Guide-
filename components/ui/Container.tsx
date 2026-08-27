import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
}

/**
 * Shared horizontal rhythm for functional (non-cinematic) content. Cinematic
 * full-bleed scenes (hero, Temple Mode, etc.) intentionally do NOT use this
 * — they manage their own edge-to-edge layout per docs/DESIGN-SYSTEM.md §3.
 */
export function Container({ as: Tag = "div", className, children, ...props }: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full max-w-[1728px] px-5 md:px-8", className)} {...props}>
      {children}
    </Tag>
  );
}
