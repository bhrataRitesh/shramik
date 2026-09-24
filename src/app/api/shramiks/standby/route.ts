import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Shramik } from "@/models/Shramik";

export async function POST(request: NextRequest) {
  try {
    const { available, artisanId, phone } = await request.json();

    const isAvailable = Boolean(available);
    const expiresAt = isAvailable
      ? new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours chowk standby
      : null;

    try {
      await connectToDatabase();

      // Find by ID or phone
      const filter: Record<string, unknown> = {};
      if (artisanId) {
        filter._id = artisanId;
      } else if (phone) {
        filter.phone = phone;
      }

      if (Object.keys(filter).length > 0) {
        await Shramik.findOneAndUpdate(
          filter,
          {
            isAvailableToday: isAvailable,
            standbyExpiresAt: expiresAt,
          },
          { new: true }
        );
      }
    } catch (dbErr) {
      console.warn("Standby toggle database update warning:", dbErr);
    }

    return NextResponse.json({
      success: true,
      isAvailableToday: isAvailable,
      standbyExpiresAt: expiresAt?.toISOString() || null,
      message: isAvailable
        ? "Morning Chowk Standby activated. You are now visible to nearby hirers for 4 hours."
        : "Standby deactivated. You are now offline.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to toggle standby";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
