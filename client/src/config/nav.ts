import { Home, CreditCard, DollarSign, Settings, Bell } from "lucide-react";

export const appNav = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "Transactions", href: "/transactions", icon: DollarSign },
  { label: "Reminder", href: "/reminder", icon: CreditCard },
  { label: "Budget", href: "/budget", icon: DollarSign },
  { label: "Savings", href: "/savings", icon: DollarSign },
  { label: "Preferences", href: "/preferences", icon: Settings },
] as const;

export const bottomNav = [
  { label: "Overview", href: "/dashboard", icon: Home },

  { label: "Preferences", href: "/preferences", icon: Settings },

  { label: "Reminder", href: "/reminder", icon: CreditCard },
  { label: "Notifications", href: "/notifications", icon: Bell },
];

export function titleForPathname(pathname: string): string {
  if (pathname === "/") return "Overview";
  const exact = appNav.find((n) => n.href === pathname);
  if (exact) return exact.label;
  const pref = appNav.find((n) => pathname.startsWith(n.href + "/"));
  return pref?.label ?? "Overview";
}
