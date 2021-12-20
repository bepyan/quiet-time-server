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
exports.load_QTConent_CronJob = exports.testCronJob = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const services_1 = require("../services");
// https://github.com/node-schedule/node-schedule#cron-style-scheduling
const testCronJob = () => {
    node_schedule_1.default.scheduleJob("00 00 05 * * 0-6", () => {
        console.log("매일 5시에 작업실행");
    });
    node_schedule_1.default.scheduleJob("1 * * * * *", () => {
        console.log("매 1분 마다 실행");
    });
};
exports.testCronJob = testCronJob;
const load_QTConent_CronJob = () => {
    const rule = new node_schedule_1.default.RecurrenceRule();
    rule.hour = 5;
    rule.minute = 0;
    rule.dayOfWeek = [0, new node_schedule_1.default.Range(0, 6)];
    rule.tz = 'Asia/Seoul';
    if (process.env.INSTANCE_ID === "0") {
        console.log("$$ init corn setting");
        node_schedule_1.default.scheduleJob(rule, () => {
            services_1.UserService.findAll().then((data) => __awaiter(void 0, void 0, void 0, function* () {
                console.log("$$ start QT cron-job");
                for (const user of data) {
                    yield Promise.all(user.notions.map((v) => __awaiter(void 0, void 0, void 0, function* () {
                        yield services_1.NotionService.addQTContent(v);
                    })));
                }
                console.log(`$$ ${data.length} jobs done`);
            }));
        });
    }
};
exports.load_QTConent_CronJob = load_QTConent_CronJob;
//# sourceMappingURL=loadCronJob.js.map