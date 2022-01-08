import { IQTContent } from "@types";
import axios from "axios";
import cheerio from "cheerio";
import iconv from "iconv-lite";
import { generateError } from "../middlewares";
import { BrowserService, Time } from "../utils";

/* ---------------- craw ---------------- */

export const links = {
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

    // 예시
    // 욥기 33 : 1~13
    // 욥기 38 : 39~39:4
    const range = $("h1 em").text().trim();
    const book = range.slice(0, range.indexOf(" "));
    const [startContent, endContent] = range
      .substring(range.indexOf(" "))
      .split("~")
      .map((v) => v.trim());

    const [startCapter, startVerse] = startContent.split(":").map((v) => +v);
    const [endCapter, endVerse] = endContent.includes(":")
      ? endContent.split(":").map((v) => +v)
      : [startCapter, +endContent];

    return {
      contentType: "생명의삶",
      title: $("h1 span").text().trim(),
      range: {
        text: `${book} ${startCapter}:${startVerse} - ${endCapter}:${endVerse}`,
        book,
        start: { capter: startCapter, verse: startVerse },
        end: { caper: endCapter, verse: endVerse },
      },
      date: Time.toYMD(),
      verses: $(".bible")
        .children()
        .map((_, elem) => {
          const $elem = $(elem);
          if (elem.tagName === "p") return { text: $elem.text().trim() };

          const verse = +$elem.find("th").text().trim();
          const capter = verse > startVerse ? startCapter : endCapter;
          return {
            capter,
            verse,
            text: $elem.find("td").text().trim(),
          };
        })
        .toArray(),
      commentaries: [
        ...$commentary(".bible")
          .children()
          .filter((_, elem) => elem.tagName === "p")
          .map((_, elem) => $(elem).html())
          .toArray()
          .flatMap((text) => text.replace("&amp;", "&").split("<br>")),
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

  const page = await BrowserService.매일성경page;
  if (!page) return console.error("$$ can't open browser page");

  console.log(`@@ [ ${key} ]으로 이동중...`);
  await page.evaluate((v) => document.querySelector(v).click(), selector);
  await page.waitForTimeout(3000);

  console.log(`@@ [ ${key} ] 본문 취합중...`);
  const content = await page.content();

  console.log(`@@ [ ${key} ] 본문 취합완료 ✨`);
  return cheerio.load(content);
};

const parse매일성경 = async (
  contentType: CrawlerKey
): Promise<IQTContent | undefined> => {
  const $ = await load매일성경(contentType);
  if (!$) return;

  // 본문 : 골로새서(Colossians)1:1 - 1:14 찬송가 220장
  // 본문 : 골로새서(Colossians)1:24 - 2:5 찬송가 200장
  const content = $("#mainView_2 .bibleinfo_box")
    .text()
    .trim()
    .substring(5)
    .split("찬송가")[0]
    .replace(/[a-z]/gi, "")
    .replace("()", " ")
    .replace("  ", " ")
    .trim();

  const [book, start, end] = content.replace(" - ", " ").split(" ");

  const [startCapter, startVerse] = start.split(":").map((v) => +v);
  const [endCapter, endVerse] = end.split(":").map((v) => +v);

  return {
    contentType,
    date: Time.toYMD(),
    title: $("#bible_text").text().trim(),
    range: {
      text: content,
      book,
      start: { capter: startCapter, verse: startVerse },
      end: { caper: endCapter, verse: endVerse },
    },
    verses: $(".body_list")
      .children()
      .map((_, elem) => {
        const $elem = $(elem);
        const verse = +$elem.find(".num").text().trim();
        const capter = verse > startVerse ? startCapter : endCapter;
        return {
          capter,
          verse,
          text: $elem.find(".info").text().trim(),
        };
      })
      .toArray(),
    commentaries: [
      ...$(".body_cont")
        .children()
        .map((_, elem) => $(elem).html())
        .toArray()
        .flatMap((text) =>
          text.split("<br>").map((v) => v.replace("&amp;", "&").trim())
        ),
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
