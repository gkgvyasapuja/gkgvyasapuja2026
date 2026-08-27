import { getBooks } from "@/app/(admin)/actions/books";
import { AddBookModal } from "./_components/AddBookModal";
import { BooksTable } from "./_components/BooksTable";
import type { AdminBook } from "./_types/book.types";

export const dynamic = "force-dynamic";

/**
 * Server Component for the Admin Books Management page.
 * Fetches all books and hydrates the interactive client table.
 *
 * @returns {Promise<JSX.Element>} Rendered Admin Books page
 */
export default async function BooksPage() {
  const booksData = await getBooks();

  const formattedBooks: AdminBook[] = booksData.map((book) => ({
    id: book.id,
    title: book.title,
    thumbnail: book.thumbnail,
    viewUrl: book.viewUrl,
    downloadUrl: book.downloadUrl,
    publishedYear: book.publishedYear,
    downloadCount: book.downloadCount,
    viewCount: book.viewCount,
    isVisible: book.isVisible,
    displayOrder: book.displayOrder,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center whitespace-nowrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Books Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage Vyasa Puja ebooks, year-wise ordering, and visibility.
          </p>
        </div>
        <AddBookModal />
      </div>

      <BooksTable initialBooks={formattedBooks} />
    </div>
  );
}
