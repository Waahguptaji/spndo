import { Home, Calendar, CreditCard, DollarSign, Settings } from "lucide-react";

export const appNav = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Cards", href: "/cards", icon: CreditCard },
  { label: "Budget", href: "/budget", icon: DollarSign },
  { label: "Preferences", href: "/preferences", icon: Settings },
] as const;

export const bottomNav = [
   { label: "Overview", href: "/dashboard", icon: Home },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Reminder", href: "/reminder", icon: CreditCard },
  { label: "Notifications", href: "/notifications", icon: Bell }
];

export function titleForPathname(pathname: string): string {
  if (pathname === "/") return "Overview";
  const exact = appNav.find((n) => n.href === pathname);
  if (exact) return exact.label;
  const pref = appNav.find((n) => pathname.startsWith(n.href + "/"));
  return pref?.label ?? "Overview";
}
