import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { connectToDatabase } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { LedgerTransaction } from "@/models/LedgerTransaction";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    // Verify webhook authenticity
    if (
      process.env.RAZORPAY_WEBHOOK_SECRET &&
      process.env.RAZORPAY_WEBHOOK_SECRET !== "shramik_webhook_secret_local"
    ) {
      const isValid = verifyWebhookSignature(rawBody, signature);
      if (!isValid) {
        console.warn("[Razorpay Webhook] Invalid webhook signature rejected");
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 400 }
        );
      }
    }

    const event = JSON.parse(rawBody);
    console.log(`[Razorpay Webhook] Received Event: ${event.event}`);

    await connectToDatabase();

    // Handle payment capture / order paid events
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload?.payment?.entity;
      const paymentId = payment?.id;
      const orderId = payment?.order_id;
      const amount = (payment?.amount || 0) / 100; // paise to INR

      if (paymentId) {
        // Idempotency check: Don't process twice
        const alreadyRecorded = await LedgerTransaction.findOne({
          razorpayPaymentId: paymentId,
        });

        if (!alreadyRecorded) {
          // Find booking by razorpayOrderId if present
          let booking = null;
          if (orderId) {
            booking = await Booking.findOne({ razorpayOrderId: orderId });
          }

          if (booking) {
            booking.escrowStatus = "funds_held";
            booking.status = "confirmed";
            booking.paymentTxnId = paymentId;
            await booking.save();
          }

          // Record to double-entry ledger
          await LedgerTransaction.create({
            bookingId: booking?._id,
            type: "escrow_deposit",
            amount,
            fromAccount: `Hirer (${payment?.contact || paymentId})`,
            toAccount: "Shramik Escrow Pool",
            razorpayPaymentId: paymentId,
            razorpayOrderId: orderId,
            status: "settled",
            description: `Webhook verified escrow deposit for order ${orderId || "direct"}`,
            metadata: {
              method: payment?.method,
              vpa: payment?.vpa,
              bank: payment?.bank,
            },
          });

          console.log(
            `[Razorpay Webhook] Escrow locked ₹${amount} for Booking ${booking?._id || "unlinked"}`
          );
        }
      }
    }

    return NextResponse.json({ status: "ok", received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook handler failed";
    console.error("[Razorpay Webhook Error]:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
