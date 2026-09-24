import { NextRequest, NextResponse } from "next/server";
import { sendOtp } from "@/lib/twilio";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = body.phone?.toString().trim();

    if (!phone || phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { success: false, error: "Valid 10-digit mobile number is required" },
        { status: 400 }
      );
    }

    const result = await sendOtp(phone);

    return NextResponse.json({
      success: true,
      message: result.message,
      isSandbox: result.isSandbox,
      devOtp: result.devOtp, // available for instant local development/testing
      provider: result.isSandbox ? "Sandbox SMS Gateway" : "Twilio Verify Service",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to send OTP";
    console.error("OTP send error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 429 }
    );
  }
}
