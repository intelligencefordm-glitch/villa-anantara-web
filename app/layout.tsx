// app/layout.tsx
import './globals.css';
import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';
import React from 'react';

const futura = localFont({
  // path is relative to this file
  src: [
    {
      path: '../public/fonts/FuturaPT-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/FuturaPT-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    // add additional weights if you have them
  ],
  variable: '--font-futura',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata = {
  title: 'Villa Anantara',
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
