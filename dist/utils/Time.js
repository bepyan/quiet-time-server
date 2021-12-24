"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toYMDD = exports.toYMD = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
require("moment/locale/ko");
const KO_DAY = ["일", "월", "화", "수", "목", "금", "토"];
/**
 * @param target string | number | Date  `default` 오늘
 * @returns 2021-08-16
 */
const toYMD = (target = new Date()) => {
    return (0, moment_timezone_1.default)(target).tz("Asia/Seoul").format("YYYY-MM-DD");
};
exports.toYMD = toYMD;
const toYMDD = (target = new Date()) => {
    return (0, moment_timezone_1.default)(target).tz("Asia/Seoul").format("YYYY년 MM월 DD일 dddd");
};
exports.toYMDD = toYMDD;
//# sourceMappingURL=Time.js.map