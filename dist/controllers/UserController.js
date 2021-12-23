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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.unSubscriptNotion = exports.subscriptNotion = exports.createNotion = exports.create = exports.findOne = exports.findAll = void 0;
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../middlewares");
const services_1 = require("../services");
/* ---------------- GET ---------------- */
const findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield services_1.UserService.findAll();
    res.send(data);
});
exports.findAll = findAll;
exports.findOne = [
    (0, express_validator_1.param)("name").notEmpty(),
    middlewares_1.validatorErrorChecker,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield services_1.UserService.findUser({ name: req.params.name });
        res.send(data);
    }),
];
/* ---------------- POST ---------------- */
exports.create = [
    (0, express_validator_1.body)("name").notEmpty(),
    (0, express_validator_1.body)("notion_auth").notEmpty(),
    middlewares_1.validatorErrorChecker,
    (0, middlewares_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, notion_auth } = req.body;
        const user = yield services_1.UserService.createUser({ name, notion_auth });
        res.send(user);
    })),
];
exports.createNotion = [
    (0, express_validator_1.param)("name").notEmpty(),
    (0, express_validator_1.body)("page_id").notEmpty(),
    (0, express_validator_1.body)("contentType").notEmpty().isIn(services_1.CrawlerService.crawlerKeyList),
    middlewares_1.validatorErrorChecker,
    (0, middlewares_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name } = req.params;
        const { page_id, contentType } = req.body;
        const user = yield services_1.UserService.findUser({ name });
        if (!user) {
            (0, middlewares_1.generateError)({ status: 400, message: "일치된 사용자가 없습니다." });
            return;
        }
        const { notion_auth } = user;
        const database = yield services_1.NotionService.createQTDatabase({
            notion_auth,
            page_id,
        });
        const database_id = database.id;
        yield services_1.NotionService.createQTPage({
            notion_auth,
            database_id,
            contentType,
        });
        const result = yield services_1.UserService.addNotion({
            name,
            notion: { database_id, contentType },
        });
        res.send(result);
    })),
];
exports.subscriptNotion = [
    (0, express_validator_1.param)("name").notEmpty(),
    (0, express_validator_1.body)("notion").notEmpty(),
    middlewares_1.validatorErrorChecker,
    (0, middlewares_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name } = req.params;
        const { notion } = req.body;
        //  중복된 구독이면 에러
        if (yield services_1.UserService.hasSubscript({ name, notion })) {
            (0, middlewares_1.generateError)({ status: 400, message: "중복된 구독정보가 있습니다." });
            return;
        }
        const result = yield services_1.UserService.addNotion({ name, notion });
        res.send(result);
    })),
];
exports.unSubscriptNotion = [
    (0, express_validator_1.param)("name").notEmpty(),
    (0, express_validator_1.body)("notion").notEmpty(),
    middlewares_1.validatorErrorChecker,
    (0, middlewares_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name } = req.params;
        const { notion } = req.body;
        const user = yield services_1.UserService.deleteNotion({ name, notion });
        res.send(user);
    })),
];
/* ---------------- UPDATE ---------------- */
/* ---------------- DELETE ---------------- */
exports.deleteUser = [
    (0, express_validator_1.body)("name").notEmpty(),
    middlewares_1.validatorErrorChecker,
    (0, middlewares_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield services_1.UserService.deleteUser(req.body.name);
        res.send(user);
    })),
];
//# sourceMappingURL=UserController.js.map