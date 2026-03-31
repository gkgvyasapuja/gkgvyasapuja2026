"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Facebook, Twitter, Instagram, Youtube, Menu, X } from "lucide-react";

const SocialMediaLinks = [
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://www.facebook.com/GopalKrishnaGoswami1/",
  },
  {
    name: "Twitter",
    icon: Twitter,
    url: "https://twitter.com/GKGMedia",
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/gopal_krishna_goswami/",
  },
  {
    name: "Youtube",
    icon: Youtube,
    url: "https://www.youtube.com/c/GopalKrishnaGoswamiOfficial",
  },
];

const NavLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact Us", href: "/contact-us" },
  { name: "Donate", href: "/donate" },
  { name: "E-Books", href: "/ebooks" },
  { name: "Upload Offering", href: "/upload-offering" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Add scroll event listener to track when the page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (
    pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/maintainer-dashboard")
  ) {
    return null;
  }

  return (
    <>
      {/* Top Bar (Scrolls away) */}
      <div className="w-full bg-[#0a2540] flex justify-end font-sans">
        <div className="flex border-l border-white/20">
          {SocialMediaLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 lg:p-4 border-r border-white/20 hover:bg-white/10 transition-colors flex items-center justify-center text-white"
                aria-label={link.name}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar (Sticky) */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 shadow-md border-t border-white/20 ${
          isScrolled
            ? "bg-[#0a2540]/95 backdrop-blur-md py-2"
            : "bg-[#0a2540] py-4"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center group"
          >
            <Image
              src="/asset/gkg_whiteLogo.png"
              alt="ISKCON Logo"
              width={160}
              height={80}
              className={`w-auto object-contain hover:opacity-80 transition-all duration-300 ${
                isScrolled ? "h-12" : "h-16"
              }`}
              priority
            />
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-8">
            {NavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`${pathname === link.href ? "text-orange-400" : "text-gray-200"} hover:text-orange-400 transition-colors`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-md transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#0a2540] border-t border-white/10">
            <nav className="flex flex-col px-4 pt-2 pb-6 gap-2">
              {NavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-4 py-3 text-base font-medium text-gray-200 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
