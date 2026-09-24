import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Shramik } from "@/models/Shramik";
import { MOCK_SHRAMIKS } from "@/lib/mockData";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Check existing count
    const existingCount = await Shramik.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already populated with ${existingCount} Shramiks.`,
      });
    }

    const cleaned = MOCK_SHRAMIKS.map(({ _id, ...rest }) => rest);
    const inserted = await Shramik.insertMany(cleaned);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${inserted.length} Shramiks into MongoDB.`,
      count: inserted.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
        suggestion: "Ensure MongoDB Atlas cluster is online and reachable.",
      },
      { status: 500 }
    );
  }
}
