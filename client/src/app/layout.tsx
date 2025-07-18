import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Spndo",
  description: "Personal finance & budgeting app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} 
                   antialiased 
                   bg-neutral-white text-neutral-dark1 relative min-h-screen
                   dark:bg-[#242d2d] dark:text-neutral-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* spotlight layers */}
          <div
            className="fixed -z-10 inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 30% 40%, rgba(140,152,110,0.3) 0%, transparent 50%)",
            }}
          />
          <div
            className="fixed -z-10 top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: "rgba(140,152,110,0.4)" }}
          />
          <div
            className="fixed -z-10 bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
            style={{ backgroundColor: "rgba(140,152,110,0.3)" }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
