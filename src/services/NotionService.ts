import { Client } from "@notionhq/client";
import { INotion } from "@types";
import { CrawlerService } from "@services";
import { CrawlerKey } from "./CrawlerService";
import { Time } from "@utils";

interface AddQTContentProps extends INotion {
  contentType: CrawlerKey;
}

export const addQTContent = async ({
  key,
  database_id,
  contentType,
}: AddQTContentProps) => {
  const notion = new Client({ auth: key });

  const content = await CrawlerService.parse(contentType);

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
            { divider: {} },
          ],
        },
      },
    ],
  });
};
