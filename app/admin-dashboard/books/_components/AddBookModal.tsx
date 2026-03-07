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
import { addBook } from "@/app/actions/admin";
import { Plus } from "lucide-react";

export function AddBookModal() {
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

    const result = await addBook(data as any);
    if (result.success) {
      setOpen(false);
    } else {
      setError(result.error || "Failed to add book");
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2" />
        }
      >
        <Plus className="w-4 h-4" /> Add Book
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title *
            </Label>
            <Input id="title" name="title" required className="col-span-3" />
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
              placeholder="2023"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? "Adding..." : "Save Book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
