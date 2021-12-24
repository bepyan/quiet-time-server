import { SearchQTContentDTO } from "@types";
import express from "express";
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
    const content = await QTContentService.findOne({
      contentType,
      date: Time.toYMD(),
    } as SearchQTContentDTO);
    res.send(content);
  })
);

router.get(
  "/:contentType/:date",
  param("contentType").notEmpty().isIn(CrawlerService.crawlerKeyList),
  param("date").notEmpty(),
  validatorErrorChecker,
  asyncErrorCatcher(async (req, res) => {
    const { contentType, date } = req.params;
    const content = await QTContentService.findOne({
      contentType,
      date,
    } as SearchQTContentDTO);
    res.send(content);
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

router.post("/collect", asyncErrorCatcher(QTContentService.collectContent));

export default router;
