import { IUser } from "@types";
import mongoose from "mongoose";

export const UserModel = mongoose.model<IUser>(
  "User",
  new mongoose.Schema({
    name: { type: String, required: true },
    notions: [
      {
        key: String,
        database_id: String,
        contentType: String,
      },
    ],
    create_date: { type: Date, default: Date.now },
  })
);
