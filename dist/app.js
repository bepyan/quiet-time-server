"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const loaders_1 = require("./loaders");
const middlewares_1 = require("./middlewares");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 1234;
(0, loaders_1.loadDB)();
(0, loaders_1.load_QTConent_CronJob)();
// testCronJob();
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use("/api", routes_1.default);
app.use(middlewares_1.errorLogger);
app.use(middlewares_1.errorResponser);
app.listen(PORT, () => {
    console.log(`
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃   Server listening on port: ${PORT}    ┃
  ┃     http://localhost:${PORT}/api       ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  `);
});
//# sourceMappingURL=app.js.map