"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../middlewares");
const services_1 = require("../services");
const utils_1 = require("../utils");
const router = express_1.default.Router();
router.use("/", middlewares_1.decodeRequest);
router.get("/", (0, middlewares_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const content = yield services_1.QTContentService.findAll();
    res.send(content);
})));
router.get("/:contentType", (0, express_validator_1.param)("contentType").notEmpty().isIn(services_1.CrawlerService.crawlerKeyList), middlewares_1.validatorErrorChecker, (0, middlewares_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contentType } = req.params;
    const content = yield services_1.QTContentService.findOne({
        contentType,
        date: utils_1.Time.toYMD(),
    });
    res.send(content);
})));
router.get("/:contentType/:date", (0, express_validator_1.param)("contentType").notEmpty().isIn(services_1.CrawlerService.crawlerKeyList), (0, express_validator_1.param)("date").notEmpty(), middlewares_1.validatorErrorChecker, (0, middlewares_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contentType, date } = req.params;
    const content = yield services_1.QTContentService.findOne({
        contentType,
        date,
    });
    res.send(content);
})));
router.post("/:name", (0, express_validator_1.param)("name").notEmpty(), middlewares_1.validatorErrorChecker, (0, middlewares_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    const user = yield services_1.UserService.findUser({ name });
    if (!user)
        return (0, middlewares_1.generateError)({
            status: 404,
            message: "해당 유저를 찾을 수 없습니다.",
        });
    const job_done = yield services_1.QTContentService.publishToOneUser(user);
    res.json({ job_done });
})));
router.post("/collect", (0, middlewares_1.asyncErrorCatcher)(services_1.QTContentService.collectContent));
exports.default = router;
//# sourceMappingURL=qt-content.js.map