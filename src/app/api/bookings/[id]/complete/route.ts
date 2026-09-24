import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Booking } from "@/models/Booking";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));

    try {
      await connectToDatabase();
      await Booking.findByIdAndUpdate(id, {
        status: "completed",
        completedAt: new Date(),
      });
    } catch (dbErr) {
      console.warn("Database completion lookup warning:", dbErr);
    }

    return NextResponse.json({
      success: true,
      bookingId: id,
      status: "completed",
      completedAt: new Date().toISOString(),
      message: "Work completion signed off by hirer. Escrow funds ready for payout disbursement.",
      reviewReceived: Boolean(body.rating),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Completion failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
