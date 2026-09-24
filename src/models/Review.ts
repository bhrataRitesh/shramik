import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  body: string;
  rating: number;
  reviewerName?: string;
  author?: mongoose.Types.ObjectId;
  shramik?: mongoose.Types.ObjectId;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    body: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewerName: { type: String, default: "Local Employer" },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    shramik: { type: Schema.Types.ObjectId, ref: "Shramik" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
