"use client";

// Native React Hooks
import { useState } from "react";
// UI Components & Icons
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Loader2 } from "lucide-react";
// Types
import type { EditableBook } from "../_types/book.types";
// Server Actions
import { updateBook } from "@/app/(admin)/actions/books";

export type { EditableBook };

/**
 * Modal dialog component for editing an existing book's details and visibility.
 *
 * @param {{ book: EditableBook }} props - Book to be edited
 * @returns {JSX.Element} Edit Book dialog component
 */
export function EditBookModal({ book }: { book: EditableBook }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(book.isVisible ?? true);

  /**
   * Handles book update form submission.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - Form event
   */
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: (formData.get("title") as string).trim(),
      thumbnail: (formData.get("thumbnail") as string).trim(),
      viewUrl: (formData.get("viewUrl") as string).trim(),
      downloadUrl: (formData.get("downloadUrl") as string).trim(),
      publishedYear: (formData.get("publishedYear") as string).trim(),
      isVisible,
    };

    const result = await updateBook(book.id, data);
    if (result.success) {
      setOpen(false);
    } else {
      setError(result.error || "Failed to update book");
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (val) setIsVisible(book.isVisible ?? true);
    }}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 shrink-0 cursor-pointer"
            type="button"
          />
        }
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          {error && <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</p>}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`title-${book.id}`} className="text-right">
              Title *
            </Label>
            <Input
              id={`title-${book.id}`}
              name="title"
              required
              className="col-span-3"
              defaultValue={book.title}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`thumbnail-${book.id}`} className="text-right">
              Thumb URL *
            </Label>
            <Input
              id={`thumbnail-${book.id}`}
              name="thumbnail"
              required
              className="col-span-3"
              placeholder="https://..."
              defaultValue={book.thumbnail}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`viewUrl-${book.id}`} className="text-right">
              View URL *
            </Label>
            <Input
              id={`viewUrl-${book.id}`}
              name="viewUrl"
              required
              className="col-span-3"
              placeholder="https://..."
              defaultValue={book.viewUrl}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`downloadUrl-${book.id}`} className="text-right">
              DL URL *
            </Label>
            <Input
              id={`downloadUrl-${book.id}`}
              name="downloadUrl"
              required
              className="col-span-3"
              placeholder="https://..."
              defaultValue={book.downloadUrl}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`publishedYear-${book.id}`} className="text-right">
              Year *
            </Label>
            <Input
              id={`publishedYear-${book.id}`}
              name="publishedYear"
              required
              className="col-span-3"
              placeholder="2026"
              defaultValue={book.publishedYear}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`isVisible-${book.id}`} className="text-right">
              Visible
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <input
                type="checkbox"
                id={`isVisible-${book.id}`}
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer"
              />
              <span className="text-xs text-gray-500">
                Show publicly in user-facing ebooks page
              </span>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
