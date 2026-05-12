"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { getAdminOfferings } from "@/app/(admin)/actions/admin";
import { editOffering } from "@/app/(admin)/actions/admin";
import {
  hasStaffEdit,
  staffEditorLabel,
  formatStaffEditedAt,
} from "@/lib/offering-staff-edit";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit2, Layers } from "lucide-react";
import dynamic from "next/dynamic";

const QuillEditor = dynamic(
  () => import("@/app/(user)/upload-offering/_components/QuillWrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 w-full bg-gray-100 animate-pulse rounded-xl" />
    ),
  },
);

type OfferingPageItem = Awaited<
  ReturnType<typeof getAdminOfferings>
>["items"][number];

function formatDate(value: OfferingPageItem["createdAt"]) {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

function templeDisplayName(item: OfferingPageItem) {
  if (item.templeName) return item.templeName;
  if (item.user.otherTempleName) return `Other (${item.user.otherTempleName})`;
  return null;
}

function OfferingBlock({ item }: { item: OfferingPageItem }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draftOffering, setDraftOffering] = useState(item.offering);
  const [draftLanguage, setDraftLanguage] = useState(item.language);

  const userParams = `${item.user.firstName} ${item.user.lastName} — ${item.year}`;
  const location = [
    item.countryName,
    item.stateName,
    item.cityName,
    templeDisplayName(item),
  ]
    .filter(Boolean)
    .join(" · ");

  function startEditing() {
    setDraftOffering(item.offering);
    setDraftLanguage(item.language);
    setError("");
    setIsEditing(true);
  }

  async function handleSave() {
    setLoading(true);
    setError("");
    const result = await editOffering(item.id, {
      offering: draftOffering,
      language: draftLanguage,
    });
    if (result.success) {
      setIsEditing(false);
      router.refresh();
    } else {
      setError(result.error || "Failed to save");
    }
    setLoading(false);
  }

  const staffEdited = hasStaffEdit(item);
  const editor = staffEditorLabel(item);

  return (
    <section
      className={cn(
        "rounded-xl border p-4 shadow-sm",
        staffEdited
          ? "border-emerald-200 bg-emerald-50/40"
          : "border-red-200 bg-red-50/40",
      )}
      data-offering-id={item.id}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
        <div className="min-w-0 space-y-1">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
            {userParams}
          </h3>
          <p className="text-xs text-gray-500">
            {item.user.initiatedName
              ? `Initiated: ${item.user.initiatedName} · `
              : ""}
            Phone: {item.user.phone || "—"}
          </p>
          <p className="text-xs text-gray-500">
            {location ? `Location: ${location}` : "Location: —"}
          </p>
          <p className="text-xs text-gray-500">
            Submitted: {formatDate(item.createdAt)}
          </p>
          <p
            className={cn(
              "text-xs font-medium",
              staffEdited ? "text-emerald-800" : "text-red-800",
            )}
          >
            Staff edited: {staffEdited ? "Yes" : "No"}
            {editor
              ? ` — ${editor} (${formatStaffEditedAt(item.lastEditedAt)})`
              : null}
          </p>
        </div>
        {!isEditing && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={startEditing}
          >
            <Edit2 className="h-3.5 w-3.5 mr-1.5" aria-hidden />
            Edit
          </Button>
        )}
      </div>

      {error ? (
        <p className="text-sm text-red-600 mb-3">{error}</p>
      ) : null}

      {!isEditing ? (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            Language:{" "}
            <span className="font-medium text-gray-800">{item.language}</span>
          </p>
          <div
            className="bg-gray-50 p-4 rounded-lg border border-gray-100 prose prose-sm max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: item.offering }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`lang-${item.id}`}>Language</Label>
            <select
              id={`lang-${item.id}`}
              name="language"
              title="Language"
              value={draftLanguage}
              onChange={(e) =>
                setDraftLanguage(e.target.value as "Hindi" | "English")
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`content-${item.id}`}>Offering content</Label>
            <div className="bg-white rounded-lg border border-gray-200 prose prose-sm max-w-none text-gray-800 min-h-[200px] [&_.ql-toolbar]:rounded-t-lg [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-gray-50 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200 [&_.ql-container]:border-none [&_.ql-container]:rounded-b-lg [&_.ql-editor]:min-h-48 [&_.ql-editor]:text-base">
              <QuillEditor
                value={draftOffering}
                onChange={setDraftOffering}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => {
                setIsEditing(false);
                setError("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={loading}
              onClick={() => void handleSave()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

interface OfferingsPageViewModalProps {
  offerings: OfferingPageItem[];
}

export function OfferingsPageViewModal({ offerings }: OfferingsPageViewModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={offerings.length === 0}
        onClick={() => setOpen(true)}
        title="Open all offerings on this page in one scrollable view"
      >
        <Layers className="h-4 w-4 mr-1.5" aria-hidden />
        View all on page
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton
          className="sm:max-w-5xl w-[calc(100%-1.5rem)] max-h-[min(90vh,900px)] flex flex-col gap-0 p-0 overflow-hidden"
        >
          <DialogHeader className="px-4 pt-4 pb-2 border-b shrink-0">
            <DialogTitle className="text-lg">
              Offerings on this page ({offerings.length})
            </DialogTitle>
            <p className="text-sm text-muted-foreground font-normal">
              Scroll to read each offering. Use Edit on any card to change it
              here.
            </p>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {offerings.map((item) => (
              <OfferingBlock key={item.id} item={item} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
