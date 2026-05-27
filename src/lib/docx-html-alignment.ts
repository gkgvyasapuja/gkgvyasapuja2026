import JSZip from "jszip";

/** Word w:jc values → Quill alignment classes. */
const WORD_ALIGN_TO_QUILL_CLASS: Record<string, string> = {
  center: "ql-align-center",
  right: "ql-align-right",
  both: "ql-align-justify",
  justify: "ql-align-justify",
  distribute: "ql-align-justify",
};

const WORD_ALIGN_TO_STYLE: Record<string, string> = {
  center: "text-align: center",
  right: "text-align: right",
  both: "text-align: justify",
  justify: "text-align: justify",
  distribute: "text-align: justify",
};

function mergeParagraphAttrs(
  rawAttrs: string,
  quillClass: string,
  style: string,
): string {
  let attrs = rawAttrs ?? "";
  let className = quillClass;

  const classMatch = attrs.match(/\bclass="([^"]*)"/i);
  if (classMatch) {
    const kept = classMatch[1]
      .split(/\s+/)
      .filter((c) => c && !c.startsWith("ql-align-"))
      .join(" ");
    className = [kept, quillClass].filter(Boolean).join(" ");
    attrs = attrs.replace(/\bclass="[^"]*"/i, "");
  }

  const styleMatch = attrs.match(/\bstyle="([^"]*)"/i);
  let styleValue = style;
  if (styleMatch) {
    const kept = styleMatch[1]
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("text-align"))
      .join("; ");
    styleValue = [kept, style].filter(Boolean).join("; ");
    attrs = attrs.replace(/\bstyle="[^"]*"/i, "");
  }

  return ` class="${className}" style="${styleValue}"${attrs}`;
}

/** Read paragraph alignment (w:jc) from docx in document order. */
export async function extractDocxParagraphAlignments(
  buffer: Buffer,
): Promise<string[]> {
  const zip = await JSZip.loadAsync(buffer);
  const xmlFile = zip.file("word/document.xml");
  if (!xmlFile) return [];

  const xml = await xmlFile.async("string");
  const bodyMatch = xml.match(/<w:body>([\s\S]*)<\/w:body>/);
  if (!bodyMatch) return [];

  const paragraphs = bodyMatch[1].match(/<w:p[\s/>][\s\S]*?<\/w:p>/g) || [];
  return paragraphs.map((paragraph) => {
    const match = paragraph.match(/<w:jc w:val="([^"]+)"/);
    return match?.[1] ?? "left";
  });
}

/** Apply Quill alignment classes to `<p>` tags in mammoth HTML (same order as docx). */
export function applyParagraphAlignments(
  html: string,
  alignments: string[],
): string {
  let index = 0;

  return html.replace(/<p(\s[^>]*)?>/gi, (match, rawAttrs?: string) => {
    if (index >= alignments.length) return match;

    const wordAlign = alignments[index] ?? "left";
    index += 1;

    const quillClass = WORD_ALIGN_TO_QUILL_CLASS[wordAlign];
    const style = WORD_ALIGN_TO_STYLE[wordAlign];
    if (!quillClass || !style) return match;

    const attrs = rawAttrs ?? "";
    const merged = mergeParagraphAttrs(attrs, quillClass, style);
    return `<p${merged}>`;
  });
}
