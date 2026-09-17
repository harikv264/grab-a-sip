import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://grab-a-sip.vercel.app"
  ),
  title: "Grab A Sip — Fresh juices & fruit bowls, delivered daily",
  description:
    "Cold-pressed juices and loaded fruit bowls delivered fresh to your door, Monday to Saturday. Flexible monthly plans, zero added sugar. Grab A Sip.",
  keywords: [
    "cold pressed juice",
    "fruit bowl subscription",
    "healthy delivery",
    "ABC juice",
    "Grab A Sip",
  ],
  openGraph: {
    title: "Grab A Sip — Fresh juices & fruit bowls, delivered daily",
    description:
      "Cold-pressed juices and loaded fruit bowls delivered fresh, six days a week.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen overflow-x-hidden">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
