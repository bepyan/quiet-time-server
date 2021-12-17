"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
router.get("/", controllers_1.UserController.findAll);
router.post("/", controllers_1.UserController.create);
router.post("/notion", controllers_1.UserController.subscriptNotion);
router.delete("/", controllers_1.UserController.deleteUser);
router.delete("/notion", controllers_1.UserController.unSubscriptNotion);
exports.default = router;
//# sourceMappingURL=users.js.map