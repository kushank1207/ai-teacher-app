// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClientProvider } from '@/components/providers/ClientProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Python OOP Teacher',
  description: 'Learn Python OOP concepts interactively',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}