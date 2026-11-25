import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { Toast } from '@/components/ui/Toast';
import { VerificationStatusBanner } from '@/components/verification/VerificationStatusBanner';

export const metadata: Metadata = {
  title: {
    default: 'PassOn — Verified College Marketplace & Student Store',
    template: '%s | PassOn',
  },
  description:
    'PassOn connects verified college seniors and juniors to buy, sell, borrow, donate and exchange textbooks, calculators, lab coats and essentials across Delhi engineering colleges.',
  icons: {
    icon: '/logo-icon.png',
    apple: '/logo-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-surface-bg dark:bg-[#020617] text-text-main dark:text-slate-100 antialiased selection:bg-mint selection:text-white transition-colors duration-300">
        <AppProvider>
          <CartProvider>
            <Navbar />
            <div className="container-x">
              <VerificationStatusBanner />
            </div>
            <main className="flex-grow">{children}</main>
            <Footer />
            <CartDrawer />
            <Toast />
          </CartProvider>
        </AppProvider>
      </body>
    </html>
  );
}
