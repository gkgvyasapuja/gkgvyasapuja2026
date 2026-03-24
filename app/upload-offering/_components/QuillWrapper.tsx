"use client";

import React, { useMemo } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// Safely register custom blot for AI corrections so Quill doesn't strip our span tags
if (Quill) {
  const Inline = Quill.import("blots/inline") as any;
  class AiCorrectionBlot extends Inline {
    static blotName = "aiCorrection";
    static tagName = "span";
    static className = "ai-correction";
    static create(value: any) {
      const node = super.create();
      node.setAttribute(
        "class",
        "ai-correction bg-yellow-100 border-b-2 border-yellow-500 transition-colors"
      );

      if (typeof value === "object" && value !== null) {
        node.setAttribute("data-id", value.id || "");
        node.setAttribute("data-original", value.original || "");
        node.setAttribute("data-reason", value.reason || "");
      }
      return node;
    }

    static formats(node: HTMLElement) {
      return {
        id: node.getAttribute("data-id"),
        original: node.getAttribute("data-original"),
        reason: node.getAttribute("data-reason"),
      };
    }
  }

  try {
    Quill.register(AiCorrectionBlot, true);
  } catch (e) {
    // Ignore re-registration errors in development HMR
  }
}

interface QuillWrapperProps {
  value: string;
  onChange: (content: string) => void;
}

export default function QuillWrapper({ value, onChange }: QuillWrapperProps) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
      clipboard: {
        matchVisual: false, // Prevents additional newlines when parsing HTML
      },
    }),
    []
  );

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      className="h-full w-full custom-quill-container"
    />
  );
}
