import { useState } from "react";
import { parseDocx } from "@/app/(admin)/actions/offering";

export function useDocumentHandling(setError: (error: string | null) => void) {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.endsWith(".docx")) {
        setError("Please upload a .docx file.");
        return;
      }
      setFile(selectedFile);
      setError(null);

      // Auto-parse document upon selection
      setIsParsing(true);
      const fd = new FormData();
      fd.append("file", selectedFile);

      const response = await parseDocx(fd);
      setIsParsing(false);

      if (response.success && response.text) {
        setExtractedText(response.text);
      } else {
        setError(response.error || "Failed to parse document.");
        setFile(null); // Reset file if parsing fails
      }
    }
  };

  return { file, extractedText, setExtractedText, isParsing, handleFileChange };
}
