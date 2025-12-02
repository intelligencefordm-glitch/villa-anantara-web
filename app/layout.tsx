// app/layout.tsx
import "./globals.css";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import React from "react";

const futura = localFont({
  src: [
    { path: "./fonts/FuturaPT-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/FuturaPT-Medium.otf",  weight: "500", style: "normal" },
  ],
  variable: "--font-futura",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "Villa Anantara – Private Luxury Farmstay near Raipur",
  description: "Villa Anantara — full-villa private farmhouse stay near Raipur. Book your private stay with pool, lawn and premium amenities.",
  openGraph: {
    title: "Villa Anantara – Private Luxury Farmstay",
    description: "Book Villa Anantara — luxury private farmhouse near Raipur.",
    url: "https://your-production-domain.vercel.app", // update to your real domain
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Villa Anantara – Private Luxury Farmstay",
    description: "Luxury private farmhouse near Raipur — book now.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${futura.variable} ${poppins.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
