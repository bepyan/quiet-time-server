import { Client } from "@notionhq/client";
import { NotionDatabaseDTO, NotionPageDTO } from "@types";
import { Time } from "../utils";

export const createQTDatabase = async ({
  notion_auth,
  page_id,
}: NotionDatabaseDTO) => {
  const notion = new Client({ auth: notion_auth });

  const data = await notion.databases.create({
    parent: { page_id },
    icon: { emoji: "đ" },
    title: [{ text: { content: `QT ë§ė` } }],
    properties: {
      title: { title: {} },
      ėëŠ: { people: {} },
      íí°ėą: { rich_text: {} },
      ë ė§: { date: {} },
    },
  });
  return data;
};

export const createQTPage = async ({
  notion_auth,
  database_id,
  content,
}: NotionPageDTO) => {
  const notion = new Client({ auth: notion_auth });

  return notion.pages.create({
    parent: { database_id },
    icon: { emoji: "đ¤˛đģ" },
    properties: {
      title: { title: [{ text: { content: content.range.text } }] },
      íí°ėą: { rich_text: [{ text: { content: content.contentType } }] },
      ë ė§: { date: { start: Time.toYMD() } },
    },
    children: [
      {
        heading_1: { text: [{ text: { content: content.title } }] },
      },
      {
        paragraph: { text: [{ text: { content: content.range.text } }] },
      },
      { paragraph: { text: [] } },
      ...content.verses.reduce((ac, { verse, text }, i) => {
        if (!verse) {
          return [
            ...ac,
            // ė˛Ģ ė ëĒŠė´ ėë ë
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
          text: [{ text: { content: "ëŗ¸ëŦ¸í´ė¤" } }],
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
