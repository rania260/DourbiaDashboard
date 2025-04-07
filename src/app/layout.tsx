import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ABeeZee } from "next/font/google";
import { Actor } from "next/font/google";
import { Montserrat } from "next/font/google";
import Providers from "@/components/Providers";
import { AuthProvider } from './context/auth-context'

import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const abeezee = ABeeZee({
  subsets: ['latin'],
  variable: '--font-abeezee',
  weight: '400',
  style: 'normal',
});

const actor = Actor({
  subsets: ['latin'],
  variable: '--font-actor',
  weight: '400',
  style: 'normal',
});

// Montserrat Regular
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: "400",
  style: "normal",
});

// Montserrat Light
const montserratLight = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat-light",
  weight: "300",
  style: "normal",
});

const montserratSemiBold = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat-semibold",
  weight: "600",
  style: "normal",
});

export const metadata: Metadata = {
  title: "Dourbia Admin Dashboard",
  description: "Next.js Admin Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${abeezee.variable} ${actor.variable} ${montserrat.variable} ${montserratLight.variable} ${montserratSemiBold.variable}`}>
      <body className={inter.className}>
      <AuthProvider>
        <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
