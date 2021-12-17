import { CrawlerService } from "@services";
import express from "express";

const router = express.Router();

router.use("/", (req, res, next) => {
  req.url = decodeURIComponent(req.url);
  next();
});

router.get("/생명의삶", async (req, res) => {
  try {
    const content = await CrawlerService.parse("생명의삶");
    res.send(content);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/매일성경", async (req, res) => {
  try {
    const content = await CrawlerService.parse("매일성경");
    res.send(content);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
