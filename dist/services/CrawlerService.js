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
exports.parse = exports.crawlerKeyList = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const middlewares_1 = require("../middlewares");
const utils_1 = require("../utils");
/* ---------------- craw ---------------- */
const links = {
    생명의삶: "https://www.duranno.com/qt/view/bible.asp",
    생명의삶_해설: "https://www.duranno.com/qt/view/explain.asp",
    매일성경: "https://sum.su.or.kr:8888/bible/today",
};
const getHTML = (link, encoding = "utf-8") => __awaiter(void 0, void 0, void 0, function* () {
    const html = yield (0, axios_1.default)({
        url: links[link],
        method: "GET",
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            Accept: "*/*",
        },
        responseEncoding: "binary",
        responseType: "arraybuffer",
    });
    return iconv_lite_1.default.decode(html.data, encoding);
});
/* ---------------- parse ---------------- */
const crawler = {
    생명의삶: () => __awaiter(void 0, void 0, void 0, function* () {
        const $ = cheerio_1.default.load(yield getHTML("생명의삶", "euc-kr"));
        const $commentary = cheerio_1.default.load(yield getHTML("생명의삶_해설", "euc-kr"));
        return {
            title: $("h1 span").text().trim(),
            range: $("h1 em").text().trim(),
            date: utils_1.Time.toYMDD(),
            verses: $(".bible")
                .children()
                .map((_, elem) => {
                const $elem = $(elem);
                if (elem.tagName === "p")
                    return { text: $elem.text().trim() };
                return {
                    verse: +$elem.find("th").text().trim(),
                    text: $elem.find("td").text().trim(),
                };
            })
                .toArray(),
            commentaries: [
                ...$commentary(".bible")
                    .children()
                    .map((_, elem) => $(elem).html())
                    .toArray()
                    .flatMap((text) => text.split("<br>")),
                "",
            ],
        };
    }),
    매일성경: () => __awaiter(void 0, void 0, void 0, function* () {
        const $ = cheerio_1.default.load(yield getHTML("매일성경"));
        return {
            title: $(".bible_text").text().trim(),
            range: $("#mainView_2 .bibleinfo_box")
                .text()
                .trim()
                .split(" ")
                .slice(2, 6)
                .join(" "),
            date: utils_1.Time.toYMDD(),
            verses: $(".body_list")
                .children()
                .map((_, elem) => ({
                verse: +$(elem).find(".num").text().trim(),
                text: $(elem).find(".info").text().trim(),
            }))
                .toArray(),
            commentaries: $(".body_cont")
                .children()
                .map((_, elem) => $(elem).html())
                .toArray()
                .flatMap((text) => text.split("<br>").map((v) => v.trim())),
        };
    }),
};
exports.crawlerKeyList = Object.keys(crawler);
const parse = (key) => {
    if (!exports.crawlerKeyList.some(v => v === key))
        return (0, middlewares_1.generateError)({ status: 400, message: "잘못된 contentType입니다." });
    return crawler[key]();
};
exports.parse = parse;
//# sourceMappingURL=CrawlerService.js.map