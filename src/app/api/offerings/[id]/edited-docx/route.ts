import { NextRequest, NextResponse } from "next/server";
import { getOfferingForEditedDocxDownload } from "@/app/(admin)/actions/admin";
import { canManageOfferings } from "@/lib/auth";
import {
  buildOfferingEditedDocxBuffer,
  offeringEditedDocxFileName,
} from "@/lib/offerings-export";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  if (!(await canManageOfferings())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const row = await getOfferingForEditedDocxDownload(id);
  if (!row) {
    return NextResponse.json({ error: "Offering not found" }, { status: 404 });
  }

  const buffer = await buildOfferingEditedDocxBuffer(row.offering);
  const fileName = offeringEditedDocxFileName({
    offeringId: row.id,
    documentUrl: row.documentUrl,
    firstName: row.user.firstName,
    lastName: row.user.lastName,
    phone: row.user.phone,
    stateName: row.stateName,
    cityName: row.cityName,
    templeName: row.templeName,
    otherTempleName: row.user.otherTempleName,
  });

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
