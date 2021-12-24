"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const craw_1 = __importDefault(require("./craw"));
const qt_content_1 = __importDefault(require("./qt-content"));
const users_1 = __importDefault(require("./users"));
const router = express_1.default.Router();
router.get("/", (req, res, next) => {
    res.json({ message: "welcome!" });
});
router.use("/craw", craw_1.default);
router.use("/qt-content", qt_content_1.default);
router.use("/users", users_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map