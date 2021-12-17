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
exports.deleteUser = exports.unSubscriptNotion = exports.subscriptNotion = exports.create = exports.findAll = void 0;
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../middlewares");
const services_1 = require("../services");
/* ---------------- GET ---------------- */
const findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield services_1.UserService.findAll();
    res.send(data);
});
exports.findAll = findAll;
/* ---------------- POST ---------------- */
exports.create = [
    (0, express_validator_1.body)("name").notEmpty(),
    middlewares_1.validatorErrorChecker,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield services_1.UserService.createUser(req.body);
        res.send(user);
    }),
];
exports.subscriptNotion = [
    (0, express_validator_1.body)("name").notEmpty(),
    (0, express_validator_1.body)("notion").notEmpty(),
    middlewares_1.validatorErrorChecker,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield services_1.UserService.addNotion(req.body);
        res.send(user);
    }),
];
exports.unSubscriptNotion = [
    (0, express_validator_1.body)("name").notEmpty(),
    (0, express_validator_1.body)("notion").notEmpty(),
    middlewares_1.validatorErrorChecker,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield services_1.UserService.delelteNotion(req.body);
        res.send(user);
    }),
];
/* ---------------- UPDATE ---------------- */
/* ---------------- DELETE ---------------- */
exports.deleteUser = [
    (0, express_validator_1.body)("name").notEmpty(),
    middlewares_1.validatorErrorChecker,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield services_1.UserService.deleteUser(req.body.name);
        res.send(user);
    }),
];
//# sourceMappingURL=UserController.js.map