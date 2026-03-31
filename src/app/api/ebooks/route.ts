import { NextResponse } from "next/server";
import { getBooks } from "@/app/(admin)/actions/admin";

export async function GET() {
  try {
    const ebooks = await getBooks();

    // Group by year in response shape expected by UI
    const grouped = Object.values(
      ebooks.reduce(
        (
          acc: Record<string, { YearId: string; data: typeof ebooks }>,
          ebook,
        ) => {
          const year = ebook.publishedYear || "Unknown";
          if (!acc[year]) {
            acc[year] = { YearId: year, data: [] };
          }
          acc[year].data.push(ebook);
          return acc;
        },
        {},
      ),
    ).sort((a, b) => Number(b.YearId) - Number(a.YearId));

    return NextResponse.json({ books: grouped });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to load ebooks: ${message}` },
      { status: 500 },
    );
  }
}
