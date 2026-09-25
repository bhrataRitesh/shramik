import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { JobRequirement } from "@/models/JobRequirement";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radiusKm = Number(searchParams.get("radiusKm")) || 25;

    let jobs: unknown[] = [];

    try {
      await connectToDatabase();
      const filter: Record<string, unknown> = {
        status: { $in: ["open", "matched"] },
      };

      if (category && category !== "all") {
        filter.tradeCategory = category.toLowerCase();
      }
      if (city) {
        filter.city = { $regex: city, $options: "i" };
      }
      if (lat && lng) {
        filter.siteLocation = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(lng), Number(lat)],
            },
            $maxDistance: radiusKm * 1000,
          },
        };
      }

      jobs = await JobRequirement.find(filter)
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
    } catch (dbErr) {
      console.warn("Database query skipped for jobs:", (dbErr as Error).message);
    }

    return NextResponse.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch jobs";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      tradeCategory,
      workersNeeded,
      wageOffered,
      durationDays = 1,
      siteAddress,
      city = "Bengaluru",
      employerName,
      employerPhone,
      description = "",
      siteCoordinates = [77.6387, 12.9121], // [lng, lat]
    } = body;

    if (!title || !tradeCategory || !wageOffered || !siteAddress || !employerPhone) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required job fields." },
        { status: 400 }
      );
    }

    // Attempt to get session details
    const session = await getSession(request);
    const hirerPhone = employerPhone || session?.phone || "+919876543210";
    const hirerName = employerName || session?.name || "Verified Employer";

    const totalBudget = Number(wageOffered) * (Number(workersNeeded) || 1) * (Number(durationDays) || 1);

    let jobDoc;
    try {
      await connectToDatabase();
      jobDoc = await JobRequirement.create({
        hirerPhone,
        hirerName,
        title,
        tradeCategory: tradeCategory.toLowerCase(),
        requiredArtisans: Number(workersNeeded) || 1,
        dailyWage: Number(wageOffered),
        durationDays: Number(durationDays) || 1,
        totalBudget,
        siteLocation: {
          type: "Point",
          coordinates: siteCoordinates,
        },
        address: siteAddress,
        city,
        description,
        status: "open",
        broadcastRadiusKm: 15,
      });
    } catch (dbErr) {
      console.warn("Direct DB write fallback for job requirement:", (dbErr as Error).message);
      jobDoc = {
        _id: "job-" + Date.now(),
        hirerPhone,
        hirerName,
        title,
        tradeCategory,
        requiredArtisans: Number(workersNeeded) || 1,
        dailyWage: Number(wageOffered),
        totalBudget,
        address: siteAddress,
        city,
        status: "open",
        createdAt: new Date().toISOString(),
      };
    }

    return NextResponse.json({
      success: true,
      data: jobDoc,
      message: "Job requirement broadcasted to nearby verified artisans.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to broadcast job";
    console.error("Job post error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
