import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Shramik } from "@/models/Shramik";
import { MOCK_SHRAMIKS } from "@/lib/mockData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      await connectToDatabase();
      const shramik = await Shramik.findById(id).populate("reviews").lean();
      if (shramik) {
        return NextResponse.json({ success: true, data: shramik });
      }
    } catch {
      // Continue to mock check
    }

    const found = MOCK_SHRAMIKS.find((s) => s._id === id);
    if (found) {
      return NextResponse.json({ success: true, data: found });
    }

    return NextResponse.json(
      { success: false, error: "Shramik not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error in GET /api/shramiks/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
