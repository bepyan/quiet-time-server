import { QTContent } from "@types";
import axios from "axios";
import cheerio from "cheerio";
import iconv from "iconv-lite";
import { generateError } from "../middlewares";
import { Time } from "../utils";

/* ---------------- craw ---------------- */

const links = {
  생명의삶: "https://www.duranno.com/qt/view/bible.asp",
  생명의삶_해설: "https://www.duranno.com/qt/view/explain.asp",
  매일성경: "https://sum.su.or.kr:8888/bible/today",
};

const getHTML = async (link: keyof typeof links, encoding = "utf-8") => {
  const html = await axios({
    url: links[link],
    method: "GET",
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "*/*",
    },
    responseEncoding: "binary",
    responseType: "arraybuffer",
  } as any);
  return iconv.decode(html.data, encoding);
};

/* ---------------- parse ---------------- */

const crawler = {
  생명의삶: async (): Promise<QTContent> => {
    const $ = cheerio.load(await getHTML("생명의삶", "euc-kr"));
    const $commentary = cheerio.load(await getHTML("생명의삶_해설", "euc-kr"));

    return {
      title: $("h1 span").text().trim(),
      range: $("h1 em").text().trim(),
      date: Time.toYMDD(),
      verses: $(".bible")
        .children()
        .map((_, elem) => {
          const $elem = $(elem);
          if (elem.tagName === "p") return { text: $elem.text().trim() };

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
  },

  매일성경: async (): Promise<QTContent> => {
    const $ = cheerio.load(await getHTML("매일성경"));

    return {
      title: $(".bible_text").text().trim(),
      range: $("#mainView_2 .bibleinfo_box")
        .text()
        .trim()
        .split(" ")
        .slice(2, 6)
        .join(" "),
      date: Time.toYMDD(),
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
  },
};

/* ---------------- export ---------------- */

export type CrawlerKey = keyof typeof crawler;
export const crawlerKeyList = Object.keys(crawler);

export const parse = (key: CrawlerKey) => {
  if (!crawlerKeyList.some(v => v === key))
    return generateError({ status: 400, message: "잘못된 contentType입니다." })

  return crawler[key]()
};
