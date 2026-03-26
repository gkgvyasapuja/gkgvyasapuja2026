import { getCities, getStates } from "@/app/actions/admin";
import { AddCityModal } from "./_components/AddCityModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function CitiesPage() {
  const [cities, states] = await Promise.all([getCities(), getStates()]);

  // mapping for quick lookup
  const stateMap = states.reduce(
    (acc, state) => {
      acc[state.id] = state.name;
      return acc;
    },
    {} as Record<string, string>,
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center whitespace-nowrap">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Cities
        </h1>
        <AddCityModal states={states} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>State</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cities.map((city) => (
              <TableRow key={city.id}>
                <TableCell className="font-medium text-gray-900">
                  {city.name}
                </TableCell>
                <TableCell>{stateMap[city.stateId] || "Unknown"}</TableCell>
              </TableRow>
            ))}
            {cities.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="h-24 text-center text-gray-500"
                >
                  No cities found. Add some above.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
