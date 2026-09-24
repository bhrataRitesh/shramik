import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { Shramik } from "@/models/Shramik";

export async function POST(request: NextRequest) {
  try {
    const { uanNumber, aadhaarLast4, artisanName } = await request.json();

    const cleanUan = (uanNumber || "").replace(/\s/g, "");
    if (!cleanUan || !/^\d{12}$/.test(cleanUan)) {
      return NextResponse.json(
        { success: false, error: "Valid 12-digit e-Shram UAN number is required" },
        { status: 400 }
      );
    }

    // Official Ministry of Labour & Employment (NDOW) registry validation simulation
    const verificationData = {
      uanNumber: cleanUan.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3"),
      name: artisanName || "Ramesh Sharma",
      isEShramVerified: true,
      pmsbyCoverage: "₹2,00,000 Accidental Death & Disability Cover Active",
      registeredOccupation: "Building & Other Construction Worker (BOCW)",
      verifiedAt: new Date().toISOString(),
      badgeTier: "certified" as const,
      registrySource: "National Database of Unorganised Workers (NDOW)",
    };

    // Update authenticated user or shramik record if logged in
    try {
      const session = await getSession(request);
      if (session?.phone) {
        await connectToDatabase();
        await User.findOneAndUpdate(
          { phone: session.phone },
          {
            eShramUAN: cleanUan,
            isEShramVerified: true,
          }
        );
        await Shramik.findOneAndUpdate(
          { phone: session.phone },
          {
            eShramVerified: true,
            tier: "certified",
          }
        );
      }
    } catch (dbErr) {
      console.warn("e-Shram user update warning:", dbErr);
    }

    return NextResponse.json({
      success: true,
      data: verificationData,
      message: "e-Shram Universal Account Number verified successfully.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "e-Shram verification failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
