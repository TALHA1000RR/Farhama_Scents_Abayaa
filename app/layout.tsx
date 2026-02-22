import type { Metadata } from 'next';
import './globals.css';
import { ReduxProvider } from '../lib/ReduxProvider';
import Navbar from '../components/Navbar';
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
          <Navbar />
          <main>{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
}

// import type { Metadata } from "next";
// import { Geist, } from "next/font/google";
// import "./globals.css";
// import Navbar from "../components/navBar";
// // import Navbar from "@/components/navBar";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });


// export const metadata: Metadata = {
//   title: "FARHAMA — Scents & Abayaa", 
//   description: " a luxury lifestyle brand offering premium fragrances and modest fashion for women, men, and children aged 5 and above, alongside high-quality accessories. The brand specializes in elegant abayas, refined men's wear, children's designs, and *premium base accessories* such as bags, jewelry cores, belts, and tech straps",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${geistSans.className} antialiased`}>
//         <Navbar />
//         {children}
//       </body>
//     </html>
//   );
// }
