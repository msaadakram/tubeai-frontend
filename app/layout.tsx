import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "sonner";
import RouteShell from "@/components/RouteShell";

export const metadata: Metadata = {
  title: "YTForge — AI-Powered YouTube Creator Toolkit",
  description:
    "This AI-powered YouTube creator toolkit enhances content creation with tools for monetization, SEO analysis, and automated features, designed for creators seeking growth.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <RouteShell>{children}</RouteShell>
          <Toaster position="bottom-right" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
