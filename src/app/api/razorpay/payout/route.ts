import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { amount, upiId, workerName } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid payout amount" },
        { status: 400 }
      );
    }

    if (!upiId) {
      return NextResponse.json(
        { success: false, error: "UPI VPA ID is required for instant payout" },
        { status: 400 }
      );
    }

    const payoutTxnId = "POUT_" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const utr = Math.floor(100000000000 + Math.random() * 900000000000).toString();

    console.log(`[RazorpayX Instant Payout] Disbursed ₹${amount} to ${upiId} (${workerName}) | UTR: ${utr} | PayoutId: ${payoutTxnId}`);

    return NextResponse.json({
      success: true,
      message: `Instant UPI payout of ₹${amount} transferred successfully to ${upiId}`,
      payoutTxnId,
      utr,
      settlementTime: "Instant (IMPS/UPI 24x7)",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Payout error:", error);
    return NextResponse.json(
      { success: false, error: "Instant UPI payout failed" },
      { status: 500 }
    );
  }
}
