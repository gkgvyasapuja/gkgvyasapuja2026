import React from "react";
import dynamic from "next/dynamic";
import { UploadCloud, Loader2, FileText, X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { OfferingFormData } from "./types";
import { useAiChanges } from "../_hooks/useAiChanges";

const QuillEditor = dynamic(() => import("./QuillWrapper"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[320px] w-full bg-gray-100 animate-pulse rounded-xl" />
  ),
});

interface Props {
  file: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isParsing: boolean;
  extractedText: string;
  setExtractedText: (text: string) => void;
  formData: OfferingFormData;
  handleSelectChange: (name: string, value: string) => void;
}

export function DocumentSection({
  file,
  handleFileChange,
  isParsing,
  extractedText,
  setExtractedText,
  formData,
  handleSelectChange,
}: Props) {
  const changes = useAiChanges(extractedText);

  const handleReject = (id: string, originalText: string) => {
    if (typeof window === "undefined") return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(extractedText, "text/html");
    const node = doc.querySelector(`.ai-correction[data-id="${id}"]`);
    if (node) {
      const textNode = doc.createTextNode(originalText);
      node.parentNode?.replaceChild(textNode, node);
      setExtractedText(doc.body.innerHTML);
    }
  };

  return (
    <section className="pt-4">
      <h3 className="text-2xl font-semibold text-white mb-8 border-b border-white/10 pb-4">
        Offering Document / भेंट दस्तावेज़
      </h3>

      <div className="space-y-6">
        <label
          className={`flex flex-col items-center justify-center w-full min-h-60 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 group
            ${
              file
                ? "border-white/30 bg-white/10"
                : "border-white/20 bg-white/5 hover:bg-white/10"
            }`}
        >
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
            <UploadCloud
              className={`w-16 h-16 mb-6 transition-colors ${
                file ? "text-white" : "text-gray-400 group-hover:text-white"
              }`}
            />
            <p className="mb-2 text-xl text-white">
              <span className="font-semibold">
                {file ? "Replace document" : "Click to upload"}
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-sm text-gray-400 max-w-sm">
              Only Microsoft Word (.docx) files are supported up to 10MB.
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".docx"
            onChange={handleFileChange}
          />
        </label>

        {isParsing && (
          <div className="flex items-center justify-center p-6 text-gray-300 gap-3 border border-white/10 rounded-2xl bg-white/5 animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin" /> Extracting text from
            document...
          </div>
        )}

        {file && !isParsing && extractedText && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500 pt-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-5 bg-white/10 border border-white/20 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-xl shadow-sm">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold truncate max-w-50 sm:max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Select
                  value={formData.language}
                  onValueChange={(val: string | null) =>
                    handleSelectChange("language", val || "")
                  }
                >
                  <SelectTrigger className="h-10 px-4 bg-white/10 border-white/20 text-white focus:ring-white/20 rounded-lg shrink-0 w-35 font-medium">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className="text-base font-medium text-white flex flex-col gap-0.5">
                  <span>Document Preview</span>
                  <span className="text-sm text-gray-400 font-normal">
                    दस्तावेज़ पूर्वावलोकन
                  </span>
                </label>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm text-gray-400">
                    You may edit this text before submitting
                  </span>
                </div>
              </div>
              <div className="upload-offering-quill w-full rounded-2xl border border-gray-200 bg-white shadow-sm focus-within:border-[#0a2540]/30 focus-within:ring-2 focus-within:ring-[#0a2540]/20 overflow-hidden">
                <QuillEditor
                  value={extractedText}
                  onChange={setExtractedText}
                />
              </div>

              {changes.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-lg text-white font-semibold mb-4 flex items-center gap-2">
                    Pending Changes{" "}
                    <span className="bg-yellow-500 text-[#0a2540] text-xs px-2.5 py-0.5 rounded-full font-bold">
                      {changes.length}
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {changes.map((change) => (
                      <div
                        key={change.id}
                        className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col gap-3 animate-in fade-in zoom-in-95 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex-1 space-y-1">
                          <p className="text-sm text-gray-400 line-through decoration-red-500/50">
                            {change.original}
                          </p>
                          <p className="text-lg text-white font-medium">
                            {change.updated}
                          </p>
                          <p className="text-xs text-blue-300 mt-2 font-medium">
                            {change.reason}
                          </p>
                        </div>
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() =>
                              handleReject(change.id, change.original)
                            }
                            className="text-xs flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-4 py-2 rounded-xl transition-colors border border-red-500/20 font-semibold"
                          >
                            <X className="w-4 h-4" /> Reject Change
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
