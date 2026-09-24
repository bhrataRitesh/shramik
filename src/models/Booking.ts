import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  shramikId: mongoose.Types.ObjectId;
  employerName: string;
  employerPhone: string;
  workerName: string;
  tradeCategory: string;
  workDescription: string;
  siteAddress: string;
  startDate: string;
  daysNeeded: number;
  dailyRate: number;
  totalAmount: number;
  escrowStatus: "pending_deposit" | "funds_held" | "released" | "refunded" | "disputed";
  status: "requested" | "confirmed" | "checked_in" | "completed" | "cancelled";
  checkInOtp: string;
  exitOtp: string;
  checkedInAt?: Date;
  completedAt?: Date;
  paymentMethod: "upi" | "cash_escrow" | "card";
  paymentTxnId?: string;
  payoutTxnId?: string;
  razorpayOrderId?: string;
  checkInOtpHash?: string;
  siteCoordinates?: [number, number];
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    shramikId: { type: Schema.Types.ObjectId, ref: "Shramik", required: true },
    employerName: { type: String, required: true },
    employerPhone: { type: String, required: true },
    workerName: { type: String, required: true },
    tradeCategory: { type: String, required: true },
    workDescription: { type: String, default: "" },
    siteAddress: { type: String, required: true },
    startDate: { type: String, required: true },
    daysNeeded: { type: Number, default: 1 },
    dailyRate: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    escrowStatus: {
      type: String,
      enum: ["pending_deposit", "funds_held", "released", "refunded", "disputed"],
      default: "funds_held",
    },
    status: {
      type: String,
      enum: ["requested", "confirmed", "checked_in", "completed", "cancelled"],
      default: "confirmed",
    },
    checkInOtp: { type: String, required: true },
    exitOtp: { type: String, required: true },
    checkedInAt: { type: Date },
    completedAt: { type: Date },
    paymentMethod: {
      type: String,
      enum: ["upi", "cash_escrow", "card"],
      default: "upi",
    },
    paymentTxnId: { type: String, index: true },
    payoutTxnId: { type: String, index: true },
    razorpayOrderId: { type: String, index: true },
    checkInOtpHash: { type: String },
    siteCoordinates: {
      type: [Number], // [lng, lat]
    },
  },
  { timestamps: true }
);

BookingSchema.index({ employerPhone: 1, createdAt: -1 });
BookingSchema.index({ shramikId: 1, status: 1 });
BookingSchema.index({ escrowStatus: 1 });

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
