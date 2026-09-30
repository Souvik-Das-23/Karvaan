import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Karvaan | Tinder for Group Travel Budgeting',
  description:
    'Match with vetted travelers based on budget compatibility, travel style, and peer-reviewed Vibe Scores. Form your dream travel squad on Karvaan.',
  keywords: [
    'karvaan',
    'group travel',
    'travel matchmaking',
    'budget travel',
    'travel squad',
    'vibe score',
    'wanderlust',
    'travel buddy',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${outfit.variable} dark`}>
      <body className="min-h-screen bg-cinema-950 text-cinema-100 antialiased cinematic-bg selection:bg-terracotta-500/30 selection:text-white pb-20 md:pb-0">
        <AppProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
