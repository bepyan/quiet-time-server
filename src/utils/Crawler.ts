import { QTContent, Verse } from "@types";
import axios from "axios";
import cheerio, { CheerioAPI } from "cheerio";
import iconv from "iconv-lite";
import { toYMDD } from "./Time";

/* ---------------- craw ---------------- */

const links = {
  bible: "https://www.duranno.com/qt/view/bible.asp",
  commentary: "https://www.duranno.com/qt/view/explain.asp",
};

const getHTML = async (link: keyof typeof links) => {
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
  return iconv.decode(html.data, "euc-kr");
};

/* ---------------- parse util ---------------- */

const parseBible = ($: CheerioAPI) => {
  let verses: Verse[] = [];

  $(".bible")
    .children()
    .each((_, elem) => {
      const $elem = $(elem);
      if (elem.tagName === "p") {
        verses.push({ text: $elem.text().trim() });
        return;
      }

      const verse = $elem.find("th").text();
      const text = $elem.find("td").text().trim();

      verses.push({ verse: +verse, text });
    });

  return verses;
};

const parseCommentaries = ($: CheerioAPI) => {
  let commentaries: string[] = [];

  $(".bible")
    .children()
    .each((_, elem) => {
      commentaries.push($(elem).text().trim());
    });

  return commentaries;
};

/* ---------------- method ---------------- */

export const parseQTContent = async (): Promise<QTContent> => {
  const bibleHTML = await getHTML("bible");
  const $bible = cheerio.load(bibleHTML);

  const commentaryHTML = await getHTML("commentary");
  const $commentary = cheerio.load(commentaryHTML);

  return {
    title: $bible("h1 span").text().trim(),
    range: $bible("h1 em").text().trim(),
    date: toYMDD(),
    verses: parseBible($bible),
    commentaries: parseCommentaries($commentary),
  };
};
