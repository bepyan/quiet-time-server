import { IQTContent } from "@types";
import mongoose from "mongoose";

export const QTContentModel = mongoose.model<IQTContent>(
  "QTContent",
  new mongoose.Schema({
    contentType: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    range: {
      text: String,
      book: String,
      start: { capter: Number, verse: Number },
      end: { caper: Number, verse: Number },
    },
    commentaries: [{ type: String }],
    verses: [
      {
        capter: Number,
        verse: Number,
        text: { type: String, required: true },
      },
    ],
  })
);
