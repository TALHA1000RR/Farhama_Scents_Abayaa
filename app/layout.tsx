import type { Metadata } from 'next';
import './globals.css';
// import { ReduxProvider } from '../lib/ReduxProvider';
import Navbar from '../components/Navbar';
import ReduxProvider from '../lib/ReduxProvider';
import Toaster from '../utils/Toaster';
// import Navbar from '../components/navBar';


export const metadata: Metadata = {
  title: { default: 'Farhama Scents & Abayaa', template: '%s | Farhama' },
  description: 'Luxury perfumes, abayas, and modest fashion. Handcrafted with care, delivered with love.',
  keywords: ['farhama', 'perfumes', 'abayas', 'modest fashion', 'luxury scents', 'muslim fashion'],
  openGraph: {
    title: 'Farhama Scents & Abayaa',
    description: 'Luxury perfumes, abayas, and modest fashion.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <Toaster />
          <Navbar />
          <main>{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
}
