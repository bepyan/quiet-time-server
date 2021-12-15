import { Crawler } from "@utils";
import express from "express";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const content = await Crawler.parseQTContent();
    res.send(content);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
