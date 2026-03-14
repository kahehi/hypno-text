import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/theme-context';
import CookieBanner from '@/components/CookieBanner';

export const metadata: Metadata = {
  title: 'Hypno Text – Hypnotherapeutischer Schreib- und Reflexionsassistent',
  description: 'Professioneller Schreib- und Reflexionsassistent für hypnotherapeutische Arbeit.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider>
          {children}
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
