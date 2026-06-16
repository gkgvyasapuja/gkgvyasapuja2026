import {
  applyParagraphAlignments,
  extractDocxParagraphAlignments,
} from "@/lib/docx-html-alignment";
import {
  getOfferingDocExtension,
  plainTextToOfferingHtml,
} from "@/lib/offering-document";
import WordExtractor from "word-extractor";

// mammoth is CommonJS; keep require for Next server compatibility.
const mammoth = require("mammoth");

export type ParseOfferingDocumentResult = {
  html: string;
  hasImages: boolean;
};

export async function parseOfferingDocument(
  buffer: Buffer,
  fileName: string,
): Promise<ParseOfferingDocumentResult> {
  const ext = getOfferingDocExtension(fileName);
  if (!ext) {
    throw new Error("Unsupported file type");
  }

  if (ext === "docx") {
    let hasImages = false;
    const result = await mammoth.convertToHtml(
      { buffer },
      {
        ignoreEmptyParagraphs: false,
        convertImage: mammoth.images.imgElement(function (image: {
          contentType: string;
          readAsBase64String: () => Promise<string>;
        }) {
          hasImages = true;
          return image.readAsBase64String().then(function (imageBuffer: string) {
            return {
              src: "data:" + image.contentType + ";base64," + imageBuffer,
            };
          });
        }),
      },
    );

    const alignments = await extractDocxParagraphAlignments(buffer);
    const html = applyParagraphAlignments(result.value, alignments);
    return { html, hasImages };
  }

  const extractor = new WordExtractor();
  const doc = await extractor.extract(buffer);
  const body = doc.getBody();
  return { html: plainTextToOfferingHtml(body), hasImages: false };
}
