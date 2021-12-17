import express from "express";
import { Notion } from "@utils";
import { body } from "express-validator";
import { validatorErrorChecker } from "middlewares";

const router = express.Router();

router.post(
  "/",
  body("contentType").notEmpty(),
  validatorErrorChecker,
  async (req, res, next) => {
    try {
      const response = await Notion.addQTContent({
        key: process.env.NOTION_KEY!,
        database_id: process.env.NOTION_DATABASE_ID!,
        contentType: req.body.contentType,
      });
      res.json(response);
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

export default router;
