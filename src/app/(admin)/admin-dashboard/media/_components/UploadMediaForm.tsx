"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  uploadAdminMediaAction,
  type UploadAdminMediaResult,
} from "@/app/(admin)/actions/admin-media";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
    >
      {pending ? "Uploading…" : "Upload to S3"}
    </button>
  );
}

export function UploadMediaForm() {
  const [state, formAction] = useActionState<
    UploadAdminMediaResult | undefined,
    FormData
  >(uploadAdminMediaAction, undefined);

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1">
          <label
            htmlFor="admin-media-file"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            File
          </label>
          <input
            id="admin-media-file"
            name="file"
            type="file"
            required
            className="block w-full text-sm text-gray-900 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        <SubmitButton />
      </div>
      {state?.ok === false && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state?.ok === true && (
        <p className="text-sm text-emerald-700">Uploaded successfully.</p>
      )}
    </form>
  );
}
