import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import ScrollToTop from "@components/ScrollToTop/ScrollToTop";
import { Toaster } from "sonner";

/* const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
}); */

export const metadata: Metadata = {
  title: "GKG Vyasa Puja",
  description: "Upload your offerings for the Guru Maharaj Vyasa Puja",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="grow">{children}</main>
        <Toaster />
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
