import React, { useState } from "react";
import dynamic from "next/dynamic";
import { UploadCloud, Loader2, FileText, Paperclip } from "lucide-react";
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
    <div className="min-h-[320px] w-full bg-slate-100 animate-pulse rounded-xl" />
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
  onSuggestionStateChange?: (
    requiresAction: boolean,
    actionCompleted: boolean,
  ) => void;
}

const navy = "text-[#0f2744]";
const navyBg = "bg-[#0f2744]";

export function DocumentSection({
  file,
  handleFileChange,
  isParsing,
  extractedText,
  setExtractedText,
  formData,
  handleSelectChange,
  onSuggestionStateChange,
}: Props) {
  const changes = useAiChanges(extractedText);
  const [decision, setDecision] = useState<"unset" | "keep" | "accept">(
    "unset",
  );

  const handleReject = (id: string, originalText: string) => {
    if (typeof window === "undefined") return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(extractedText, "text/html");
    const node = doc.querySelector(`.ai-correction[data-id="${id}"]`);
    if (node) {
      const textNode = doc.createTextNode(originalText);
      node.parentNode?.replaceChild(textNode, node);
      const remaining = doc.querySelectorAll(".ai-correction").length;
      setExtractedText(doc.body.innerHTML);
      setDecision(remaining === 0 ? "accept" : "unset");
      onSuggestionStateChange?.(remaining > 0, remaining === 0);
    }
  };

  const handleAccept = (id: string) => {
    if (typeof window === "undefined") return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(extractedText, "text/html");
    const node = doc.querySelector(`.ai-correction[data-id="${id}"]`);
    if (node) {
      const textNode = doc.createTextNode(node.textContent || "");
      node.parentNode?.replaceChild(textNode, node);
      const remaining = doc.querySelectorAll(".ai-correction").length;
      setExtractedText(doc.body.innerHTML);
      setDecision(remaining === 0 ? "accept" : "unset");
      onSuggestionStateChange?.(remaining > 0, remaining === 0);
    }
  };

  const applyCorrectionDecision = (action: "keep" | "accept") => {
    if (typeof window === "undefined") return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(extractedText, "text/html");
    const nodes = doc.querySelectorAll(".ai-correction");

    nodes.forEach((node) => {
      const replacementText =
        action === "keep"
          ? node.getAttribute("data-original") || node.textContent || ""
          : node.textContent || "";
      const textNode = doc.createTextNode(replacementText);
      node.parentNode?.replaceChild(textNode, node);
    });

    setExtractedText(doc.body.innerHTML);
    setDecision(action);
    onSuggestionStateChange?.(false, true);
  };

  React.useEffect(() => {
    if (changes.length === 0) {
      setDecision("unset");
      onSuggestionStateChange?.(false, true);
      return;
    }

    if (decision === "unset") {
      onSuggestionStateChange?.(true, false);
    }
  }, [changes.length, decision, onSuggestionStateChange]);

  return (
    <section className="pt-2">
      <div className="text-center mb-8 md:mb-10">
        <h2
          className={`text-2xl md:text-3xl font-bold ${navy} font-serif mb-4 tracking-tight`}
        >
          Step 2 of 3: Upload your offering
        </h2>
        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Your offering is a heartfelt expression of gratitude. It serves as a
          bridge between your service and the divine grace of Srila Prabhupada.
        </p>
      </div>

      <div className="space-y-6">
        <label
          htmlFor="offering-doc-upload"
          className={`flex flex-col items-stretch w-full rounded-2xl border-2 border-dashed border-slate-300 bg-white cursor-pointer transition-colors hover:border-slate-400 hover:bg-slate-50/80 ${
            file ? "border-slate-400 bg-slate-50/50" : ""
          }`}
        >
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
            <div className="size-16 rounded-full bg-sky-100 flex items-center justify-center mb-6 shadow-sm">
              <UploadCloud
                className={`size-8 ${navy}`}
                aria-hidden
              />
            </div>
            <h3
              className={`text-lg md:text-xl font-bold ${navy} font-serif mb-2`}
            >
              Upload Your Offering Letter
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-md">
              Drag and drop your document here or click to browse
            </p>
            <span
              className={`inline-flex items-center gap-2 rounded-lg ${navyBg} px-5 py-2.5 text-sm font-medium text-white shadow-md pointer-events-none`}
            >
              <Paperclip
                className="size-4 shrink-0"
                aria-hidden
              />
              Select .docx File
            </span>
            <p className="mt-8 text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Max file size: 10MB
            </p>
          </div>
          <input
            id="offering-doc-upload"
            type="file"
            className="hidden"
            accept=".docx"
            onChange={handleFileChange}
          />
        </label>

        {isParsing && (
          <div className="flex items-center justify-center p-6 text-slate-700 gap-3 border border-slate-200 rounded-2xl bg-slate-50">
            <Loader2 className="w-5 h-5 animate-spin text-[#0f2744]" />
            <span>Extracting text from document…</span>
          </div>
        )}

        {file && !isParsing && extractedText && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500 pt-2">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4 min-w-0">
                <div className="bg-sky-100 p-3 rounded-xl shrink-0">
                  <FileText className={`w-6 h-6 ${navy}`} />
                </div>
                <div className="min-w-0">
                  <p
                    className={`font-semibold truncate ${navy} max-w-[min(100%,20rem)]`}
                  >
                    {file.name}
                  </p>
                  <p className="text-slate-500 text-sm">
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
                  <SelectTrigger className="h-10 px-4 bg-slate-50 border-slate-200 text-slate-900 focus:ring-[#0f2744]/20 rounded-lg shrink-0 w-full sm:w-36 font-medium">
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
              <div className="flex items-center justify-between px-1 gap-4 flex-wrap">
                <label
                  className={`text-base font-semibold ${navy} flex flex-col gap-0.5`}
                >
                  <span>Document Preview</span>
                  <span className="text-sm text-slate-500 font-normal">
                    दस्तावेज़ पूर्वावलोकन
                  </span>
                </label>
                <span className="text-sm text-slate-500">
                  You may edit this text before submitting
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
                <div>
                  <div className="upload-offering-quill w-full rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:border-[#0f2744]/30 focus-within:ring-2 focus-within:ring-[#0f2744]/15 overflow-hidden">
                    <QuillEditor
                      value={extractedText}
                      onChange={setExtractedText}
                    />
                  </div>

                  {changes.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                      {/* <button
                        type="button"
                        onClick={() => setMode("preview")}
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${mode === "preview" ? "bg-[#0f2744] text-white border-transparent" : "bg-white text-slate-600 border-slate-300"}`}
                      >
                        Preview Mode
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode("next")}
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${mode === "next" ? "bg-[#0f2744] text-white border-transparent" : "bg-white text-slate-600 border-slate-300"}`}
                      >
                        Next Step
                      </button> */}
                      <button
                        type="button"
                        onClick={() => applyCorrectionDecision("keep")}
                        className={`px-4 py-2 rounded-full font-semibold border shadow-sm text-sm transition-colors ${decision === "keep" ? "bg-sky-600 text-white border-sky-600" : "bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200"}`}
                      >
                        Keep My Original
                      </button>
                      <button
                        type="button"
                        onClick={() => applyCorrectionDecision("accept")}
                        className={`px-4 py-2 rounded-full font-semibold border shadow-sm text-sm transition-colors ${decision === "accept" ? "bg-amber-500 text-white border-amber-500" : "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"}`}
                      >
                        Accept All Suggestions
                      </button>
                      <span className="ml-auto text-xs text-slate-500">
                        {decision === "unset"
                          ? "Choose an action to enable submit."
                          : decision === "keep"
                            ? "Keep original text selected. Submit enabled."
                            : "Suggestions accepted. Submit enabled."}
                      </span>
                    </div>
                  )}
                </div>

                {changes.length > 0 && (
                  <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm lg:sticky lg:top-6">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className={`text-lg font-semibold ${navy}`}>
                          Suggested Improvements
                        </h4>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">
                          Optional
                        </p>
                      </div>
                      <span className="text-xs text-slate-600 font-semibold">
                        {changes.length} items
                      </span>
                    </div>

                    <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1 space-y-3">
                      {changes.map((change) => (
                        <div
                          key={change.id}
                          className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm"
                        >
                          <p className="text-xs text-slate-400 line-through decoration-red-300">
                            {change.original}
                          </p>
                          <p className={`mt-1 text-sm ${navy} font-medium`}>
                            {change.updated}
                          </p>
                          <p className="mt-1 text-[10px] text-sky-700 font-semibold">
                            {change.reason}
                          </p>

                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleAccept(change.id)}
                              className="text-xs px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleReject(change.id, change.original)
                              }
                              className="text-xs px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
                            >
                              Ignore
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </aside>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
