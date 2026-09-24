import crypto from "crypto";
import Razorpay from "razorpay";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "shramik_webhook_secret_local";

let razorpayInstance: Razorpay | null = null;

if (
  RAZORPAY_KEY_ID &&
  RAZORPAY_KEY_SECRET &&
  RAZORPAY_KEY_ID !== "rzp_test_placeholder"
) {
  try {
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  } catch (err) {
    console.warn("Failed to initialize Razorpay SDK:", err);
  }
}

/**
 * Creates an Escrow order via Razorpay SDK or resilient sandbox order
 */
export async function createRazorpayOrder(options: {
  amountInINR: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<{
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  isSandbox: boolean;
}> {
  const amountInPaise = Math.round(options.amountInINR * 100);

  if (razorpayInstance) {
    try {
      const order = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: options.receipt,
        notes: options.notes,
      });

      return {
        id: order.id,
        amount: Number(order.amount),
        currency: order.currency,
        receipt: order.receipt || options.receipt,
        isSandbox: false,
      };
    } catch (err) {
      console.warn("Razorpay API order creation failed, using sandbox fallback:", err);
    }
  }

  // Resilient Sandbox Order
  const sandboxOrderId = `order_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString().slice(-4)}`;
  return {
    id: sandboxOrderId,
    amount: amountInPaise,
    currency: "INR",
    receipt: options.receipt,
    isSandbox: true,
  };
}

/**
 * Verifies Razorpay checkout HMAC SHA256 signature
 */
export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!RAZORPAY_KEY_SECRET || RAZORPAY_KEY_SECRET === "placeholder_secret") {
    // Sandbox auto-pass for test signatures
    return true;
  }

  const generatedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");

  return generatedSignature === params.signature;
}

/**
 * Verifies Razorpay Webhook signature
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null
): boolean {
  if (!signature) return false;

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "utf-8"),
      Buffer.from(expectedSignature, "utf-8")
    );
  } catch {
    return false;
  }
}
