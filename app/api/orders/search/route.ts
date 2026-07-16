import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimiter } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const rateCheck = rateLimiter(ip);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    const orders = await prisma.order.findMany({
      where: {
        orderId: { equals: query, mode: "insensitive" },
      },
      include: { timeline: { orderBy: { createdAt: "asc" } } },
      take: 5,
    });

    return NextResponse.json({ success: true, data: orders });
  } catch {
    return NextResponse.json(
      { success: false, error: "Search failed." },
      { status: 500 }
    );
  }
}
