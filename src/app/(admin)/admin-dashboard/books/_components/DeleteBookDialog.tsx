"use client";

// Native React Hooks
import { useState } from "react";
// UI Components & Icons
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteBookDialogProps {
  bookId: string;
  bookTitle: string;
  bookThumbnail?: string;
  onDelete: (id: string) => Promise<boolean>;
}

/**
 * Confirmation dialog for permanently deleting a book.
 *
 * @param {DeleteBookDialogProps} props - Book ID, Title, Thumbnail and Delete handler
 * @returns {JSX.Element} Delete dialog component
 */
export function DeleteBookDialog({
  bookId,
  bookTitle,
  bookThumbnail,
  onDelete,
}: DeleteBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const success = await onDelete(bookId);
    setIsDeleting(false);
    if (success) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 gap-1.5 shrink-0"
            type="button"
          />
        }
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <AlertTriangle className="w-5 h-5" />
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Delete Book
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 text-sm">
            Are you sure you want to delete this book? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 p-3 my-2 bg-gray-50 rounded-lg border border-gray-200">
          {bookThumbnail ? (
            <div className="w-12 h-14 relative rounded overflow-hidden shrink-0 border border-gray-300">
              <Image
                src={bookThumbnail}
                alt={bookTitle}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm text-gray-900 truncate">
              {bookTitle}
            </p>
            <p className="text-xs text-gray-500">Permanent removal from catalogue</p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white gap-1.5"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, Delete Book"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
