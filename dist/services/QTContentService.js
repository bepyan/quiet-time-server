"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.createOne = exports.findOne = exports.findAll = void 0;
const models_1 = require("../models");
const findAll = () => {
    return models_1.QTContentModel.find();
};
exports.findAll = findAll;
const findOne = ({ contentType, date }) => {
    return models_1.QTContentModel.findOne({ contentType, date });
};
exports.findOne = findOne;
const createOne = (content) => {
    return new models_1.QTContentModel(content).save();
};
exports.createOne = createOne;
const deleteOne = ({ contentType, date }) => {
    return models_1.QTContentModel.deleteOne({ contentType, date });
};
exports.deleteOne = deleteOne;
//# sourceMappingURL=QTContentService.js.map