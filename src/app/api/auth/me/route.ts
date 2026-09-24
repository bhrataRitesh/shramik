import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    let userDetails = {
      id: session.userId,
      phone: session.phone,
      role: session.role,
      name: session.name || "User",
      walletBalance: 0,
      isEShramVerified: false,
      isPhoneVerified: true,
    };

    try {
      await connectToDatabase();
      const dbUser = await User.findOne({ phone: session.phone });
      if (dbUser) {
        userDetails = {
          id: dbUser._id.toString(),
          phone: dbUser.phone || session.phone,
          role: (dbUser.activeRole as "hirer" | "labourer") || session.role,
          name: dbUser.fullName || session.name || "User",
          walletBalance: dbUser.walletBalance || 0,
          isEShramVerified: dbUser.isEShramVerified || false,
          isPhoneVerified: dbUser.isPhoneVerified || true,
        };
      }
    } catch {
      // Return session details if DB is offline
    }

    return NextResponse.json({
      authenticated: true,
      user: userDetails,
    });
  } catch (error) {
    console.error("Auth session fetch error:", error);
    return NextResponse.json(
      { authenticated: false, error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}
