import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "YouTube QR Code Generator \u2014 Free Branded QR Codes",
  description: "Create branded QR codes for your YouTube videos, channels, and Shorts \u2014 add logos and colors, export in HD. Free YouTube QR code generator, no signup required.",
  path: "/tools/qr-code-generator",
  keywords: ["youtube short", "youtube videos", "youtube channel", "qr code youtube", "youtube qr"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
