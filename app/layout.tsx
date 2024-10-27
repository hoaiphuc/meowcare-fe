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
config.autoAddCss = false;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // const pathname = usePathname();
  // const noNav = [
  //   "/login",
  //   "/register",
  //   "/dashboard",
  //   "/admin",
  //   "/forgetPassword",
  //   "/sendOTP"
  // ];

  // const shouldHideNavbar = noNav.some((path) => pathname.startsWith(path));

  return (
    <html lang="en">
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {/* {!shouldHideNavbar && <Navbar />} */}
          <NavbarVisibility />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
