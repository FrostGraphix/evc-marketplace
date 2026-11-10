import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Figtree, Instrument_Serif } from 'next/font/google';
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

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#03090a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://evcng.com'),
  title: 'EVC Nigeria — Smart Living, Clean Energy & Architectural Finishes',
  description:
    'EVC Nigeria (evcng.com) is your premier marketplace for solar energy solutions, home automation, architectural finishes, and executive furniture. Offices in Ilorin, Ibadan, and Abuja. Fast nationwide delivery.',
  keywords: [
    'EVC Nigeria',
    'evcng.com',
    'Solar Inverter Nigeria',
    'Lithium Battery Nigeria',
    'Smart Locks Abuja',
    'Home Automation Lagos',
    'Architectural Finishes Ilorin',
    'Ergonomic Chairs Nigeria',
    'Clean Energy Marketplace',
  ],
  openGraph: {
    title: 'EVC Nigeria — Smart Living, Clean Energy & Architectural Finishes',
    description:
      'Engineered solar systems, biometric smart tech, architectural finishes, and modern interiors. Nationwide delivery across Nigeria.',
    url: 'https://evcng.com',
    siteName: 'EVC Nigeria',
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
    <html
      lang="en"
      className={`${bricolage.variable} ${figtree.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-[#03090a] text-slate-100 transition-colors duration-300">
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
