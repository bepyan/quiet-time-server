"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QTContentModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.QTContentModel = mongoose_1.default.model("QTContent", new mongoose_1.default.Schema({
    contentType: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    range: { type: String, required: true },
    commentaries: [{ type: String }],
    verses: [
        {
            verse: String,
            text: { type: String, required: true },
        },
    ],
}));
//# sourceMappingURL=QTContent.js.map