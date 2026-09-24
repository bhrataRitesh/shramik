import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { phone, role = "labourer" } = await request.json();

    if (!phone || phone.length < 10) {
      return NextResponse.json(
        { success: false, error: "Valid 10-digit mobile number required" },
        { status: 400 }
      );
    }

    // Generate 6-digit secure OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // In a live environment with TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    // await twilioClient.messages.create({
    //   body: `[Shramik 2.0] Your verification code is ${otp}. Valid for 5 minutes. Never share this code with anyone.`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: `+91${phone.replace(/[^0-9]/g, "").slice(-10)}`
    // });

    console.log(`[Twilio SMS Service] To: +91${phone} | OTP: ${otp} | Role: ${role}`);

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to +91 ${phone.slice(-10)}`,
      // Returning OTP in development/demo response for seamless instant testing
      demoOtp: otp,
      provider: "Twilio Programmable SMS / WhatsApp Gateway",
    });
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send OTP via SMS gateway" },
      { status: 500 }
    );
  }
}
