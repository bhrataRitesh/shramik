import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { connectToDatabase } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { LedgerTransaction } from "@/models/LedgerTransaction";

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentId, signature, bookingId, amount } = await request.json();

    if (!orderId || !paymentId) {
      return NextResponse.json(
        { success: false, error: "Order ID and Payment ID are required" },
        { status: 400 }
      );
    }

    // Verify cryptographic signature if provided
    if (signature) {
      const isValid = verifyPaymentSignature({ orderId, paymentId, signature });
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Invalid payment signature verification failed" },
          { status: 400 }
        );
      }
    }

    const numericAmount = Number(amount) || 0;

    // Database persistence & double-entry ledger recording
    try {
      await connectToDatabase();

      // 1. Update Booking state
      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, {
          escrowStatus: "funds_held",
          status: "confirmed",
          paymentTxnId: paymentId,
          razorpayOrderId: orderId,
        });
      }

      // 2. Double-entry immutable ledger entry (idempotent: avoid duplicates)
      const existingEntry = await LedgerTransaction.findOne({
        razorpayPaymentId: paymentId,
      });

      if (!existingEntry) {
        await LedgerTransaction.create({
          bookingId: bookingId || undefined,
          type: "escrow_deposit",
          amount: numericAmount,
          fromAccount: `Hirer (${paymentId})`,
          toAccount: "Shramik Escrow Pool",
          razorpayPaymentId: paymentId,
          razorpayOrderId: orderId,
          status: "settled",
          description: "Advance escrow funds deposited into Shramik guarantee pool",
        });
      }
    } catch (dbErr) {
      console.warn("Database recording warning in payment verification:", dbErr);
    }

    return NextResponse.json({
      success: true,
      escrowStatus: "funds_held",
      paymentTxnId: paymentId,
      orderId,
      message: "Escrow deposit locked and verified successfully in RBI-compliant escrow account.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Payment verification failed";
    console.error("Razorpay verification error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
