/**
 * Dump PostgreSQL to a temp file, upload to S3, prune old backups.
 *
 * Usage:
 *   npm run db:backup:s3
 *   BACKUP_RETENTION_DAYS=30 npm run db:backup:s3
 *
 * Env: DB_URI, AWS_REGION, AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
 * Optional: BACKUP_RETENTION_DAYS (default 14), PGSSLMODE (default require),
 *             PG_DUMP (path to pg_dump, must match server major version)
 */
import { config } from "dotenv";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

config({ path: ".env" });

const S3_PREFIX = "db-backups/";
const RETENTION_DAYS = Math.max(
  1,
  parseInt(process.env.BACKUP_RETENTION_DAYS ?? "14", 10),
);

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}. Set it in .env or the environment.`);
  }
  return value;
}

function timestamp(): string {
  return new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "-")
    .slice(0, 19);
}

function resolvePgDump(): string {
  const candidates = [
    process.env.PG_DUMP?.trim(),
    "/opt/homebrew/opt/postgresql@17/bin/pg_dump",
    "/opt/homebrew/opt/postgresql@16/bin/pg_dump",
    "/usr/local/opt/postgresql@17/bin/pg_dump",
    "/usr/local/opt/postgresql@16/bin/pg_dump",
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  try {
    execFileSync("pg_dump", ["--version"], { stdio: "ignore" });
    return "pg_dump";
  } catch {
    throw new Error(
      "pg_dump not found. Install PostgreSQL 16+ client tools:\n" +
        "  brew install postgresql@16\n" +
        "Then set PG_DUMP=/opt/homebrew/opt/postgresql@16/bin/pg_dump in .env",
    );
  }
}

function createDump(dbUri: string, stamp: string): { dir: string; filePath: string } {
  const pgDump = resolvePgDump();
  const version = execFileSync(pgDump, ["--version"], { encoding: "utf8" }).trim();
  console.log(`Using ${pgDump} (${version})`);

  const dir = mkdtempSync(join(tmpdir(), "gkg-db-backup-"));
  const filePath = join(dir, `gkg-vyaspuja-${stamp}.dump`);

  console.log("Creating pg_dump backup...");
  try {
    execFileSync(
      pgDump,
      [dbUri, "--format=custom", "--no-owner", "--no-acl", `--file=${filePath}`],
      {
        env: {
          ...process.env,
          PGSSLMODE: process.env.PGSSLMODE ?? "require",
        },
        stdio: "inherit",
      },
    );
  } catch {
    throw new Error(
      "pg_dump failed. If you see a version mismatch, install PostgreSQL 16 client:\n" +
        "  brew install postgresql@16\n" +
        "  PG_DUMP=/opt/homebrew/opt/postgresql@16/bin/pg_dump",
    );
  }

  return { dir, filePath };
}

async function uploadDump(
  client: S3Client,
  bucket: string,
  filePath: string,
  key: string,
): Promise<void> {
  const body = readFileSync(filePath);
  console.log(`Uploading to s3://${bucket}/${key} (${body.length} bytes)...`);

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: "application/octet-stream",
      ServerSideEncryption: "AES256",
    }),
  );
}

async function pruneOldBackups(
  client: S3Client,
  bucket: string,
): Promise<number> {
  const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
  let deleted = 0;
  let continuationToken: string | undefined;

  do {
    const listed = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: S3_PREFIX,
        ContinuationToken: continuationToken,
      }),
    );

    for (const object of listed.Contents ?? []) {
      if (!object.Key || !object.LastModified) continue;
      if (object.LastModified.getTime() >= cutoff) continue;

      await client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: object.Key,
        }),
      );
      deleted += 1;
      console.log(`Deleted old backup: ${object.Key}`);
    }

    continuationToken = listed.IsTruncated
      ? listed.NextContinuationToken
      : undefined;
  } while (continuationToken);

  return deleted;
}

async function main() {
  const dbUri = requireEnv("DB_URI");
  const region = requireEnv("AWS_REGION");
  const bucket = requireEnv("AWS_S3_BUCKET");

  const client = new S3Client({
    region,
    credentials: {
      accessKeyId: requireEnv("AWS_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("AWS_SECRET_ACCESS_KEY"),
    },
  });

  const stamp = timestamp();
  const { dir, filePath } = createDump(dbUri, stamp);
  const key = `${S3_PREFIX}gkg-vyaspuja-${stamp}.dump`;

  try {
    await uploadDump(client, bucket, filePath, key);
    const removed = await pruneOldBackups(client, bucket);
    console.log(
      `Backup complete: s3://${bucket}/${key} (retention ${RETENTION_DAYS} days, removed ${removed} old file(s))`,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
