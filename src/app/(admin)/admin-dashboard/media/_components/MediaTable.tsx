"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteAdminMediaAction } from "@/app/(admin)/actions/admin-media";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type MediaRow = {
  id: string;
  publicUrl: string;
  fileName: string;
  contentType: string | null;
  createdAt: Date | string | null;
};

function formatDate(value: Date | string | null): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function RowActions({ id, url }: { id: string; url: string }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this URL:", url);
    }
  }

  async function remove() {
    if (!confirm("Remove this entry and delete the file from S3?")) return;
    setDeleting(true);
    try {
      await deleteAdminMediaAction(id);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => void copy()}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        {copied ? "Copied" : "Copy link"}
      </button>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        Open
      </a>
      <button
        type="button"
        onClick={() => void remove()}
        disabled={deleting}
        className="text-sm font-medium text-red-600 hover:text-red-500 disabled:opacity-50"
      >
        {deleting ? "…" : "Delete"}
      </button>
    </div>
  );
}

export function MediaTable({ rows }: { rows: MediaRow[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead>File name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="min-w-[280px]">Public URL</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead className="w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium text-gray-900 max-w-[200px] truncate">
                {row.fileName}
              </TableCell>
              <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                {row.contentType || "—"}
              </TableCell>
              <TableCell className="text-sm">
                <span className="break-all text-gray-800 line-clamp-3">
                  {row.publicUrl}
                </span>
              </TableCell>
              <TableCell className="text-sm whitespace-nowrap text-gray-600">
                {formatDate(row.createdAt)}
              </TableCell>
              <TableCell>
                <RowActions id={row.id} url={row.publicUrl} />
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-gray-500"
              >
                No uploads yet. Choose a file above to upload to S3.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
