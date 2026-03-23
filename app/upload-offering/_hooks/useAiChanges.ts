import { useState, useEffect } from "react";

export interface AiChange {
  id: string;
  original: string;
  updated: string;
  reason: string;
}

export function useAiChanges(html: string) {
  const [changes, setChanges] = useState<AiChange[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !html) {
      setChanges([]);
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const docChanges: AiChange[] = [];

    const nodes = doc.querySelectorAll(".ai-correction");
    nodes.forEach((node) => {
      docChanges.push({
        id: node.getAttribute("data-id") || Math.random().toString(),
        original: node.getAttribute("data-original") || "",
        updated: node.textContent || "",
        reason: node.getAttribute("data-reason") || "Correction",
      });
    });

    // We only update if the changes actually differ in content/length to avoid unnecessary re-renders.
    // However, since `html` string changes trigger this effect, setting new array is generally fine.
    setChanges(docChanges);
  }, [html]);

  return changes;
}
