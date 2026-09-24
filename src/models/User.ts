import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  phone?: string;
  email?: string;
  username?: string;
  fullName: string;
  role: "worker" | "employer" | "contractor" | "admin";
  activeRole?: "hirer" | "labourer" | "admin";
  avatar?: string;
  eShramUAN?: string;
  isEShramVerified?: boolean;
  isAadhaarVerified: boolean;
  isPhoneVerified: boolean;
  walletBalance: number;
  upiVpa?: string;
  preferredLanguage: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    phone: { type: String, sparse: true, index: true },
    email: { type: String, sparse: true },
    username: { type: String, sparse: true },
    fullName: { type: String, default: "" },
    role: {
      type: String,
      enum: ["worker", "employer", "contractor", "admin"],
      default: "employer",
    },
    activeRole: {
      type: String,
      enum: ["hirer", "labourer", "admin"],
      default: "hirer",
    },
    avatar: { type: String, default: "" },
    eShramUAN: { type: String, sparse: true },
    isEShramVerified: { type: Boolean, default: false },
    isAadhaarVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    walletBalance: { type: Number, default: 0 },
    upiVpa: { type: String, sparse: true },
    preferredLanguage: {
      type: String,
      default: "en",
    },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
