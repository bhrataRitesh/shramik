import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import { connectToDatabase } from "@/lib/db";
import { Booking } from "@/models/Booking";

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "INR", workerName, days, bookingId, employerPhone } =
      await request.json();

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "A valid positive payment amount is required" },
        { status: 400 }
      );
    }

    const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const order = await createRazorpayOrder({
      amountInINR: numericAmount,
      receipt,
      notes: {
        platform: "Shramik 2.0 Escrow System",
        worker: workerName || "Artisan",
        days: String(days || 1),
        bookingId: bookingId || "",
        employerPhone: employerPhone || "",
      },
    });

    // If a bookingId is associated, store the order ID on the booking
    if (bookingId) {
      try {
        await connectToDatabase();
        await Booking.findByIdAndUpdate(bookingId, {
          razorpayOrderId: order.id,
          totalAmount: numericAmount,
        });
      } catch (dbErr) {
        console.warn("Could not attach order ID to booking:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
      isSandbox: order.isSandbox,
      notes: {
        platform: "Shramik 2.0 Escrow Guarantee",
        worker: workerName || "Artisan",
        days: days || 1,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate order";
    console.error("Razorpay order creation error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
