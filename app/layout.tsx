import "./globals.css";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import React from "react";
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

export const metadata = {
  title: "Villa Anantara",
  description: "Luxury private villa in Raipur — Villa Anantara.",
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
