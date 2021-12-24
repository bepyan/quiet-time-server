import { Client } from "@notionhq/client";
import { NotionDatabaseDTO, NotionPageDTO } from "@types";
import { CrawlerService } from "../services";
import { Time } from "../utils";

export const createQTDatabase = async ({
  notion_auth,
  page_id,
}: NotionDatabaseDTO) => {
  const notion = new Client({ auth: notion_auth });

  const data = await notion.databases.create({
    parent: { page_id },
    icon: { emoji: "📖" },
    title: [{ text: { content: `QT 말씀` } }],
    properties: {
      title: { title: {} },
      아멘: { people: {} },
      큐티책: { rich_text: {} },
      날짜: { date: {} },
    },
  });

  await notion.databases.query({
    database_id: data.id,
    sorts: [{ property: "날짜", direction: "descending" }],
  });
  return data;
};

export const createQTPage = async ({
  notion_auth,
  database_id,
  contentType,
}: NotionPageDTO) => {
  const notion = new Client({ auth: notion_auth });

  const content = await CrawlerService.parse(contentType);
  if (!content) return;

  return notion.pages.create({
    parent: { database_id },
    icon: { emoji: "🤲🏻" },
    properties: {
      title: { title: [{ text: { content: content.range } }] },
      큐티책: { rich_text: [{ text: { content: contentType } }] },
      날짜: { date: { start: Time.toYMD() } },
    },
    children: [
      {
        heading_1: { text: [{ text: { content: content.title } }] },
      },
      {
        paragraph: { text: [{ text: { content: content.range } }] },
      },
      { paragraph: { text: [] } },
      ...content.verses.reduce((ac, { verse, text }, i) => {
        if (!verse) {
          return [
            ...ac,
            // 첫 제목이 아닐 때
            i && { paragraph: { text: [] } },
            { heading_3: { text: [{ text: { content: text } }] } },
            { divider: {} },
          ].filter((v) => !!v);
        }

        return [
          ...ac,
          !i && { divider: {} },
          {
            paragraph: { text: [{ text: { content: `${verse}.   ${text}` } }] },
          },
          { divider: {} },
        ].filter((v) => !!v);
      }, [] as any),
      { paragraph: { text: [] } },
      { paragraph: { text: [] } },
      { divider: {} },
      {
        toggle: {
          text: [{ text: { content: "본문해설" } }],
          children: [
            { divider: {} },
            ...content.commentaries.map((text) =>
              2 < text.length && text.length < 30
                ? { heading_3: { text: [{ text: { content: text } }] } }
                : { paragraph: { text: [{ text: { content: text } }] } }
            ),
          ],
        },
      },
      { divider: {} },
    ],
  });
};
