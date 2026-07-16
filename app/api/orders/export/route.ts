import { NextResponse } from "next/server";
import { exportOrdersCsv } from "@/actions/orders";

export async function GET() {
  try {
    const result = await exportOrdersCsv();

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 403 }
      );
    }

    return new NextResponse(result.data, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=orders-${new Date().toISOString().split("T")[0]}.csv`,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Export failed." },
      { status: 500 }
    );
  }
}
