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
exports.load_QTConent_CronJob = exports.load_heroku_awaker = void 0;
const axios_1 = __importDefault(require("axios"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const services_1 = require("../services");
// https://github.com/node-schedule/node-schedule#cron-style-scheduling
const isHeroku = () => process.env.INSTANCE_ID === "0";
const load_heroku_awaker = () => {
    if (isHeroku())
        node_schedule_1.default.scheduleJob("*/20 * * * *", () => {
            console.log("$$ awake heroku in every 20 min");
            axios_1.default.get(`https://quiet-time-server.herokuapp.com/api`);
        });
};
exports.load_heroku_awaker = load_heroku_awaker;
const load_QTConent_CronJob = () => {
    const rule = new node_schedule_1.default.RecurrenceRule();
    rule.hour = 15;
    rule.minute = 30;
    rule.dayOfWeek = [0, new node_schedule_1.default.Range(0, 6)];
    rule.tz = "Asia/Seoul";
    if (isHeroku()) {
        console.log("$$ init corn setting");
        node_schedule_1.default.scheduleJob(rule, () => {
            services_1.UserService.findAll().then((data) => __awaiter(void 0, void 0, void 0, function* () {
                console.log("$$ start QT cron-job");
                try {
                    for (const user of data) {
                        yield Promise.all(user.notions.map((v) => __awaiter(void 0, void 0, void 0, function* () {
                            console.log(v);
                            yield services_1.NotionService.createQTPage({
                                notion_auth: user.notion_auth,
                                database_id: v.database_id,
                                contentType: v.contentType
                            });
                        })));
                    }
                    console.log(`$$ ${data.length} jobs done`);
                }
                catch (e) {
                    console.log(`$$ [Error] QT cron-job`, e);
                }
            }));
        });
    }
};
exports.load_QTConent_CronJob = load_QTConent_CronJob;
//# sourceMappingURL=loadCronJob.js.map