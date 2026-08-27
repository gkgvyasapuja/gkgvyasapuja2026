"use server";

import { db } from "@/db";
import { books } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Type definition for book insertion payload
 */
export type AddBookInput = typeof books.$inferInsert;

/**
 * Type definition for book update payload
 */
export type UpdateBookInput = Partial<
  Pick<
    typeof books.$inferInsert,
    "title" | "thumbnail" | "viewUrl" | "downloadUrl" | "publishedYear" | "isVisible" | "displayOrder"
  >
>;

/**
 * Fetches all books ordered by published year descending, custom display order ascending, and creation date.
 * 
 * @returns {Promise<Array<typeof books.$inferSelect>>} List of all books in the database
 */
export async function getBooks() {
  return db
    .select()
    .from(books)
    .orderBy(desc(books.publishedYear), asc(books.displayOrder), desc(books.createdAt));
}

/**
 * Fetches only publicly visible books for the user-facing ebooks page.
 * 
 * @returns {Promise<Array<typeof books.$inferSelect>>} List of visible books
 */
export async function getVisibleBooks() {
  return db
    .select()
    .from(books)
    .where(eq(books.isVisible, true))
    .orderBy(desc(books.publishedYear), asc(books.displayOrder), desc(books.createdAt));
}

/**
 * Adds a new book to the database.
 * Automatically computes the next displayOrder within the given publishedYear if not specified.
 * 
 * @param {AddBookInput} data - Book metadata including title, urls, year, and visibility
 * @returns {Promise<{ success: boolean; error?: string }>} Operation result
 */
export async function addBook(data: AddBookInput) {
  try {
    let order = data.displayOrder;
    if (order === undefined || order === null) {
      // Find highest display order for the specified year
      const existingInYear = await db
        .select({ displayOrder: books.displayOrder })
        .from(books)
        .where(eq(books.publishedYear, data.publishedYear))
        .orderBy(desc(books.displayOrder))
        .limit(1);

      order = existingInYear.length > 0 ? (existingInYear[0].displayOrder ?? 0) + 1 : 0;
    }

    await db.insert(books).values({
      ...data,
      displayOrder: order,
      isVisible: data.isVisible ?? true,
      downloadCount: data.downloadCount ?? 0,
      viewCount: data.viewCount ?? 0,
    });

    revalidatePath("/admin-dashboard/books");
    revalidatePath("/ebooks");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to add book";
    return { success: false, error: message };
  }
}

/**
 * Updates an existing book's details, visibility, or order.
 * 
 * @param {string} id - Unique UUID of the book
 * @param {UpdateBookInput} data - Fields to update
 * @returns {Promise<{ success: boolean; error?: string }>} Operation result
 */
export async function updateBook(id: string, data: UpdateBookInput) {
  try {
    await db
      .update(books)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(books.id, id));

    revalidatePath("/admin-dashboard/books");
    revalidatePath("/ebooks");
    return { success: true as const };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update book";
    return { success: false as const, error: message };
  }
}

/**
 * Toggles a book's public visibility.
 * 
 * @param {string} id - Unique UUID of the book
 * @param {boolean} isVisible - Target visibility state
 * @returns {Promise<{ success: boolean; error?: string }>} Operation result
 */
export async function toggleBookVisibility(id: string, isVisible: boolean) {
  try {
    await db
      .update(books)
      .set({
        isVisible,
        updatedAt: new Date(),
      })
      .where(eq(books.id, id));

    revalidatePath("/admin-dashboard/books");
    revalidatePath("/ebooks");
    return { success: true as const };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to toggle visibility";
    return { success: false as const, error: message };
  }
}

/**
 * Permanently deletes a book from the database.
 * 
 * @param {string} id - Unique UUID of the book to delete
 * @returns {Promise<{ success: boolean; error?: string }>} Operation result
 */
export async function deleteBook(id: string) {
  try {
    await db.delete(books).where(eq(books.id, id));

    revalidatePath("/admin-dashboard/books");
    revalidatePath("/ebooks");
    return { success: true as const };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete book";
    return { success: false as const, error: message };
  }
}

/**
 * Reorders a list of books within a specific year.
 * 
 * @param {string} year - Published year for the books
 * @param {string[]} orderedBookIds - List of book IDs in their desired order
 * @returns {Promise<{ success: boolean; error?: string }>} Operation result
 */
export async function reorderBooks(year: string, orderedBookIds: string[]) {
  try {
    await db.transaction(async (tx) => {
      for (let index = 0; index < orderedBookIds.length; index++) {
        const bookId = orderedBookIds[index];
        await tx
          .update(books)
          .set({
            displayOrder: index,
            updatedAt: new Date(),
          })
          .where(eq(books.id, bookId));
      }
    });

    revalidatePath("/admin-dashboard/books");
    revalidatePath("/ebooks");
    return { success: true as const };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to reorder books";
    return { success: false as const, error: message };
  }
}
