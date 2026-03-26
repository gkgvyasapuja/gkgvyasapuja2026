"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Globe,
  Map,
  MapPin,
  Building2,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
  { name: "Countries", href: "/admin-dashboard/countries", icon: Globe },
  { name: "States", href: "/admin-dashboard/states", icon: Map },
  { name: "Cities", href: "/admin-dashboard/cities", icon: MapPin },
  { name: "Temples", href: "/admin-dashboard/temples", icon: Building2 },
  { name: "Books", href: "/admin-dashboard/books", icon: BookOpen },
  { name: "Offerings", href: "/admin-dashboard/offerings", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-sm border-r min-h-[calc(100vh-4rem)] p-4 flex flex-col gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
              isActive
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}
