import { SearchQTContentDTO } from "@types";
import express from "express";
import { param } from "express-validator";
import { asyncErrorCatcher, decodeRequest, validatorErrorChecker } from "../middlewares";
import { CrawlerService, QTContentService } from "../services";

const router = express.Router();

router.use("/", decodeRequest);

router.get("/", asyncErrorCatcher(async (req, res) => {
    const content = await QTContentService.findAll()
    res.send(content);
}));

router.get(
    "/:contentType/:date",
    param("contentType").notEmpty().isIn(CrawlerService.crawlerKeyList),
    param("date").notEmpty(),
    validatorErrorChecker,
    asyncErrorCatcher(async (req, res) => {
        const { contentType, date } = req.params
        const content = await QTContentService.findOne({ contentType, date } as SearchQTContentDTO)
        res.send(content);
    })
);

export default router;
