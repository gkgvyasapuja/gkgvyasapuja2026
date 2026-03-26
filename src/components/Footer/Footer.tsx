"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin-dashboard")) {
    return null;
  }

  return (
    <footer className="w-full bg-[#0a2540] text-gray-200 py-6 font-sans">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-center items-center text-sm">
        <p className="text-center md:text-left">
          &copy; {new Date().getFullYear()} GkgVyasaPuja All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
