import { getBooks } from "@/app/actions/admin";
import { AddBookModal } from "./_components/AddBookModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center whitespace-nowrap">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Books
        </h1>
        <AddBookModal />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead>Links</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium text-gray-900 flex items-center gap-3">
                  {book.thumbnail && (
                    <div className="w-10 h-10 relative rounded overflow-hidden shrink-0 border border-gray-200">
                      <Image
                        src={book.thumbnail}
                        alt={book.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  {book.title}
                </TableCell>
                <TableCell>{book.publishedYear}</TableCell>
                <TableCell>{book.viewCount}</TableCell>
                <TableCell>{book.downloadCount}</TableCell>
                <TableCell className="space-x-2">
                  <a
                    href={book.viewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    View
                  </a>
                  <a
                    href={book.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    Download
                  </a>
                </TableCell>
              </TableRow>
            ))}
            {books.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-gray-500"
                >
                  No books found. Add some above.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
