import express from "express";
import { body } from "express-validator";
import { asyncErrorCatcher, validatorErrorChecker } from "../middlewares";
import { CrawlerService, NotionService } from "../services";

const router = express.Router();

router.post(
  "/",
  body("contentType").notEmpty().isIn(CrawlerService.crawlerKeyList),
  validatorErrorChecker,
  asyncErrorCatcher(async (req, res) => {
    const response = await NotionService.createQTPage({
      notion_auth: process.env.NOTION_KEY!,
      database_id: process.env.NOTION_DATABASE_ID!,
      contentType: req.body.contentType,
    });
    res.json(response);
  })
);

export default router;
