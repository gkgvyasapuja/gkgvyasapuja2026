"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  markOfferingEdited,
  unmarkOfferingEdited,
} from "@/app/(admin)/actions/admin";
import { Button } from "@/components/ui/button";

interface OfferingMarkEditedControlsProps {
  offeringId: string;
  marked: boolean;
}

export function OfferingMarkEditedControls({
  offeringId,
  marked,
}: OfferingMarkEditedControlsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleMark() {
    startTransition(async () => {
      const result = await markOfferingEdited(offeringId);
      if (result.success) router.refresh();
    });
  }

  function handleUnmark() {
    startTransition(async () => {
      const result = await unmarkOfferingEdited(offeringId);
      if (result.success) router.refresh();
    });
  }

  return (
    <div className="flex justify-center">
      {!marked ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 px-2 text-[11px]"
          disabled={pending}
          onClick={handleMark}
        >
          Mark edited
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 px-2 text-[11px]"
          disabled={pending}
          onClick={handleUnmark}
        >
          Unmark edited
        </Button>
      )}
    </div>
  );
}
