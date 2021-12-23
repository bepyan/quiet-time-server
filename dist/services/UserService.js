"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotion = exports.addNotion = exports.deleteUser = exports.createUser = exports.findUser = exports.findAll = void 0;
const models_1 = require("../models");
const findAll = () => {
    return models_1.UserModel.find();
};
exports.findAll = findAll;
const findUser = ({ name }) => {
    return models_1.UserModel.findOne({ name });
};
exports.findUser = findUser;
const createUser = (user) => {
    return new models_1.UserModel(user).save();
};
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
//# sourceMappingURL=UserService.js.map