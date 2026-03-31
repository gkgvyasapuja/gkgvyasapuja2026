"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUseSaved: () => void;
  onSkipAndReenter: () => void;
};

export function ExistingUserModal({
  open,
  onOpenChange,
  onUseSaved,
  onSkipAndReenter,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} disablePointerDismissal>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md bg-white text-slate-700 border border-slate-200 shadow-xl rounded-2xl"
      >
        {/* Header */}
        <DialogHeader className="space-y-3 text-center">
          <DialogTitle className="text-lg font-semibold text-slate-800">
            Profile already found
          </DialogTitle>

          <DialogDescription className="text-sm text-slate-500 leading-relaxed">
            We found your details with this email. You can continue with your
            saved information or enter everything again.
          </DialogDescription>
        </DialogHeader>

        {/* Actions */}
        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto border-slate-200 text-slate-600 bg-white hover:bg-slate-50 rounded-xl text-sm font-medium"
            onClick={() => {
              onSkipAndReenter();
              onOpenChange(false);
            }}
          >
            Enter manually
          </Button>

          <Button
            type="button"
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium shadow-sm"
            onClick={() => {
              onUseSaved();
              onOpenChange(false);
            }}
          >
            Use saved details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}