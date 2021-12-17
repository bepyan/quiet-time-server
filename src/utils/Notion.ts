import { Client } from "@notionhq/client";
import { INotion } from "@types";
import { Crawler, Time } from "@utils";

export const onAddQTContent = async ({ key, database_id }: INotion) => {
  const notion = new Client({ auth: key });

  const content = await Crawler.parseQTContent();

  return notion.pages.create({
    parent: { database_id },
    icon: {
      emoji: "🤲🏻",
    },
    properties: {
      title: { title: [{ text: { content: content.range } }] },
      날짜: { date: { start: Time.toYMD() } },
    },
    children: [
      {
        heading_1: { text: [{ text: { content: content.title } }] },
      },
      {
        paragraph: { text: [{ text: { content: content.range } }] },
      },
      ...content.verses.reduce((ac, { verse, text }) => {
        if (!verse) {
          return [
            ...ac,
            { paragraph: { text: [] } },
            { heading_3: { text: [{ text: { content: text } }] } },
          ];
        }
        return [
          ...ac,
          {
            paragraph: {
              text: [{ text: { content: `${verse}.   ${text}` } }],
            },
          },
        ];
      }, [] as any),
    ],
  });
};
