import { asyncErrorCatcher } from "@middlewares";
import { CrawlerService } from "@services";
import express from "express";

const router = express.Router();

router.use("/", (req, res, next) => {
  req.url = decodeURIComponent(req.url);
  next();
});

router.get(
  "/생명의삶",
  asyncErrorCatcher(async (req, res) => {
    const content = await CrawlerService.parse("생명의삶");
    res.send(content);
  })
);

router.get(
  "/매일성경",
  asyncErrorCatcher(async (req, res) => {
    const content = await CrawlerService.parse("매일성경");
    res.send(content);
  })
);

export default router;
