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
import { addState } from "@/app/actions/admin";
import { Plus } from "lucide-react";

export function AddStateModal({ countries }: { countries: any[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      countryId: formData.get("countryId") as string,
    };

    if (!data.countryId) {
      setError("Please select a valid country.");
      setLoading(false);
      return;
    }

    const result = await addState(data as any);
    if (result.success) {
      setOpen(false);
    } else {
      setError(result.error || "Failed to add state");
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
        <Plus className="w-4 h-4" /> Add State
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New State</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name *
            </Label>
            <Input id="name" name="name" required className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="countryId" className="text-right">
              Country *
            </Label>
            <select
              id="countryId"
              name="countryId"
              required
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a country...</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? "Adding..." : "Save State"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
