import { Response } from "express";
import JournalEntry from "../models/JournalEntry";
import { AuthRequest } from "../middleware/auth";

export const createEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, mood, tags } = req.body;

    const entry = await JournalEntry.create({
      userId: req.userId,
      title,
      content,
      mood,
      tags,
    });

    res.status(201).json({ message: "Journal entry created", entry });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getEntries = async (req: AuthRequest, res: Response) => {
  try {
    const entries = await JournalEntry.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json(entries);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getEntry = async (req: AuthRequest, res: Response) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json(entry);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEntry = async (req: AuthRequest, res: Response) => {
  try {
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({ message: "Entry updated", entry });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEntry = async (req: AuthRequest, res: Response) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({ message: "Entry deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
