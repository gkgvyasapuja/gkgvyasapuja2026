import { useMemo } from "react";

export interface AiChange {
  id: string;
  original: string;
  updated: string;
  reason: string;
}

function generateDeterministicId(node: Element, index: number): string {
  const content = node.textContent || "";
  return `${content}-${index}`.substring(0, 20);
}

export function useAiChanges(html: string) {
  const changes = useMemo(() => {
    if (typeof window === "undefined" || !html) {
      return [];
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const docChanges: AiChange[] = [];

    const nodes = doc.querySelectorAll(".ai-correction");
    nodes.forEach((node, index) => {
      docChanges.push({
        id:
          node.getAttribute("data-id") || generateDeterministicId(node, index),
        original: node.getAttribute("data-original") || "",
        updated: node.textContent || "",
        reason: node.getAttribute("data-reason") || "Correction",
      });
    });

    return docChanges;
  }, [html]);

  return changes;
}
