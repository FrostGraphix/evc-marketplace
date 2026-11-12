import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import { ModalProvider } from '@/context/ModalContext';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { WhatsAppWidget } from '@/components/shop/WhatsAppWidget';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#eae8e1' },
    { media: '(prefers-color-scheme: dark)', color: '#03090a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://evcng.com'),
  title: 'EVC Nig. Ltd — Real Estate & Land Marketplace | Buy Verified Land & Estates',
  description:
    'EVC Nig. Ltd (evcng.com) is your premier marketplace for verified land, master-planned residential estates, highway corridors, student housing, and commercial agro-cities. Guaranteed C of O titles, 100% dry land, and weekly free site inspections in Kwara, Oyo, Lagos, and Ogun States.',
  keywords: [
    'EVC Nig. Ltd',
    'evcng.com',
    'Buy Land Nigeria',
    'Broadway Residentials Malete',
    'Eden Crest Ikorodu',
    'Afonja Boulevard Ilorin',
    'Idera Farm City Iseyin',
    'The Providence Alabata',
    'The Providence Moniya',
    'The Providence Omu Epe',
    'Kwara State Land for Sale',
    'Ibadan Estates C of O',
    'Lagos Epe Land Investment',
    'Real Estate Marketplace Nigeria',
  ],
  openGraph: {
    title: 'EVC Nig. Ltd — Real Estate & Land Marketplace | Buy Verified Land & Estates',
    description:
      'Buy verified land, residential estates, highway corridors, student housing, and agro-cities with guaranteed C of O titles. Weekly free physical inspections across Nigeria.',
    url: 'https://evcng.com',
    siteName: 'EVC Nig. Ltd',
    type: 'website',
  },
  icons: {
    icon: '/images/evc-icon.png',
    apple: '/images/pwa-192x192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Figtree:ital,wght@0,300..900;1,300..900&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)] transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <ModalProvider>
                  <AnnouncementBar />
                  <HeaderWrapper />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <CartDrawer />
                  <WhatsAppWidget />
                </ModalProvider>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
