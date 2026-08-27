"use client";

// Native Icons & Components
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookReorderControlsProps {
  bookId: string;
  isFirst: boolean;
  isLast: boolean;
  isLoading: boolean;
  onReorder: (bookId: string, direction: "up" | "down") => void;
}

/**
 * Reordering controls (Move Up / Move Down) for a book within its year group.
 *
 * @param {BookReorderControlsProps} props - Component properties
 * @returns {JSX.Element} Up and Down reordering buttons
 */
export function BookReorderControls({
  bookId,
  isFirst,
  isLast,
  isLoading,
  onReorder,
}: BookReorderControlsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-14">
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 bg-gray-50 p-0.5 rounded-md border border-gray-200">
      <button
        type="button"
        onClick={() => onReorder(bookId, "up")}
        disabled={isFirst || isLoading}
        title={isFirst ? "Top of year list" : "Move up"}
        aria-label="Move book up"
        className={cn(
          "p-1 rounded text-gray-600 hover:text-indigo-600 hover:bg-white transition-colors cursor-pointer",
          isFirst && "opacity-30 cursor-not-allowed hover:bg-transparent hover:text-gray-600",
        )}
      >
        <ArrowUp className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onReorder(bookId, "down")}
        disabled={isLast || isLoading}
        title={isLast ? "Bottom of year list" : "Move down"}
        aria-label="Move book down"
        className={cn(
          "p-1 rounded text-gray-600 hover:text-indigo-600 hover:bg-white transition-colors cursor-pointer",
          isLast && "opacity-30 cursor-not-allowed hover:bg-transparent hover:text-gray-600",
        )}
      >
        <ArrowDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
