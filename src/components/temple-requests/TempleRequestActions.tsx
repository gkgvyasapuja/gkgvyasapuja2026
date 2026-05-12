"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  approveTempleRequest,
  rejectTempleRequest,
} from "@/app/(admin)/actions/temple-requests";

interface Props {
  requestId: string;
  proposedName: string;
  devoteeName: string;
}

export function TempleRequestActions({
  requestId,
  proposedName,
  devoteeName,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<
    "approve" | "reject" | null
  >(null);

  const onApprove = () => {
    if (
      !confirm(
        `Approve "${proposedName}" from ${devoteeName}? A new temple will be added and the user will be linked to it.`,
      )
    ) {
      return;
    }
    setError(null);
    setActiveAction("approve");
    startTransition(async () => {
      const result = await approveTempleRequest(requestId);
      if (!result.success) {
        setError(result.error || "Could not approve the request.");
        setActiveAction(null);
      }
    });
  };

  const onReject = () => {
    if (
      !confirm(
        `Reject "${proposedName}" from ${devoteeName}? The user's "Other" entry will stay until they update it.`,
      )
    ) {
      return;
    }
    setError(null);
    setActiveAction("reject");
    startTransition(async () => {
      const result = await rejectTempleRequest(requestId);
      if (!result.success) {
        setError(result.error || "Could not reject the request.");
        setActiveAction(null);
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          size="sm"
          variant="default"
          onClick={onApprove}
          disabled={pending}
          className="bg-emerald-600 text-white hover:bg-emerald-500"
        >
          {pending && activeAction === "approve" ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <Check className="size-3.5" aria-hidden />
          )}
          Approve
        </Button>
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={onReject}
          disabled={pending}
        >
          {pending && activeAction === "reject" ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <X className="size-3.5" aria-hidden />
          )}
          Reject
        </Button>
      </div>
      {error && (
        <p className="text-xs text-red-600 text-right max-w-[220px]">
          {error}
        </p>
      )}
    </div>
  );
}
