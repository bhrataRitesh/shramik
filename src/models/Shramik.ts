import mongoose, { Schema, Document, Model } from "mongoose";

export interface IImage {
  url: string;
  filename: string;
}

export interface IShramik extends Document {
  title: string;
  name: string;
  tradeCategory: string;
  skills: string[];
  phone: string;
  image: IImage[];
  price: number; // daily wage in INR
  dailyWageRate: number;
  hourlyRate?: number;
  experienceYears: number;
  description: string;
  voiceBioUrl?: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  city: string;
  locality: string;
  address: string;
  isAvailableToday: boolean;
  eShramVerified: boolean;
  aadhaarVerified: boolean;
  skillCertified: boolean;
  tier: "basic" | "verified" | "certified" | "master";
  rating: number;
  totalReviews: number;
  completedJobs: number;
  crewSize: number;
  author?: mongoose.Types.ObjectId;
  reviews: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>({
  url: { type: String, required: true },
  filename: { type: String, default: "" },
});

const ShramikSchema = new Schema<IShramik>(
  {
    title: { type: String, required: true },
    name: { type: String, default: "" },
    tradeCategory: {
      type: String,
      default: "General Labor",
      index: true,
    },
    skills: [{ type: String }],
    phone: { type: String, default: "" },
    image: [ImageSchema],
    price: { type: Number, required: true },
    dailyWageRate: { type: Number, default: 0 },
    hourlyRate: { type: Number, default: 0 },
    experienceYears: { type: Number, default: 1 },
    description: { type: String, required: true },
    voiceBioUrl: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [77.5946, 12.9716], // Default Bengaluru [lng, lat]
      },
    },
    city: { type: String, default: "Bengaluru", index: true },
    locality: { type: String, default: "" },
    address: { type: String, default: "" },
    isAvailableToday: { type: Boolean, default: true, index: true },
    eShramVerified: { type: Boolean, default: false },
    aadhaarVerified: { type: Boolean, default: false },
    skillCertified: { type: Boolean, default: false },
    tier: {
      type: String,
      enum: ["basic", "verified", "certified", "master"],
      default: "verified",
    },
    rating: { type: Number, default: 4.8 },
    totalReviews: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 12 },
    crewSize: { type: Number, default: 1 },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 2dsphere index for high-speed hyperlocal geo-dispatch queries
ShramikSchema.index({ location: "2dsphere" });

export const Shramik: Model<IShramik> =
  mongoose.models.Shramik || mongoose.model<IShramik>("Shramik", ShramikSchema);

export default Shramik;
