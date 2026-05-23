import { getMaintainersList } from "@/app/(admin)/actions/maintainers";
import { CreateMaintainerButton } from "./_components/CreateMaintainerButton";
import { EditMaintainerButton } from "./_components/EditMaintainerButton";
import { DeleteMaintainerButton } from "./_components/DeleteMaintainerButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ManageMaintainersPage() {
  const rows = await getMaintainersList();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center whitespace-nowrap gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Manage Maintainers
        </h1>
        <CreateMaintainerButton />
      </div>

      <p className="text-sm text-gray-600 max-w-2xl">
        Maintainers can sign in at{" "}
        <span className="font-mono text-gray-800">/maintainer</span> using the
        email and password you assign when creating their account.
      </p>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-mono text-sm">{row.loginId}</TableCell>
                <TableCell>{row.label ?? "—"}</TableCell>
                <TableCell className="text-sm text-gray-600">
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleString()
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1 justify-end">
                    <EditMaintainerButton row={row} />
                    <DeleteMaintainerButton
                      maintainerId={row.id}
                      loginId={row.loginId}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-gray-500"
                >
                  No maintainers yet. Use &quot;Add maintainer&quot; to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
