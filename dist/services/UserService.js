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
exports.hasSubscript = exports.deleteNotion = exports.addNotion = exports.deleteUser = exports.createUser = exports.findUser = exports.findAll = void 0;
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
const findAll = () => {
    return models_1.UserModel.find();
};
exports.findAll = findAll;
const findUser = ({ name }) => {
    return models_1.UserModel.findOne({ name });
};
exports.findUser = findUser;
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, exports.findUser)({ name: user.name });
    if (!!res)
        return (0, middlewares_1.generateError)({ status: 409, message: "중복된 아이디가 있어요." });
    return new models_1.UserModel(user).save();
});
exports.createUser = createUser;
const deleteUser = (name) => {
    return models_1.UserModel.deleteOne({ name });
};
exports.deleteUser = deleteUser;
const addNotion = ({ name, notion }) => {
    return models_1.UserModel.updateOne({ name }, { $push: { notions: notion } });
};
exports.addNotion = addNotion;
const deleteNotion = ({ name, notion }) => {
    return models_1.UserModel.updateOne({ name }, { $pull: { notions: notion } });
};
exports.deleteNotion = deleteNotion;
const hasSubscript = ({ name, notion }) => __awaiter(void 0, void 0, void 0, function* () {
    const duplicated = yield models_1.UserModel.findOne({
        name,
        notions: { $elemMatch: notion },
    });
    return !!duplicated;
});
exports.hasSubscript = hasSubscript;
//# sourceMappingURL=UserService.js.map