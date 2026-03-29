import { NextRequest, NextResponse } from "next/server";
import { canManageOfferings } from "@/lib/auth";
import { getAdminOfferingsForExport } from "@/app/(admin)/actions/admin";
import {
  buildOfferingsDocxBuffer,
  buildOfferingsXlsxBuffer,
} from "@/lib/offerings-export";

export const runtime = "nodejs";

function parseFilters(searchParams: URLSearchParams) {
  return {
    countryId: searchParams.get("country") || undefined,
    stateId: searchParams.get("state") || undefined,
    cityId: searchParams.get("city") || undefined,
    templeId: searchParams.get("temple") || undefined,
    language: searchParams.get("language") || undefined,
    dateFrom: searchParams.get("dateFrom") || undefined,
    dateTo: searchParams.get("dateTo") || undefined,
  };
}

function filenameStem() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `offerings-${y}-${m}-${day}`;
}

export async function GET(request: NextRequest) {
  if (!(await canManageOfferings())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");
  if (format !== "xlsx" && format !== "docx") {
    return NextResponse.json(
      { error: "Invalid or missing format. Use format=xlsx or format=docx." },
      { status: 400 },
    );
  }

  const rows = await getAdminOfferingsForExport(parseFilters(searchParams));

  if (format === "xlsx") {
    const buffer = buildOfferingsXlsxBuffer(rows);
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filenameStem()}.xlsx"`,
      },
    });
  }

  const buffer = await buildOfferingsDocxBuffer(rows);
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filenameStem()}.docx"`,
    },
  });
}
