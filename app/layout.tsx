import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="grow">{children}</main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            className:
              "bg-[#0a2540] text-white border-white/20 shadow-2xl font-sans",
          }}
        />
      </body>
    </html>
  );
}
