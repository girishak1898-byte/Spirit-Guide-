export interface NavItem {
  label: string;
  href: string;
}

/** Source: docs/SPIRIT-GUIDE-V4.md §3. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Temple", href: "#temple" },
  { label: "Meditate", href: "#meditate" },
  { label: "Wisdom", href: "#wisdom" },
  { label: "Rituals", href: "#sanctuary-highlights" },
  { label: "Journal", href: "#journal" },
  { label: "My Sanctuary", href: "#sanctuary" },
];

export const PRIMARY_CTA: NavItem = { label: "Enter Temple", href: "#temple-gateway" };
