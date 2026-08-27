import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

/**
 * Primary = the scarce champagne-gold treatment (docs/DESIGN-SYSTEM.md §1)
 * — reserve for the one dominant action in a scene (Enter Temple, Begin
 * Meditation, Place Intention). Secondary = ivory outline, for every other
 * action. Never introduce a third "bright" variant.
 */
export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-button px-6 text-ui-label font-medium tracking-wide transition-colors duration-ui ease-premium",
        variant === "primary" &&
          "border border-gold-primary bg-gold-primary text-bg-primary-1 hover:bg-gold-secondary hover:border-gold-secondary",
        variant === "secondary" &&
          "border border-border-subtle bg-transparent text-ink-primary hover:border-ink-primary",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
