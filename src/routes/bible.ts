import express from "express";
import { param } from "express-validator";
import { asyncErrorCatcher, validatorErrorChecker } from "../middlewares";
import { CrawlerService } from "../services";

const router = express.Router();

router.use("/", (req, res, next) => {
  req.url = decodeURIComponent(req.url);
  next();
});

router.get(
  "/:contentType",
  param("contentType").notEmpty().isIn(CrawlerService.crawlerKeyList),
  validatorErrorChecker,
  asyncErrorCatcher(async (req, res) => {
    const content = await CrawlerService.parse(
      req.params.contentType as CrawlerService.CrawlerKey
    );
    res.send(content);
  })
);

export default router;
