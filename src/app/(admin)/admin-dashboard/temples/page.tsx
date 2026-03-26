import { getTemples, getCities } from "@/app/actions/admin";
import { AddTempleModal } from "./_components/AddTempleModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function TemplesPage() {
  const [temples, cities] = await Promise.all([getTemples(), getCities()]);

  // mapping for quick lookup
  const cityMap = cities.reduce(
    (acc, city) => {
      acc[city.id] = city.name;
      return acc;
    },
    {} as Record<string, string>,
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center whitespace-nowrap">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Temples
        </h1>
        <AddTempleModal cities={cities} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>City</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {temples.map((temple) => (
              <TableRow key={temple.id}>
                <TableCell className="font-medium text-gray-900">
                  {temple.name}
                </TableCell>
                <TableCell>{cityMap[temple.cityId] || "Unknown"}</TableCell>
              </TableRow>
            ))}
            {temples.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="h-24 text-center text-gray-500"
                >
                  No temples found. Add some above.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
