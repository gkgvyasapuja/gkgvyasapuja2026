"use client";

// Native React Hooks
import { useMemo } from "react";
// Next & Third-party Components
import Image from "next/image";
import { Search, BookOpen, ExternalLink } from "lucide-react";

// Types
import type { AdminBook } from "../_types/book.types";
// Custom Hooks
import { useBooksManagement } from "../_hooks/useBooksManagement";
// UI Components
import { VisibilityToggle } from "./VisibilityToggle";
import { DeleteBookDialog } from "./DeleteBookDialog";
import { BookReorderControls } from "./BookReorderControls";
import { EditBookModal } from "./EditBookModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface BooksTableProps {
  initialBooks: AdminBook[];
}

/**
 * Main interactive table component for Books Management in the Admin Dashboard.
 * Integrates year filtering, search, custom reordering, visibility toggles, and deletion.
 *
 * @param {BooksTableProps} props - Initial list of books fetched server-side
 * @returns {JSX.Element} Interactive books table
 */
export function BooksTable({ initialBooks }: BooksTableProps) {
  // Custom hook separating business logic from presentation
  const {
    books,
    allBooks,
    availableYears,
    selectedYear,
    setSelectedYear,
    searchQuery,
    setSearchQuery,
    actionLoadingId,
    handleToggleVisibility,
    handleReorder,
    handleDelete,
  } = useBooksManagement(initialBooks);

  // Map to easily check if a book is first/last in its published year group
  const yearGroupBounds = useMemo(() => {
    const bounds = new Map<string, { isFirst: boolean; isLast: boolean }>();
    const grouped: Record<string, AdminBook[]> = {};

    allBooks.forEach((b) => {
      if (!grouped[b.publishedYear]) grouped[b.publishedYear] = [];
      grouped[b.publishedYear].push(b);
    });

    Object.values(grouped).forEach((group) => {
      group.forEach((book, idx) => {
        bounds.set(book.id, {
          isFirst: idx === 0,
          isLast: idx === group.length - 1,
        });
      });
    });

    return bounds;
  }, [allBooks]);

  return (
    <div className="space-y-4">
      {/* Search and Year Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedYear("ALL")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer",
              selectedYear === "ALL"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200",
            )}
          >
            All Years ({allBooks.length})
          </button>
          {availableYears.map((year) => {
            const countForYear = allBooks.filter((b) => b.publishedYear === year).length;
            return (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer",
                  selectedYear === year
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                {year} ({countForYear})
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-xs"
          />
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg shadow-2xs border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/75">
            <TableRow>
              <TableHead className="w-24 text-center">Order</TableHead>
              <TableHead className="min-w-60">Book Title</TableHead>
              <TableHead className="w-24">Year</TableHead>
              <TableHead className="w-32">Visibility</TableHead>
              <TableHead className="w-32">Stats</TableHead>
              <TableHead className="w-36">Links</TableHead>
              <TableHead className="w-40 text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => {
              const bounds = yearGroupBounds.get(book.id) || {
                isFirst: false,
                isLast: false,
              };
              const isLoading = actionLoadingId === book.id;

              return (
                <TableRow key={book.id} className="hover:bg-gray-50/50">
                  {/* Order Controls */}
                  <TableCell className="text-center">
                    <BookReorderControls
                      bookId={book.id}
                      isFirst={bounds.isFirst}
                      isLast={bounds.isLast}
                      isLoading={isLoading}
                      onReorder={handleReorder}
                    />
                  </TableCell>

                  {/* Title & Thumbnail */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {book.thumbnail ? (
                        <div className="w-10 h-12 relative rounded overflow-hidden shrink-0 border border-gray-200 bg-gray-50">
                          <Image
                            src={book.thumbnail}
                            alt={book.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-12 rounded bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200 text-gray-400">
                          <BookOpen className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-gray-900 leading-tight">
                          {book.title}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Year */}
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {book.publishedYear}
                    </span>
                  </TableCell>

                  {/* Visibility Toggle */}
                  <TableCell>
                    <VisibilityToggle
                      bookId={book.id}
                      isVisible={book.isVisible}
                      isLoading={isLoading}
                      onToggle={handleToggleVisibility}
                    />
                  </TableCell>

                  {/* Stats */}
                  <TableCell className="text-xs text-gray-600">
                    <div>Views: {book.viewCount ?? 0}</div>
                    <div>Downloads: {book.downloadCount ?? 0}</div>
                  </TableCell>

                  {/* Links */}
                  <TableCell className="space-x-3 text-xs">
                    <a
                      href={book.viewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={book.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                    >
                      Download <ExternalLink className="w-3 h-3" />
                    </a>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right pr-4">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <EditBookModal
                        book={{
                          id: book.id,
                          title: book.title,
                          thumbnail: book.thumbnail,
                          viewUrl: book.viewUrl,
                          downloadUrl: book.downloadUrl,
                          publishedYear: book.publishedYear,
                          isVisible: book.isVisible,
                          displayOrder: book.displayOrder,
                        }}
                      />
                      <DeleteBookDialog
                        bookId={book.id}
                        bookTitle={book.title}
                        bookThumbnail={book.thumbnail}
                        onDelete={handleDelete}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {books.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <BookOpen className="w-8 h-8 text-gray-300" />
                    <p className="font-medium text-sm text-gray-700">No books found</p>
                    <p className="text-xs text-gray-400">
                      {searchQuery
                        ? "Try adjusting your search criteria"
                        : "Add your first book using the button above"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
