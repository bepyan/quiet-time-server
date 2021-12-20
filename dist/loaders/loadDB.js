"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const loadDB = () => {
    mongoose_1.default.Promise = global.Promise;
    mongoose_1.default
        .connect(process.env.MONGOOSE_URI)
        .then(() => console.log("$$ successfully connected to mongodb"))
        .catch((e) => console.error(e));
};
exports.loadDB = loadDB;
//# sourceMappingURL=loadDB.js.map