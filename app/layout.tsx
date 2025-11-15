import type { Metadata, Viewport } from "next";
import { Mukta, Inter } from "next/font/google";
import "./globals.css";
import { RegisterSW } from "./register-sw";

const mukta = Mukta({
  weight: ["200", "300", "400", "600", "800"],
  subsets: ["latin", "devanagari"],
  variable: "--font-mukta",
  display: "swap",
});

const inter = Inter({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#f2eac5",
};

export const metadata: Metadata = {
  title: "KhetSe - ECOX Labs",
  description: "Agricultural waste supply chain platform connecting farmers with industries",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KhetSe",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/apple-icon-180.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${mukta.variable} ${inter.variable} font-mukta`}
        suppressHydrationWarning
      >
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
