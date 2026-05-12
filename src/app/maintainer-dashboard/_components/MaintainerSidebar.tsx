"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
} from "lucide-react";

const navItems = [
  { name: "Offerings", href: "/maintainer-dashboard/offerings", icon: BookOpen },
  {
    name: "Temple Requests",
    href: "/maintainer-dashboard/temple-requests",
    icon: ClipboardCheck,
  },
];

export function MaintainerSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "bg-white shadow-sm border-r min-h-[calc(100vh-4rem)] flex flex-col gap-2 shrink-0 transition-[width] duration-200 ease-out",
        collapsed ? "w-13 p-2" : "w-64 p-4",
      )}
    >
      <div className={cn("flex", collapsed ? "justify-center" : "justify-end")}>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden />
          ) : (
            <ChevronLeft className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={cn(
                "flex items-center rounded-md transition-colors text-sm font-medium",
                collapsed
                  ? "justify-center px-2 py-2.5"
                  : "gap-3 px-3 py-2",
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
