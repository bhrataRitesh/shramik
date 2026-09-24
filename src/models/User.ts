import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  phone?: string;
  email: string;
  username: string;
  fullName: string;
  role: "worker" | "employer" | "contractor" | "admin";
  avatar?: string;
  eShramUAN?: string;
  isAadhaarVerified: boolean;
  preferredLanguage: "hi" | "en" | "mr" | "ta" | "te" | "bn";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    phone: { type: String, sparse: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    fullName: { type: String, default: "" },
    role: {
      type: String,
      enum: ["worker", "employer", "contractor", "admin"],
      default: "employer",
    },
    avatar: { type: String, default: "" },
    eShramUAN: { type: String, sparse: true },
    isAadhaarVerified: { type: Boolean, default: false },
    preferredLanguage: {
      type: String,
      enum: ["en", "hi", "mr", "ta", "te", "bn"],
      default: "en",
    },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
