import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "INR", workerName, days } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid payment amount required" },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(amount * 100);
    const orderId = "order_" + Math.random().toString(36).substring(2, 12).toUpperCase();

    console.log(`[Razorpay Escrow Gateway] Generated Order: ${orderId} | Amount: ₹${amount} (${amountInPaise} paise)`);

    return NextResponse.json({
      success: true,
      orderId,
      amount: amountInPaise,
      currency,
      keyId: "rzp_test_shramik_live",
      notes: {
        platform: "Shramik 2.0 Escrow System",
        worker: workerName || "Artisan",
        days: days || 1,
        policy: "100% Escrow Guaranteed upon OTP site check-in",
      },
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate Razorpay order" },
      { status: 500 }
    );
  }
}
