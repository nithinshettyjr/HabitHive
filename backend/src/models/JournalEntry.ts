import mongoose, { Schema, Document } from "mongoose";

export interface IJournalEntry extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  mood: "😊" | "🙏" | "😴" | "🤔" | "😢" | "😡" | "🥳";
  date: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const journalEntrySchema = new Schema(
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
    content: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      enum: ["😊", "🙏", "😴", "🤔", "😢", "😡", "🥳"],
      default: "😊",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.model<IJournalEntry>("JournalEntry", journalEntrySchema);
