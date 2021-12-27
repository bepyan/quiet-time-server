import { SearchQTContentDTO } from "@types";
import express, { query } from "express";
import { param } from "express-validator";
import {
  asyncErrorCatcher,
  decodeRequest,
  generateError,
  validatorErrorChecker,
} from "../middlewares";
import { CrawlerService, QTContentService, UserService } from "../services";
import { Time } from "../utils";

const router = express.Router();

router.use("/", decodeRequest);

/* ---------------- get ---------------- */

router.get(
  "/",
  asyncErrorCatcher(async (req, res) => {
    const content = await QTContentService.findAll();
    res.send(content);
  })
);

router.get(
  "/:contentType",
  param("contentType").notEmpty().isIn(CrawlerService.crawlerKeyList),
  validatorErrorChecker,
  asyncErrorCatcher(async (req, res) => {
    const { contentType } = req.params;
    const date = req.query.date || Time.toYMD();

    const content = await QTContentService.findOne({
      contentType,
      date,
    } as SearchQTContentDTO);
    res.send(content);
  })
);

/* ---------------- post ---------------- */

router.post(
  "/collect",
  asyncErrorCatcher(async (req, res) => {
    await QTContentService.collectContent();
    res.json({ message: "done" });
  })
);

router.post(
  "/:name",
  param("name").notEmpty(),
  validatorErrorChecker,
  asyncErrorCatcher(async (req, res) => {
    const { name } = req.params;
    const user = await UserService.findUser({ name });
    if (!user)
      return generateError({
        status: 404,
        message: "해당 유저를 찾을 수 없습니다.",
      });

    const job_done = await QTContentService.publishToOneUser(user);
    res.json({ job_done });
  })
);

/* ---------------- delete ---------------- */

router.delete(
  "/today",
  asyncErrorCatcher(async (req, res) => {
    const result = await QTContentService.deleteToday();
    return res.send(result);
  })
);

export default router;
