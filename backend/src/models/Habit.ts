import mongoose, { Schema, Document } from "mongoose";

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: "Health" | "Fitness" | "Learning" | "Productivity" | "Finance" | "Mindfulness" | "Custom";
  description?: string;
  color: string;
  targetPerMonth: number;
  streak: number;
  completedDates: Date[];
  createdAt: Date;
  updatedAt: Date;
}

const habitSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Health", "Fitness", "Learning", "Productivity", "Finance", "Mindfulness", "Custom"],
      default: "Custom",
    },
    description: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#4F46E5",
    },
    targetPerMonth: {
      type: Number,
      default: 30,
    },
    streak: {
      type: Number,
      default: 0,
    },
    completedDates: [
      {
        type: Date,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IHabit>("Habit", habitSchema);
