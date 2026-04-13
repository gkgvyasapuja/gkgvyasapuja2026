"use client";

import { useState } from "react";
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
import { updateBook } from "@/app/(admin)/actions/admin";
import { Pencil } from "lucide-react";

export type EditableBook = {
  id: string;
  title: string;
  thumbnail: string;
  viewUrl: string;
  downloadUrl: string;
  publishedYear: string;
};

export function EditBookModal({ book }: { book: EditableBook }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      thumbnail: formData.get("thumbnail") as string,
      viewUrl: formData.get("viewUrl") as string,
      downloadUrl: formData.get("downloadUrl") as string,
      publishedYear: formData.get("publishedYear") as string,
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 shrink-0"
            type="button"
          />
        }
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit book</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

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
              placeholder="2023"
              defaultValue={book.publishedYear}
            />
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
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
