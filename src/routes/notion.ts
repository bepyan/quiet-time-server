import express from "express";
import { Notion } from "@utils";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const response = await Notion.onAddQTContent({
      key: process.env.NOTION_KEY!,
      database_id: process.env.NOTION_DATABASE_ID!,
    });
    res.json(response);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
