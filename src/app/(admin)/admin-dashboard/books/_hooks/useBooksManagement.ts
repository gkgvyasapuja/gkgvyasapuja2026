"use client";

// Native React Hooks
import { useState, useTransition, useMemo, useEffect } from "react";
// Next Navigation Hooks
import { useRouter } from "next/navigation";

// Types
import type { AdminBook } from "../_types/book.types";
// Server Actions
import {
  deleteBook,
  toggleBookVisibility,
  reorderBooks,
} from "@/app/(admin)/actions/books";

/**
 * Custom hook encapsulating the business and state logic for Books Management.
 * Handles year-filtering, search, reordering, visibility toggles, and deletions.
 *
 * @param {AdminBook[]} initialBooks - Initial list of books passed from the server component
 * @returns Object containing state and action handlers for the books table
 */
export function useBooksManagement(initialBooks: AdminBook[]) {
  const router = useRouter();

  // Local state
  const [booksList, setBooksList] = useState<AdminBook[]>(initialBooks);
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Synchronize local state when server data updates
  useEffect(() => {
    setBooksList(initialBooks);
  }, [initialBooks]);

  // Extract unique published years in descending order
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    booksList.forEach((b) => {
      if (b.publishedYear) yearsSet.add(b.publishedYear);
    });
    return Array.from(yearsSet).sort((a, b) => Number(b) - Number(a));
  }, [booksList]);

  // Filtered books based on selected year and search query
  const filteredBooks = useMemo(() => {
    return booksList.filter((book) => {
      const matchesYear =
        selectedYear === "ALL" || book.publishedYear === selectedYear;
      const matchesSearch =
        searchQuery.trim() === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        book.publishedYear.includes(searchQuery.trim());
      return matchesYear && matchesSearch;
    });
  }, [booksList, selectedYear, searchQuery]);

  /**
   * Toggles the visibility of a book with optimistic UI update.
   *
   * @param {string} id - Book ID to toggle
   * @param {boolean} currentVisibility - Current visibility status
   */
  const handleToggleVisibility = async (
    id: string,
    currentVisibility: boolean,
  ) => {
    const targetVisibility = !currentVisibility;
    setActionLoadingId(id);

    // Optimistic state update
    setBooksList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isVisible: targetVisibility } : b)),
    );

    startTransition(async () => {
      const result = await toggleBookVisibility(id, targetVisibility);
      if (!result.success) {
        // Rollback on failure
        setBooksList((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, isVisible: currentVisibility } : b,
          ),
        );
        alert(result.error || "Failed to update visibility.");
      } else {
        router.refresh();
      }
      setActionLoadingId(null);
    });
  };

  /**
   * Moves a book up or down within its published year group and persists the new order.
   *
   * @param {string} bookId - ID of the book to move
   * @param {"up" | "down"} direction - Direction of movement
   */
  const handleReorder = async (bookId: string, direction: "up" | "down") => {
    const targetBook = booksList.find((b) => b.id === bookId);
    if (!targetBook) return;

    const year = targetBook.publishedYear;
    // Get all books belonging to this year in current order
    const yearBooks = booksList.filter((b) => b.publishedYear === year);
    const currentIndex = yearBooks.findIndex((b) => b.id === bookId);
    if (currentIndex === -1) return;

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= yearBooks.length) return;

    // Swap books
    const updatedYearBooks = [...yearBooks];
    const [moved] = updatedYearBooks.splice(currentIndex, 1);
    updatedYearBooks.splice(targetIndex, 0, moved);

    const orderedIds = updatedYearBooks.map((b) => b.id);
    setActionLoadingId(bookId);

    // Optimistic update
    setBooksList((prev) => {
      const otherBooks = prev.filter((b) => b.publishedYear !== year);
      const updatedWithIndices = updatedYearBooks.map((b, idx) => ({
        ...b,
        displayOrder: idx,
      }));
      return [...otherBooks, ...updatedWithIndices].sort((a, b) => {
        if (b.publishedYear !== a.publishedYear) {
          return Number(b.publishedYear) - Number(a.publishedYear);
        }
        return a.displayOrder - b.displayOrder;
      });
    });

    startTransition(async () => {
      const result = await reorderBooks(year, orderedIds);
      if (!result.success) {
        setBooksList(initialBooks);
        alert(result.error || "Failed to save reordering.");
      } else {
        router.refresh();
      }
      setActionLoadingId(null);
    });
  };

  /**
   * Deletes a book and updates state upon confirmation.
   *
   * @param {string} id - Book ID to delete
   * @returns {Promise<boolean>} True if deletion succeeded
   */
  const handleDelete = async (id: string): Promise<boolean> => {
    setActionLoadingId(id);
    const result = await deleteBook(id);
    setActionLoadingId(null);

    if (result.success) {
      setBooksList((prev) => prev.filter((b) => b.id !== id));
      router.refresh();
      return true;
    } else {
      alert(result.error || "Failed to delete book.");
      return false;
    }
  };

  return {
    books: filteredBooks,
    allBooks: booksList,
    availableYears,
    selectedYear,
    setSelectedYear,
    searchQuery,
    setSearchQuery,
    isPending,
    actionLoadingId,
    handleToggleVisibility,
    handleReorder,
    handleDelete,
  };
}
