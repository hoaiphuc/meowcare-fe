'use client'

// import { usePathname } from "next/navigation";
import "./globals.css";
import 'yet-another-react-lightbox/styles.css';
import Footer from "./components/Footer";
import NavbarVisibility from './components/NavbarVisibility';
import { Providers } from "./providers";
//make icon size not display the default size
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

config.autoAddCss = false;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <ToastContainer />
        <Providers>
          <NavbarVisibility />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
