import { listAdminMedia } from "@/app/(admin)/actions/admin-media";
import { MediaTable } from "./_components/MediaTable";
import { UploadMediaForm } from "./_components/UploadMediaForm";

export default async function AdminMediaPage() {
  const rows = await listAdminMedia();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Media library
        </h1>
        <p className="mt-1 text-sm text-gray-600 max-w-2xl">
          Upload images, documents, or other files to your S3 bucket. Public URLs
          are listed below; ensure your bucket or object ACLs allow public read for
          these links to work in the browser.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Upload</h2>
        <UploadMediaForm />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900">Uploaded files</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {rows.length} file{rows.length === 1 ? "" : "s"}
          </p>
        </div>
        <MediaTable rows={rows} />
      </div>
    </div>
  );
}
