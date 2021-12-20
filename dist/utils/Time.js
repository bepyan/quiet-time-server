"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toYMD_KO = exports.toYMDD = exports.toYMD = exports.getDateDataTwoDigit = exports.getDateData = void 0;
const KO_DAY = ["일", "월", "화", "수", "목", "금", "토"];
const toTwoDigit = (v) => (+v < 10 ? "0" + v : "" + v);
const getDateData = (target) => {
    const time = new Date(target);
    return {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        date: time.getDate(),
        dayIdx: time.getDay(),
        day_ko: KO_DAY[time.getDay()],
        hour: time.getHours(),
        minute: time.getMinutes(),
        second: time.getSeconds(),
    };
};
exports.getDateData = getDateData;
const getDateDataTwoDigit = (target) => {
    const date = (0, exports.getDateData)(target);
    return Object.assign(Object.assign({}, date), { year: date.year % 100, month: toTwoDigit(date.month), date: toTwoDigit(date.date), hour: toTwoDigit(date.hour), minute: toTwoDigit(date.minute), second: toTwoDigit(date.second) });
};
exports.getDateDataTwoDigit = getDateDataTwoDigit;
/**
 * @param target string | number | Date  `default` 오늘
 * @returns 2021-08-16
 */
const toYMD = (target = new Date()) => {
    if (!target)
        return "";
    const { year } = (0, exports.getDateData)(target);
    const { month, date } = (0, exports.getDateDataTwoDigit)(target);
    return `${year}-${month}-${date}`;
};
exports.toYMD = toYMD;
/**
 * @param target string | number | Date  `default` 오늘
 * @returns 2021-08-16 (월)
 */
const toYMDD = (target = new Date()) => {
    if (!target)
        return "";
    const { day_ko } = (0, exports.getDateData)(target);
    return `${(0, exports.toYMD)(target)} (${day_ko})`;
};
exports.toYMDD = toYMDD;
/**
 * @param target string | number | Date
 * @returns 2021년 3월 4일
 */
const toYMD_KO = (target = new Date()) => {
    if (!target)
        return "";
    const { year, month, date } = (0, exports.getDateData)(target);
    return `${year}년 ${month}월 ${date}일`;
};
exports.toYMD_KO = toYMD_KO;
//# sourceMappingURL=Time.js.map