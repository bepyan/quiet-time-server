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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.load_QTContent_collector = exports.load_QTConent_publisher = exports.load_heroku_awaker = void 0;
const axios_1 = __importDefault(require("axios"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const services_1 = require("../services");
// https://github.com/node-schedule/node-schedule#cron-style-scheduling
const isHeroku = process.env.INSTANCE_ID === "0";
const load_heroku_awaker = () => {
    if (!isHeroku)
        return;
    node_schedule_1.default.scheduleJob("*/20 * * * *", () => {
        console.log("$$ awake heroku in every 20 min");
        axios_1.default.get(`https://quiet-time-server.herokuapp.com/api`);
    });
};
exports.load_heroku_awaker = load_heroku_awaker;
const load_QTConent_publisher = () => {
    if (!isHeroku)
        return;
    const rule = new node_schedule_1.default.RecurrenceRule();
    rule.hour = 5;
    rule.minute = 0;
    rule.dayOfWeek = [0, new node_schedule_1.default.Range(0, 6)];
    rule.tz = "Asia/Seoul";
    node_schedule_1.default.scheduleJob(rule, services_1.QTContentService.publishToAllUser);
};
exports.load_QTConent_publisher = load_QTConent_publisher;
const load_QTContent_collector = () => {
    if (!isHeroku)
        return;
    const rule = new node_schedule_1.default.RecurrenceRule();
    rule.hour = 0;
    rule.minute = 1;
    rule.dayOfWeek = [0, new node_schedule_1.default.Range(0, 6)];
    rule.tz = "Asia/Seoul";
    node_schedule_1.default.scheduleJob(rule, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("$$ start collecting QT");
        yield services_1.QTContentService.collectContent();
        console.log(`$$ collecting content done ✨`);
    }));
};
exports.load_QTContent_collector = load_QTContent_collector;
//# sourceMappingURL=loadCronJob.js.map