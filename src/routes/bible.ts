import express from "express";
import { param } from "express-validator";
import {
  asyncErrorCatcher,
  decodeRequest,
  validatorErrorChecker,
} from "../middlewares";
import { CrawlerService } from "../services";

const router = express.Router();

router.use("/", decodeRequest);

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
