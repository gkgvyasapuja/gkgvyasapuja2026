import { parse, type HTMLElement, type Node } from "node-html-parser";
import {
  AlignmentType,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  Packer,
  Paragraph,
  TextRun,
  UnderlineType,
  type ParagraphChild,
} from "docx";

type RunStyle = {
  bold?: boolean;
  italics?: boolean;
  underline?: { readonly type: (typeof UnderlineType)[keyof typeof UnderlineType] };
  strike?: boolean;
};

type BlockContext = {
  numberingReference?: "offering-bullets" | "offering-numbers";
  numberingLevel?: number;
};

const HEADING_BY_TAG: Record<string, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
  h1: HeadingLevel.HEADING_1,
  h2: HeadingLevel.HEADING_2,
  h3: HeadingLevel.HEADING_3,
  h4: HeadingLevel.HEADING_4,
  h5: HeadingLevel.HEADING_5,
  h6: HeadingLevel.HEADING_6,
};

const OFFERING_NUMBERING = {
  config: [
    {
      reference: "offering-bullets",
      levels: [
        {
          level: 0,
          format: LevelFormat.BULLET,
          text: "\u2022",
          alignment: AlignmentType.START,
          style: {
            paragraph: {
              indent: { left: 720, hanging: 360 },
            },
          },
        },
      ],
    },
    {
      reference: "offering-numbers",
      levels: [
        {
          level: 0,
          format: LevelFormat.DECIMAL,
          text: "%1.",
          alignment: AlignmentType.START,
          style: {
            paragraph: {
              indent: { left: 720, hanging: 360 },
            },
          },
        },
      ],
    },
  ],
};

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function alignmentFromElement(
  element: HTMLElement,
): (typeof AlignmentType)[keyof typeof AlignmentType] | undefined {
  const className = element.getAttribute("class") ?? "";
  if (className.includes("ql-align-center")) return AlignmentType.CENTER;
  if (className.includes("ql-align-right")) return AlignmentType.RIGHT;
  if (className.includes("ql-align-justify")) return AlignmentType.BOTH;

  const alignAttr = (element.getAttribute("align") ?? "").toLowerCase();
  if (alignAttr === "center") return AlignmentType.CENTER;
  if (alignAttr === "right") return AlignmentType.RIGHT;
  if (alignAttr === "justify") return AlignmentType.BOTH;

  const style = element.getAttribute("style") ?? "";
  const match = style.match(/text-align\s*:\s*(left|center|right|justify|start|end)/i);
  if (!match) return undefined;

  switch (match[1].toLowerCase()) {
    case "center":
      return AlignmentType.CENTER;
    case "right":
    case "end":
      return AlignmentType.RIGHT;
    case "justify":
      return AlignmentType.BOTH;
    default:
      return AlignmentType.LEFT;
  }
}

function paragraphAlignment(
  element: HTMLElement,
): (typeof AlignmentType)[keyof typeof AlignmentType] | undefined {
  let current: HTMLElement | null = element;
  while (current) {
    const alignment = alignmentFromElement(current);
    if (alignment) return alignment;

    const parentNode: Node | null = current.parentNode;
    if (!parentNode || !isElement(parentNode)) break;

    const parentTag = parentNode.tagName?.toLowerCase() ?? "";
    if (!parentTag || parentTag === "body" || parentTag === "html") break;

    current = parentNode;
  }

  return undefined;
}

function isElement(node: Node): node is HTMLElement {
  return node.nodeType === 1;
}

function isTextNode(node: Node): boolean {
  return node.nodeType === 3;
}

function mergeRunStyle(base: RunStyle, tag: string): RunStyle {
  const next = { ...base };
  switch (tag) {
    case "strong":
    case "b":
      next.bold = true;
      break;
    case "em":
    case "i":
      next.italics = true;
      break;
    case "u":
      next.underline = { type: UnderlineType.SINGLE };
      break;
    case "s":
    case "strike":
    case "del":
      next.strike = true;
      break;
  }
  return next;
}

function imageRunFromSrc(src: string | undefined): ImageRun | null {
  if (!src?.startsWith("data:")) return null;

  const match = src.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;

  try {
    const data = Buffer.from(match[2], "base64");
    if (data.length === 0) return null;
    return new ImageRun({
      type: match[1].includes("png") ? "png" : "jpg",
      data,
      transformation: { width: 320, height: 240 },
    });
  } catch {
    return null;
  }
}

