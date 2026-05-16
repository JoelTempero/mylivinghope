import type { Metadata } from 'next';
import { Libre_Baskerville, Montserrat } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/components/cart/CartProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-libre',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mylivinghope.co.nz'),
  title: {
    default: 'My Living Hope | Prayer Prompts for Deeper Faith',
    template: '%s | My Living Hope',
  },
  description: 'Discover meaningful prayer through Scripture-based prompts. Prayer Portals help you go deeper with Jesus through guided, biblical prayer.',
  keywords: ['prayer', 'faith', 'Scripture', 'Christian', 'prayer prompts', 'devotional', 'Bible study'],
  authors: [{ name: 'My Living Hope' }],
  creator: 'My Living Hope',
  openGraph: {
    type: 'website',
    locale: 'en_NZ',
    url: '/',
    siteName: 'My Living Hope',
    title: 'My Living Hope | Prayer Prompts for Deeper Faith',
    description: 'Discover meaningful prayer through Scripture-based prompts.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'My Living Hope',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Living Hope | Prayer Prompts for Deeper Faith',
    description: 'Discover meaningful prayer through Scripture-based prompts.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${libreBaskerville.variable} ${montserrat.variable}`}>
      <body>
        <CartProvider>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <Header />
          <main id="main-content">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
