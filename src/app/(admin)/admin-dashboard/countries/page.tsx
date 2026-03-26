import { getCountries } from "@/app/actions/admin";
import { AddCountryModal } from "./_components/AddCountryModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function CountriesPage() {
  const countries = await getCountries();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center whitespace-nowrap">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Countries
        </h1>
        <AddCountryModal />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Num Code</TableHead>
              <TableHead>Phone Code</TableHead>
              <TableHead>Currency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries.map((country) => (
              <TableRow key={country.id}>
                <TableCell className="font-medium text-gray-900">
                  {country.name}
                </TableCell>
                <TableCell>{country.nationality || "-"}</TableCell>
                <TableCell>{country.numericCode || "-"}</TableCell>
                <TableCell>{country.phoneCode || "-"}</TableCell>
                <TableCell>
                  {country.CurrencyName} (
                  {country.CurrencySymbol || country.currencyCode})
                </TableCell>
              </TableRow>
            ))}
            {countries.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-gray-500"
                >
                  No countries found. Add some above.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
