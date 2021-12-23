import { IQTContent } from "@types";
import mongoose from "mongoose";

export const QTContentModel = mongoose.model<IQTContent>(
    "QTContent",
    new mongoose.Schema({
        contentType: { type: String, required: true },
        title: { type: String, required: true },
        date: { type: String, required: true },
        range: { type: String, required: true },
        commentaries: [{ type: String }],
        verses: [
            {
                verse: String,
                text: { type: String, required: true }
            }
        ],
    })
)
