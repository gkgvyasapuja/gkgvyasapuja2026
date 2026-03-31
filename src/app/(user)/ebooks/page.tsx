"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, Eye } from "lucide-react";

interface EbookItem {
  id: string;
  title: string;
  thumbnail: string;
  viewUrl: string;
  downloadUrl: string;
  publishedYear: string;
  [key: string]: string | number | null | undefined;
}

interface YearGroup {
  YearId: string;
  data: EbookItem[];
}

const Ebooks = () => {
  const [books, setBooks] = useState<YearGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEbooks = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/ebooks");
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const json = await res.json();
        if (json.error) {
          throw new Error(json.error);
        }

        if (Array.isArray(json.books)) {
          setBooks(json.books);
        } else {
          setBooks([]);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load ebooks.");
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, []);

  const scrollToYear = (yearId: string) => {
    const anchor = document.getElementById(`year-${yearId}`);
    anchor?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Vyasa Puja E-Books
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Browse and download yearly ebook archives.
          </p>
        </div>

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            Loading ebooks...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && books.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            No ebooks found.
          </div>
        )}

        {!loading && !error && books.length > 0 && (
          <div className="space-y-8">
            <div className="flex flex-wrap justify-center gap-2">
              {books.map((group) => (
                <button
                  key={group.YearId}
                  onClick={() => scrollToYear(group.YearId)}
                  className="px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-100 transition"
                >
                  {group.YearId}
                </button>
              ))}
            </div>

            {books.map((group) => (
              <section
                key={group.YearId}
                id={`year-${group.YearId}`}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
              >
                <div className="bg-orange-500 text-white px-6 py-3 text-xl font-semibold">
                  {group.YearId}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                  {group.data.map((book) => (
                    <article
                      key={book.id}
                      className="rounded-xl border border-slate-200 p-5 bg-linear-to-br from-white via-slate-50 to-white shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <Image
                          src={
                            book.thumbnail ||
                            "/asset/heroAndGallery/default-book.png"
                          }
                          alt={book.title}
                          className="h-20 w-20 rounded-md object-cover border border-slate-200"
                          width={80}
                          height={80}
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {book.title || "Untitled ebook"}
                          </h3>
                          {/* <p className="text-sm text-slate-500 mt-1">
                            Year: {book.publishedYear || group.YearId}
                          </p> */}
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <a
                          href={book.downloadUrl || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 transition"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                        <a
                          href={book.viewUrl || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Ebooks;
