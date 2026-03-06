import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

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
  { name: "Upload Offering", href: "/upload" },
  { name: "About Guru Maharaja", href: "/about-us" },
  { name: "Donate", href: "/donate" },
  { name: "E-Books", href: "/e-books" },
  { name: "Contact Us", href: "/contact" },
];

export default function Header() {
  return (
    <div className="flex flex-col w-full font-sans">
      {/* Top Bar (Scrolls away) */}
      <div className="w-full bg-[#0a2540] flex justify-end">
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
      <header className="sticky top-0 z-50 w-full bg-[#0a2540] border-t border-white/20 shadow-md">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/asset/gkg_whiteLogo.png"
              alt="ISKCON Logo"
              width={160}
              height={80}
              className="h-16 w-auto object-contain hover:opacity-80 transition-opacity"
              priority
            />
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-8">
            {NavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-200 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button - Placeholder */}
          <button className="lg:hidden text-white p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>
    </div>
  );
}
