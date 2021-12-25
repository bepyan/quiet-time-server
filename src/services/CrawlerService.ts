import { IQTContent } from "@types";
import axios from "axios";
import cheerio from "cheerio";
import iconv from "iconv-lite";
import puppeteer from "puppeteer";
import { generateError } from "../middlewares";
import { Time } from "../utils";

/* ---------------- craw ---------------- */

const links = {
  생명의삶: "https://www.duranno.com/qt/view/bible.asp",
  생명의삶_해설: "https://www.duranno.com/qt/view/explain.asp",
  매일성경: "https://sum.su.or.kr:8888/bible/today",
};

const getHTML = async (url: string, encoding = "utf-8") => {
  const html = await axios({
    url,
    method: "GET",
    responseEncoding: "binary",
    responseType: "arraybuffer",
  });
  return iconv.decode(html.data, encoding);
};

/* ---------------- parse ---------------- */

const crawler = {
  생명의삶: async (): Promise<IQTContent> => {
    const $ = cheerio.load(await getHTML(links.생명의삶, "euc-kr"));
    const $commentary = cheerio.load(
      await getHTML(links.생명의삶_해설, "euc-kr")
    );

    return {
      contentType: "생명의삶",
      title: $("h1 span").text().trim(),
      range: $("h1 em").text().trim(),
      date: Time.toYMD(),
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
  매일성경: () => parse매일성경("매일성경"),
  "매일성경 순": () => parse매일성경("매일성경 순"),
  "매일성경 청소년": () => parse매일성경("매일성경 청소년"),
  "매일성경 영어": () => parse매일성경("매일성경 영어"),
};

const 매일성경inputs: {
  [key: string]: string;
} = {
  "매일성경 순": "#please02",
  "매일성경 청소년": "#please03",
  "매일성경 영어": "#please07",
};

const load매일성경 = async (key: string) => {
  const selector: string | undefined = 매일성경inputs[key];
  // 매일성경은 radio input을 누를 필요가 없다.
  if (!selector) return cheerio.load(await getHTML(links.매일성경));

  console.log("@@ 브라우저 실행");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(links.매일성경);
  await page.evaluate((v) => document.querySelector(v).click(), selector);

  console.log("@@ QT본문으로 이동");
  // sleep
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const content = await page.content();
  await browser.close();

  return cheerio.load(content);
};

const parse매일성경 = async (contentType: CrawlerKey): Promise<IQTContent> => {
  const $ = await load매일성경(contentType);

  console.log("@@ QT본문 취합완료");

  return {
    contentType,
    date: Time.toYMD(),
    title: $(".bible_text").text().trim(),
    range: $("#mainView_2 .bibleinfo_box")
      .text()
      .trim()
      .split(" ")
      .slice(2, 6)
      .join(" "),
    verses: $(".body_list")
      .children()
      .map((_, elem) => ({
        verse: +$(elem).find(".num").text().trim(),
        text: $(elem).find(".info").text().trim(),
      }))
      .toArray(),
    commentaries: [
      ...$(".body_cont")
        .children()
        .map((_, elem) => $(elem).html())
        .toArray()
        .flatMap((text) => text.split("<br>").map((v) => v.trim())),
      "",
    ],
  };
};

/* ---------------- export ---------------- */

export type CrawlerKey = keyof typeof crawler;
export const crawlerKeyList = Object.keys(crawler);

export const parse = (key: CrawlerKey) => {
  try {
    const craw = crawler[key];
    if (!craw)
      return generateError({
        status: 400,
        message: "잘못된 contentType입니다.",
      });
    return craw();
  } catch (e) {
    console.error(e);
  }
};
