"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { editOffering } from "@/app/actions/admin";
import { Eye, Edit2 } from "lucide-react";
import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("@/app/upload-offering/_components/QuillWrapper"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-xl" />
});

interface ViewEditOfferingModalProps {
  offering: {
    id: string;
    offering: string;
    language: "Hindi" | "English";
    userParams: string; // E.g., Devotee Name - Year
  };
}

export function ViewEditOfferingModal({
  offering,
}: ViewEditOfferingModalProps) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [textContent, setTextContent] = useState(offering.offering);
  const [language, setLanguage] = useState(offering.language);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  async function handleSave() {
    setLoading(true);
    setError("");

    const finalContent = textContent;

    const result = await editOffering(offering.id, {
      offering: finalContent,
      language,
    });

    if (result.success) {
      setTextContent(finalContent);
      setIsEditing(false);
      setOpen(false); // Can close or keep open in view mode.
    } else {
      setError(result.error || "Failed to edit offering");
    }
    setLoading(false);
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when closing
      setIsEditing(false);
      setTextContent(offering.offering);
      setLanguage(offering.language);
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="View Offering"
        >
          <Eye className="h-4 w-4 text-gray-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row justify-between items-center mr-6">
          <DialogTitle>Offering by {offering.userParams}</DialogTitle>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </Button>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          {!isEditing ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-500 mb-2">
                Language:{" "}
                <span className="font-medium text-gray-900">{language}</span>
              </div>
              <div
                className="bg-gray-50 p-6 rounded-lg border border-gray-100 prose prose-sm max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: textContent }}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value as "Hindi" | "English")
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
              <div className="space-y-2 flex-1 flex flex-col min-h-[300px]">
                <Label htmlFor="offering-content">
                  Offering Content
                </Label>
                <div className="bg-white rounded-lg border border-gray-200 prose prose-sm max-w-none text-gray-800 flex-1 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent min-h-[300px] [&_.ql-toolbar]:rounded-t-lg [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-gray-50 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200 [&_.ql-container]:border-none [&_.ql-container]:rounded-b-lg [&_.ql-editor]:min-h-[250px] [&_.ql-editor]:text-base">
                  <QuillEditor
                    value={textContent}
                    onChange={setTextContent}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="flex justify-end gap-2 pt-4 border-t mt-auto">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setTextContent(offering.offering);
                setLanguage(offering.language);
                setError("");
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
