import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lineage Wizard — Genomelink',
  description: 'Auto-complete lineage assignments across your DNA match network',
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
