/** Minimal className joiner — avoids pulling in clsx for one small utility. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
