import "./globals.css";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import React from "react";
import type { Metadata } from "next";
import CookieConsent from "./components/CookieConsent";

// FUTURA
const futura = localFont({
  src: [
    { path: "./fonts/FuturaPT-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/FuturaPT-Medium.otf", weight: "500", style: "normal" },
  ],
  variable: "--font-futura",
  display: "swap",
});

// POPPINS
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// ABIGAIL (Header font)
const abigail = localFont({
  src: "./fonts/ss-abigail.otf",
  variable: "--font-abigail",
  display: "swap",
});

// WEBSITE METADATA
export const metadata: Metadata = {
  metadataBase: new URL("https://villaanant.in"),
  title: {
    default: "Villa Anant | Luxury Private Villa in Raipur",
    template: "%s | Villa Anant",
  },
  description:
    "Discover Villa Anant, a private luxury villa in Raipur, perfect for relaxing stays, celebrations, and special occasions.",
  applicationName: "Villa Anant",
  openGraph: {
    title: "Villa Anant | Luxury Private Villa in Raipur",
    description:
      "Experience privacy, comfort, and a peaceful farmhouse retreat at Villa Anant in Raipur.",
    url: "https://villaanant.in",
    siteName: "Villa Anant",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${futura.variable} ${poppins.variable} ${abigail.variable} font-sans`}
        style={{ backgroundColor: "#EFE5D5" }}
      >
        {/* GLOBAL COOKIE POPUP */}
        <CookieConsent />

        {/* PAGE CONTENT */}
        {children}
      </body>
    </html>
  );
}
