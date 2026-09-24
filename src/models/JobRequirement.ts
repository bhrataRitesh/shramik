import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJobRequirement extends Document {
  hirerPhone: string;
  hirerName: string;
  title: string;
  tradeCategory: string;
  requiredArtisans: number;
  dailyWage: number;
  durationDays: number;
  totalBudget: number;
  siteLocation: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: string;
  city: string;
  description: string;
  status: "open" | "matched" | "in_progress" | "completed" | "cancelled";
  broadcastRadiusKm: number;
  applicants: mongoose.Types.ObjectId[];
  matchedArtisans: mongoose.Types.ObjectId[];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobRequirementSchema = new Schema<IJobRequirement>(
  {
    hirerPhone: { type: String, required: true, index: true },
    hirerName: { type: String, required: true },
    title: { type: String, required: true },
    tradeCategory: { type: String, required: true, index: true },
    requiredArtisans: { type: Number, default: 1 },
    dailyWage: { type: Number, required: true },
    durationDays: { type: Number, default: 1 },
    totalBudget: { type: Number, required: true },
    siteLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["open", "matched", "in_progress", "completed", "cancelled"],
      default: "open",
      index: true,
    },
    broadcastRadiusKm: { type: Number, default: 15 },
    applicants: [{ type: Schema.Types.ObjectId, ref: "Shramik" }],
    matchedArtisans: [{ type: Schema.Types.ObjectId, ref: "Shramik" }],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours expiry
      index: { expires: 0 }, // MongoDB TTL index to auto-delete expired jobs
    },
  },
  { timestamps: true }
);

JobRequirementSchema.index({ siteLocation: "2dsphere" });
JobRequirementSchema.index({ status: 1, tradeCategory: 1, city: 1 });

export const JobRequirement: Model<IJobRequirement> =
  mongoose.models.JobRequirement ||
  mongoose.model<IJobRequirement>("JobRequirement", JobRequirementSchema);

export default JobRequirement;
