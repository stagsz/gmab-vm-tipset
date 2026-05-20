import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LocaleProvider } from '@/context/LocaleContext';
import { PlayerProvider } from '@/context/PlayerContext';
import Navbar from '@/components/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GMAB VM-tipset 2026',
  description: 'FIFA World Cup 2026 prediction competition for GMAB',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sv"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-950 text-white">
        <LocaleProvider>
          <PlayerProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
              GMAB VM-tipset 2026 &mdash; FIFA World Cup
            </footer>
          </PlayerProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
