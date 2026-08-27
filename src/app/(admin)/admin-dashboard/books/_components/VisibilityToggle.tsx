"use client";

// Native Icons & Components
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VisibilityToggleProps {
  bookId: string;
  isVisible: boolean;
  isLoading: boolean;
  onToggle: (id: string, currentVisibility: boolean) => void;
}

/**
 * Accessible toggle switch button for managing book visibility.
 * Displays visual badges and icon status for live feedback.
 *
 * @param {VisibilityToggleProps} props - Component properties
 * @returns {JSX.Element} Interactive visibility toggle component
 */
export function VisibilityToggle({
  bookId,
  isVisible,
  isLoading,
  onToggle,
}: VisibilityToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(bookId, isVisible)}
      disabled={isLoading}
      title={isVisible ? "Click to hide from users" : "Click to publish to users"}
      aria-label={isVisible ? "Book is visible" : "Book is hidden"}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all shadow-2xs border cursor-pointer select-none",
        isVisible
          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300"
          : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300",
        isLoading && "opacity-60 cursor-not-allowed",
      )}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isVisible ? (
        <Eye className="w-3.5 h-3.5 text-emerald-600" />
      ) : (
        <EyeOff className="w-3.5 h-3.5 text-amber-600" />
      )}
      <span>{isVisible ? "Visible" : "Hidden"}</span>
    </button>
  );
}
