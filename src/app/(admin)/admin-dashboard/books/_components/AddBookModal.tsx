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
import { Plus, Loader2 } from "lucide-react";
// Server Actions
import { addBook } from "@/app/(admin)/actions/books";

/**
 * Modal dialog component for adding a new book to the catalogue.
 *
 * @returns {JSX.Element} Add Book dialog component
 */
export function AddBookModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  /**
   * Handles book creation form submission.
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

    const result = await addBook(data);
    if (result.success) {
      setOpen(false);
      setIsVisible(true);
    } else {
      setError(result.error || "Failed to add book");
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs flex items-center gap-2 cursor-pointer" />
        }
      >
        <Plus className="w-4 h-4" /> Add Book
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          {error && <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</p>}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title *
            </Label>
            <Input
              id="title"
              name="title"
              required
              className="col-span-3"
              placeholder="e.g. Vyasa Puja 2026 Volume 1"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="thumbnail" className="text-right">
              Thumb URL *
            </Label>
            <Input
              id="thumbnail"
              name="thumbnail"
              required
              className="col-span-3"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="viewUrl" className="text-right">
              View URL *
            </Label>
            <Input
              id="viewUrl"
              name="viewUrl"
              required
              className="col-span-3"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="downloadUrl" className="text-right">
              DL URL *
            </Label>
            <Input
              id="downloadUrl"
              name="downloadUrl"
              required
              className="col-span-3"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="publishedYear" className="text-right">
              Year *
            </Label>
            <Input
              id="publishedYear"
              name="publishedYear"
              required
              className="col-span-3"
              placeholder="2026"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isVisible" className="text-right">
              Visible
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="isVisible"
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
                  Adding...
                </>
              ) : (
                "Save Book"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
