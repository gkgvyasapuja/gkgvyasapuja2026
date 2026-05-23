"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { updateMaintainer } from "@/app/(admin)/actions/maintainers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

type MaintainerRow = {
  id: string;
  loginId: string;
  label: string | null;
};

export function EditMaintainerButton({ row }: { row: MaintainerRow }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setError(null);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateMaintainer(null, fd);
      if (res.success) {
        handleOpenChange(false);
        router.refresh();
      } else {
        setError(res.error ?? "Update failed.");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => handleOpenChange(true)}
        aria-label={`Edit ${row.loginId}`}
        className="inline-flex items-center justify-center rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Pencil className="size-4" />
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit maintainer</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="id" value={row.id} />
            <div className="space-y-1 text-sm">
              <span className="text-gray-500">Email</span>
              <p className="font-mono text-gray-900">{row.loginId}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`label-${row.id}`}>Label (optional)</Label>
              <Input
                id={`label-${row.id}`}
                name="label"
                defaultValue={row.label ?? ""}
                placeholder="e.g. Temple coordinator"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`password-${row.id}`}>
                New password (optional)
              </Label>
              <Input
                id={`password-${row.id}`}
                name="password"
                type="password"
                minLength={8}
                autoComplete="new-password"
                placeholder="Leave blank to keep current password"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
