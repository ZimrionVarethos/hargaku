import type { Metadata } from 'next';
import './globals.css';
import { ubuntu } from '@/app/fonts';
import { PublicLayoutWrapper } from '@/components/layout/PublicLayoutWrapper';

export const metadata: Metadata = {
  title: 'PasarKu Bogor: Harga Pasar, Lebih Dekat',
  description:
    'Platform digital untuk menjelajahi, membandingkan, dan memantau harga komoditas pasar secara real-time berdasarkan publikasi resmi Perumda Pasar Pakuan Jaya Kota Bogor.',
  icons: {
    icon: '/images/pasarku/logo-nav.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-theme="light" className={`${ubuntu.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col font-sans bg-[var(--bg-paper)] text-[var(--text-primary)] antialiased transition-colors duration-200">
        <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
      </body>
    </html>
  );
}
