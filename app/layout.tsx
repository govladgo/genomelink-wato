import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WATO — What Are The Odds?',
  description: 'Test relationship hypotheses against shared cM with endogamy adjustment',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