function collectInlineChildren(
  nodes: Node[],
  style: RunStyle,
): ParagraphChild[] {
  const children: ParagraphChild[] = [];

  for (const node of nodes) {
    if (isTextNode(node)) {
      const text = decodeHtmlEntities(node.rawText.replace(/\u00a0/g, " "));
      if (text.length > 0) {
        children.push(new TextRun({ text, ...style }));
      }
      continue;
    }

    if (!isElement(node)) continue;

    const tag = node.tagName.toLowerCase();
    if (tag === "br") {
      children.push(new TextRun({ break: 1 }));
      continue;
    }

    if (tag === "img") {
      const image = imageRunFromSrc(node.getAttribute("src") ?? undefined);
      if (image) children.push(image);
      continue;
    }

    if (tag === "a") {
      const href = node.getAttribute("href");
      const linkChildren = collectInlineChildren(node.childNodes, style).filter(
        (child): child is TextRun => child instanceof TextRun,
      );
      if (href && linkChildren.length > 0) {
        children.push(
          new ExternalHyperlink({
            link: href,
            children: linkChildren,
          }),
        );
      } else {
        children.push(...collectInlineChildren(node.childNodes, style));
      }
      continue;
    }

    if (tag === "span" && node.classNames.includes("ql-ui")) {
      continue;
    }

    children.push(
      ...collectInlineChildren(node.childNodes, mergeRunStyle(style, tag)),
    );
  }

  return children;
}

function paragraphFromBlock(
  element: HTMLElement,
  blockContext: BlockContext = {},
): Paragraph {
  const tag = element.tagName.toLowerCase();
  const alignment = paragraphAlignment(element);
  const children = collectInlineChildren(element.childNodes, {});

  const paragraphChildren =
    children.length > 0 ? children : [new TextRun({ text: " " })];

  const heading = HEADING_BY_TAG[tag];
  const numbering =
    blockContext.numberingReference != null &&
    blockContext.numberingLevel != null
      ? {
          reference: blockContext.numberingReference,
          level: blockContext.numberingLevel,
        }
      : undefined;

  return new Paragraph({
    children: paragraphChildren,
    alignment,
    heading,
    numbering,
  });
}

function paragraphsFromList(
  listElement: HTMLElement,
  ordered: boolean,
): Paragraph[] {
  const reference = ordered ? "offering-numbers" : "offering-bullets";
  const paragraphs: Paragraph[] = [];

  for (const child of listElement.childNodes) {
    if (!isElement(child) || child.tagName.toLowerCase() !== "li") continue;
    paragraphs.push(
      paragraphFromBlock(child, {
        numberingReference: reference,
        numberingLevel: 0,
      }),
    );
  }

  return paragraphs;
}

function paragraphsFromNode(node: Node): Paragraph[] {
  if (isTextNode(node)) {
    const text = decodeHtmlEntities(node.rawText.replace(/\u00a0/g, " ").trim());
    if (!text) return [];
    return [new Paragraph({ children: [new TextRun({ text })] })];
  }

  if (!isElement(node)) return [];

  const tag = node.tagName.toLowerCase();
  switch (tag) {
    case "p":
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return [paragraphFromBlock(node)];
    case "ol":
      return paragraphsFromList(node, true);
    case "ul":
      return paragraphsFromList(node, false);
    case "div":
    case "body":
    case "article":
    case "section":
      return node.childNodes.flatMap((child) => paragraphsFromNode(child));
    case "img": {
      const image = imageRunFromSrc(node.getAttribute("src") ?? undefined);
      if (!image) return [];
      return [new Paragraph({ children: [image], alignment: paragraphAlignment(node) })];
    }
    case "br":
      return [new Paragraph({ children: [new TextRun({ text: " " })] })];
    default:
      if (node.childNodes.length > 0) {
        return node.childNodes.flatMap((child) => paragraphsFromNode(child));
      }
      return [paragraphFromBlock(node)];
  }
}

export function offeringHtmlToParagraphs(html: string): Paragraph[] {
  const trimmed = html.trim();
  if (!trimmed) {
    return [new Paragraph({ children: [new TextRun({ text: " " })] })];
  }

  const root = parse(`<div>${trimmed}</div>`, {
    comment: false,
    blockTextElements: {
      script: true,
      noscript: true,
      style: true,
    },
  });

  const wrapper = root.querySelector("div");
  if (!wrapper) {
    return [new Paragraph({ children: [new TextRun({ text: " " })] })];
  }

  const paragraphs = wrapper.childNodes.flatMap((child) =>
    paragraphsFromNode(child),
  );

  return paragraphs.length > 0
    ? paragraphs
    : [new Paragraph({ children: [new TextRun({ text: " " })] })];
}

export async function buildOfferingHtmlDocxBuffer(html: string): Promise<Buffer> {
  return buildParagraphsDocxBuffer(offeringHtmlToParagraphs(html));
}

export async function buildParagraphsDocxBuffer(
  paragraphs: Paragraph[],
): Promise<Buffer> {
  const doc = new Document({
    numbering: OFFERING_NUMBERING,
    sections: [{ children: paragraphs }],
  });
  return Packer.toBuffer(doc);
}
