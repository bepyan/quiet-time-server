"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.UserModel = mongoose_1.default.model("User", new mongoose_1.default.Schema({
    name: { type: String, required: true },
    notions: [
        {
            key: String,
            database_id: String,
            contentType: String,
        },
    ],
    create_date: { type: Date, default: Date.now },
}));
//# sourceMappingURL=User.js.map