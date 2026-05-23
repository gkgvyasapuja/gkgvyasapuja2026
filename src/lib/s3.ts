import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET;

function requireConfig(): { region: string; bucket: string; client: S3Client } {
  if (!region || !bucket) {
    throw new Error("Missing AWS_REGION or AWS_S3_BUCKET");
  }
  const client = new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });
  return { region, bucket, client };
}

/** Public HTTPS URL for an object stored with our upload convention. */
export function publicObjectUrl(key: string): string {
  const { region, bucket } = requireConfig();
  const encodedKey = key
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `https://${bucket}.s3.${region}.amazonaws.com/${encodedKey}`;
}

/** Extract object key from URLs produced by `publicObjectUrl` (same bucket/region). */
export function objectKeyFromPublicUrl(url: string): string | null {
  try {
    const { region, bucket } = requireConfig();
    const prefix = `https://${bucket}.s3.${region}.amazonaws.com/`;
    if (!url.startsWith(prefix)) return null;
    return decodeURIComponent(url.slice(prefix.length));
  } catch {
    return null;
  }
}

function sanitizeOfferingFileSegment(value: string): string {
  return value
    .trim()
    .replace(/[^\w.\-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

/** Offering object name: firstName_lastName_mobile_state_city_temple.docx */
export function buildOfferingDocxFileName(params: {
  firstName: string;
  lastName: string;
  mobile: string;
  state: string;
  city: string;
  temple: string;
}): string {
  const parts = [
    params.firstName,
    params.lastName,
    params.mobile,
    params.state,
    params.city,
    params.temple,
  ]
    .map(sanitizeOfferingFileSegment)
    .filter(Boolean);

  const base = parts.join("_") || "offering";
  return `${base.slice(0, 200)}.docx`;
}

export async function uploadOfferingDocx(params: {
  year: string;
  buffer: Buffer;
  fileName: string;
}): Promise<{ key: string; url: string }> {
  const { client, bucket } = requireConfig();
  const safeName = params.fileName
    .replace(/[^\w.\-]+/g, "_")
    .slice(0, 220);
  const key = `offerings/${params.year}/${safeName}`;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: params.buffer,
      ContentType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      CacheControl: "private, max-age=31536000",
    }),
  );

  return { key, url: publicObjectUrl(key) };
}

const ADMIN_MEDIA_PREFIX = "admin-media";

function guessContentType(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".mp4")) return "video/mp4";
  if (lower.endsWith(".webm")) return "video/webm";
  if (lower.endsWith(".mp3")) return "audio/mpeg";
  if (lower.endsWith(".wav")) return "audio/wav";
  return "application/octet-stream";
}

/** Upload arbitrary admin media; object is served at `publicObjectUrl(key)` if the bucket allows public GET. */
export async function uploadAdminMediaFile(params: {
  buffer: Buffer;
  originalFileName: string;
  contentType?: string;
}): Promise<{ key: string; url: string }> {
  const { client, bucket } = requireConfig();
  const safeBase = params.originalFileName
    .replace(/[^\w.\-]+/g, "_")
    .slice(0, 180);
  const key = `${ADMIN_MEDIA_PREFIX}/${randomUUID()}-${safeBase}`;
  const contentType =
    params.contentType?.trim() || guessContentType(params.originalFileName);

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: params.buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000",
    }),
  );

  return { key, url: publicObjectUrl(key) };
}

export async function getObjectBuffer(key: string): Promise<Buffer> {
  const { client, bucket } = requireConfig();
  const response = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key }),
  );
  if (!response.Body) {
    throw new Error(`Empty S3 object: ${key}`);
  }
  const bytes = await response.Body.transformToByteArray();
  return Buffer.from(bytes);
}

export async function deleteObjectByUrl(url: string): Promise<void> {
  const key = objectKeyFromPublicUrl(url);
  if (!key) {
    console.warn("deleteObjectByUrl: URL not from this bucket, skipping", url);
    return;
  }
  await deleteObjectByKey(key);
}

export async function deleteObjectByKey(key: string): Promise<void> {
  const { client, bucket } = requireConfig();
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}
