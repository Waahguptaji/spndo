"use client";

import Navigation from "@/components/nav/Navigation";
import AuthGuard from "@/components/Authguard";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGuard>
      <Navigation>{children}</Navigation>
    </AuthGuard>
  );
}
