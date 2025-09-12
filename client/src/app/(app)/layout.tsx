"use client";

import { SessionProvider } from "next-auth/react";
import Navigation from "@/components/nav/Navigation";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <Navigation>{children}</Navigation>
    </SessionProvider>
  );
}


