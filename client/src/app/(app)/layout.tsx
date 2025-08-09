"use client";
import Navigation from "@/components/nav/Navigation";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Navigation>{children}</Navigation>;
}


