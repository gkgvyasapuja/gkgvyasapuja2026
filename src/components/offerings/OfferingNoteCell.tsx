"use client";

import { useState, useTransition } from "react";
import { updateOfferingNote } from "@/app/(admin)/actions/admin";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OfferingNoteCellProps {
  offeringId: string;
  initialNote: string | null;
}

export function OfferingNoteCell({
  offeringId,
  initialNote,
}: OfferingNoteCellProps) {
  const [note, setNote] = useState(initialNote ?? "");
  const [savedNote, setSavedNote] = useState(initialNote ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const isDirty = note !== savedNote;

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateOfferingNote(offeringId, note);
      if (result.success) {
        const normalized = note.trim();
        setNote(normalized);
        setSavedNote(normalized);
      } else {
        setError(result.error ?? "Could not save note.");
      }
    });
  }

  return (
    <div className="min-w-[180px] max-w-[240px] mx-auto space-y-1.5">
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note…"
        rows={2}
        disabled={pending}
        className="min-h-14 text-xs resize-y text-left"
      />
      <div className="flex items-center justify-center gap-2">
        {error ? (
          <span className="text-[11px] text-red-600 truncate" title={error}>
            {error}
          </span>
        ) : (
          <span className="text-[11px] text-gray-400">
            {savedNote ? "Saved" : "Staff only"}
          </span>
        )}
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={cn("h-7 px-2 text-xs shrink-0", !isDirty && "invisible")}
          disabled={pending || !isDirty}
          onClick={handleSave}
        >
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}
