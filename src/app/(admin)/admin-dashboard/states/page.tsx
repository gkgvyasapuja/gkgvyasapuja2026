import { getStates, getCountries } from "@/app/actions/admin";
import { AddStateModal } from "./_components/AddStateModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function StatesPage() {
  const [states, countries] = await Promise.all([getStates(), getCountries()]);

  // mapping for quick lookup
  const countryMap = countries.reduce(
    (acc, country) => {
      acc[country.id] = country.name;
      return acc;
    },
    {} as Record<string, string>,
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center whitespace-nowrap">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          States
        </h1>
        <AddStateModal countries={countries} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Country</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {states.map((state) => (
              <TableRow key={state.id}>
                <TableCell className="font-medium text-gray-900">
                  {state.name}
                </TableCell>
                <TableCell>
                  {countryMap[state.countryId] || "Unknown"}
                </TableCell>
              </TableRow>
            ))}
            {states.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="h-24 text-center text-gray-500"
                >
                  No states found. Add some above.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
