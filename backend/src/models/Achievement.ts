import mongoose, { Schema, Document } from "mongoose";

export interface IAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  createdAt: Date;
}

const achievementSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "🏆",
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAchievement>("Achievement", achievementSchema);
