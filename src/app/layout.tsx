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
    default: 'Pass ON — Verified College Marketplace & Student Store',
    template: '%s | Pass ON',
  },
  description:
    'Pass ON connects verified college seniors and juniors to buy, sell, borrow, donate and exchange textbooks, calculators, lab coats and essentials across Delhi engineering colleges — plus the official Pass ON store for student favourites.',
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
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-[#f7f7f8] text-ink-950 selection:bg-brand-600 selection:text-white">
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
