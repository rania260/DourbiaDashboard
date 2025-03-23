// src/lib/fonts.ts
import { ABeeZee, Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const abeezee = ABeeZee({
  subsets: ['latin'],
  variable: '--font-abeezee',
  weight: '400', 
});