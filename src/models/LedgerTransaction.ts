import mongoose, { Schema, Document, Model } from "mongoose";

export type TransactionType =
  | "escrow_deposit"
  | "escrow_payout"
  | "escrow_refund"
  | "dispute_freeze"
  | "platform_fee";

export interface ILedgerTransaction extends Document {
  bookingId?: mongoose.Types.ObjectId;
  type: TransactionType;
  amount: number; // in INR
  fromAccount: string;
  toAccount: string;
  utrNumber?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  payoutId?: string;
  status: "pending" | "settled" | "failed" | "reversed";
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const LedgerTransactionSchema = new Schema<ILedgerTransaction>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", index: true },
    type: {
      type: String,
      enum: [
        "escrow_deposit",
        "escrow_payout",
        "escrow_refund",
        "dispute_freeze",
        "platform_fee",
      ],
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    fromAccount: { type: String, required: true },
    toAccount: { type: String, required: true },
    utrNumber: { type: String, sparse: true, index: true },
    razorpayPaymentId: { type: String, sparse: true, index: true },
    razorpayOrderId: { type: String, sparse: true, index: true },
    payoutId: { type: String, sparse: true },
    status: {
      type: String,
      enum: ["pending", "settled", "failed", "reversed"],
      default: "settled",
      index: true,
    },
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

LedgerTransactionSchema.index({ createdAt: -1 });

export const LedgerTransaction: Model<ILedgerTransaction> =
  mongoose.models.LedgerTransaction ||
  mongoose.model<ILedgerTransaction>("LedgerTransaction", LedgerTransactionSchema);

export default LedgerTransaction;
