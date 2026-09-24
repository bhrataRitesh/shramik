import { NextRequest, NextResponse } from "next/server";
import { verifyOtp, formatE164 } from "@/lib/twilio";
import { signSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const { phone, otp, name, role = "labourer" } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: "Phone number and verification OTP are required" },
        { status: 400 }
      );
    }

    // 1. Verify OTP token via Twilio / sandbox
    const verification = await verifyOtp(phone, otp);
    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: verification.message },
        { status: 400 }
      );
    }

    const formattedPhone = formatE164(phone);
    let userId = "user_" + formattedPhone.replace(/\D/g, "");
    let fullName = name?.trim() || (role === "hirer" ? "Employer" : "Artisan Partner");

    // 2. Persist or fetch User in MongoDB (with graceful fallback if DB is temporarily unreachable)
    try {
      await connectToDatabase();
      let userDoc = await User.findOne({ phone: formattedPhone });

      if (!userDoc) {
        userDoc = await User.create({
          phone: formattedPhone,
          fullName: fullName,
          username: "shramik_" + formattedPhone.slice(-6),
          role: role === "hirer" ? "employer" : "worker",
          activeRole: role === "hirer" ? "hirer" : "labourer",
          isPhoneVerified: true,
          walletBalance: 0,
        });
      } else {
        if (name && name.trim()) {
          userDoc.fullName = name.trim();
        }
        userDoc.isPhoneVerified = true;
        if (role) {
          userDoc.activeRole = role === "hirer" ? "hirer" : "labourer";
        }
        await userDoc.save();
      }

      userId = userDoc._id.toString();
      fullName = userDoc.fullName || fullName;
    } catch (dbErr: unknown) {
      console.warn("MongoDB user upsert skipped, utilizing session token:", dbErr);
    }

    // 3. Issue cryptographically signed 30-day JWT session token
    const token = await signSessionToken({
      userId,
      phone: formattedPhone,
      role: role === "hirer" ? "hirer" : "labourer",
      name: fullName,
    });

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: {
        id: userId,
        phone: formattedPhone,
        name: fullName,
        role: role === "hirer" ? "hirer" : "labourer",
        isPhoneVerified: true,
      },
      token,
    });

    // 4. Set HttpOnly secure cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Verification failed";
    console.error("OTP verification error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
