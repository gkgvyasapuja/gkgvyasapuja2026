import { useState } from "react";
import { parseDocx } from "@/app/(admin)/actions/offering";

export function useDocumentHandling(setError: (error: string | null) => void) {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [hasImages, setHasImages] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.endsWith(".docx")) {
        setError("Please upload a .docx file.");
        return;
      }
      setFile(selectedFile);
      setHasImages(false);
      setError(null);

      // Auto-parse document upon selection
      setIsParsing(true);
      const fd = new FormData();
      fd.append("file", selectedFile);

      const response = await parseDocx(fd);
      setIsParsing(false);

      if (response.success && response.text) {
        setExtractedText(response.text);
        setHasImages("hasImages" in response && Boolean(response.hasImages));
        if ("hasImages" in response && response.hasImages) {
          alert(
            "This document contains one or more images. Review the preview to ensure your offering text looks correct.",
          );
        }
      } else {
        setError(response.error || "Failed to parse document.");
        setHasImages(false);
        setFile(null); // Reset file if parsing fails
      }
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
