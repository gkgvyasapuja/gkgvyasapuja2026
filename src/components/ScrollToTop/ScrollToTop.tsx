"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

export default function ScrollToTop() {
  const pathname = usePathname();
  const hideOnAdmin = pathname.startsWith("/admin-dashboard");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hideOnAdmin) return;

    const onScroll = () => {
      setVisible(window.scrollY > 100);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideOnAdmin]);

  if (hideOnAdmin) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
      className={cn(
        "fixed bottom-6 right-4 z-50 flex size-12 items-center justify-center rounded-full bg-[#ff6b4a] text-white shadow-lg transition-opacity duration-200 hover:bg-[#ff8469] md:size-14 lg:right-8",
        visible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      )}
      aria-label="Scroll to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <ChevronUp className="h-6 w-6" aria-hidden />
    </button>
  );
}
