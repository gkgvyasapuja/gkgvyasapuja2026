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
import { addCountry } from "@/app/actions/admin";
import { Plus } from "lucide-react";

export function AddCountryModal() {
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
      numericCode: formData.get("numericCode") as string,
      phoneCode: formData.get("phoneCode") as string,
      currencyCode: formData.get("currencyCode") as string,
      CurrencyName: formData.get("currencyName") as string,
      CurrencySymbol: formData.get("currencySymbol") as string,
      nationality: formData.get("nationality") as string,
    };

    const result = await addCountry(data as any);
    if (result.success) {
      setOpen(false);
    } else {
      setError(result.error || "Failed to add country");
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
        <Plus className="w-4 h-4" /> Add Country
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Country</DialogTitle>
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
            <Label htmlFor="nationality" className="text-right">
              Nationality
            </Label>
            <Input id="nationality" name="nationality" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="numericCode" className="text-right">
              Num Code
            </Label>
            <Input id="numericCode" name="numericCode" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneCode" className="text-right">
              Phone Code
            </Label>
            <Input id="phoneCode" name="phoneCode" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currencyCode" className="text-right">
              Currency
            </Label>
            <Input
              id="currencyCode"
              name="currencyCode"
              className="col-span-3"
              placeholder="USD"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currencyName" className="text-right">
              Curr Name
            </Label>
            <Input
              id="currencyName"
              name="currencyName"
              className="col-span-3"
              placeholder="US Dollar"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currencySymbol" className="text-right">
              Curr Symb
            </Label>
            <Input
              id="currencySymbol"
              name="currencySymbol"
              className="col-span-3"
              placeholder="$"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? "Adding..." : "Save Country"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
