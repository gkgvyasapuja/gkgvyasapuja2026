import { useState } from "react";
import { parseDocx } from "@/app/(admin)/actions/offering";
import { recordAppLog } from "@/app/(admin)/actions/logs";
import { buildAppLogMetadata } from "@/lib/app-log-context";
import {
  isOfferingDocFileName,
  OFFERING_DOC_RETRY_HINT,
} from "@/lib/offering-document";
import {
  isOfferingDocTooLarge,
  PARSE_DOCX_TIMEOUT_MS,
} from "@/lib/offering-document-limits";
import type { OfferingFormData } from "../_components/types";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("PARSE_TIMEOUT")), ms);
    }),
  ]);
}

function resetFileInput(input: HTMLInputElement) {
  input.value = "";
}

export function useDocumentHandling(
  setError: (error: string | null) => void,
  formData: OfferingFormData,
) {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [hasImages, setHasImages] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const selectedFile = input.files?.[0];
    if (!selectedFile) return;

    if (!isOfferingDocFileName(selectedFile.name)) {
      setError("Please upload a .doc or .docx file." + OFFERING_DOC_RETRY_HINT);
      resetFileInput(input);
      return;
    }

    if (selectedFile.size === 0) {
      setError("The selected file is empty." + OFFERING_DOC_RETRY_HINT);
      resetFileInput(input);
      return;
    }

    if (isOfferingDocTooLarge(selectedFile.size)) {
      setError(
        "File is too large. Maximum size is 2MB." + OFFERING_DOC_RETRY_HINT,
      );
      resetFileInput(input);
      return;
    }

    setFile(selectedFile);
    setExtractedText("");
    setHasImages(false);
    setError(null);
    setIsParsing(true);

    const startedAt = performance.now();
    let logSuccess = false;
    let logError: string | undefined;
    let logHasImages = false;

    try {
      const fd = new FormData();
      fd.append("file", selectedFile);

      const response = await withTimeout(
        parseDocx(fd),
        PARSE_DOCX_TIMEOUT_MS,
      );

      if (response.success && response.text) {
        logSuccess = true;
        logHasImages =
          "hasImages" in response && Boolean(response.hasImages);
        setExtractedText(response.text);
        setHasImages(logHasImages);
        if (logHasImages) {
          alert(
            "This document contains one or more images. Review the preview to ensure your offering text looks correct.",
          );
        }
      } else {
        logError = response.error || "Failed to parse document.";
        setError(logError + OFFERING_DOC_RETRY_HINT);
        setFile(null);
        setHasImages(false);
        resetFileInput(input);
      }
    } catch (err) {
      if (err instanceof Error && err.message === "PARSE_TIMEOUT") {
        logError = "parse_timeout";
        setError(
          "Extracting text took too long. This can happen on a slow connection or with a heavy document. Try again on Wi‑Fi, or use a smaller file." +
            OFFERING_DOC_RETRY_HINT,
        );
      } else {
        logError =
          err instanceof Error ? err.message : "parse_request_failed";
        setError(
          "Something went wrong while reading your document." +
            OFFERING_DOC_RETRY_HINT,
        );
      }
      setFile(null);
      setExtractedText("");
      setHasImages(false);
      resetFileInput(input);
    } finally {
      setIsParsing(false);
      void recordAppLog({
        logType: "doc_parse",
        durationMs: performance.now() - startedAt,
        success: logSuccess,
        errorMessage: logError,
        metadata: buildAppLogMetadata(formData, {
          fileName: selectedFile.name,
          fileSizeBytes: selectedFile.size,
          hasImages: logHasImages,
        }),
      });
    }
  };

  return {
    file,
    extractedText,
    setExtractedText,
    isParsing,
    hasImages,
    handleFileChange,
  };
}
