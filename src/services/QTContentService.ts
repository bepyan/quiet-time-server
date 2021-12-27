import { IUser, INotion, IQTContent, SearchQTContentDTO } from "@types";
import { CrawlerService, NotionService, UserService } from ".";
import { QTContentModel } from "../models";
import { Time } from "../utils";

export const findAll = () => {
  return QTContentModel.find();
};

export const findOne = async ({
  contentType,
  date = Time.toYMD(),
}: SearchQTContentDTO) => {
  let content: IQTContent | null = await QTContentModel.findOne({
    contentType,
    date,
  });
  if (!content) {
    content = (await CrawlerService.parse(contentType)) || null;
    if (content) await createOne(content);
  }

  return content;
};

export const createOne = (content: IQTContent) => {
  return new QTContentModel(content).save();
};

export const deleteOne = ({ contentType, date }: SearchQTContentDTO) => {
  return QTContentModel.deleteOne({ contentType, date });
};

/* ----------------  ---------------- */

export const collectContent = async () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(
    `$$ start collect [ ${CrawlerService.crawlerKeyList.length} ] contents`
  );

  let done = 0;
  await Promise.all(
    CrawlerService.crawlerKeyList.map(async (key) => {
      try {
        const content = await CrawlerService.parse(
          key as CrawlerService.CrawlerKey
        );
        if (content) {
          console.log(content.verses[0].text);
          await createOne(content);
          done++;
        } else {
          console.error(`$$ [ ${key} ] fail`);
        }
      } catch (e) {
        console.error(e);
      }
    })
  );

  console.log(`$$ successfully collect ${done} contents ✨`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
};

/* ----------------  ---------------- */

export const publishContent = async ({
  notion_auth,
  notion: { database_id, contentType },
}: {
  notion_auth: string;
  notion: INotion;
}) => {
  const content = await findOne({ contentType });

  if (content)
    return NotionService.createQTPage({
      notion_auth,
      database_id,
      content,
    });
};

export const publishToOneUser = async (user: IUser) => {
  const { name, notion_auth, notions } = user;

  let jobs_done = 0;
  for (const notion of notions) {
    try {
      await publishContent({ notion_auth, notion });
      jobs_done++;
    } catch (e) {
      console.log(`$$ delete error notion | ${name} ${notion.database_id} `);
      await UserService.deleteNotion({ name, notion });
    }
  }
  return jobs_done;
};

export const publishToAllUser = async () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("$$ start publishing QT");

  const users = await UserService.findAll();
  const jobs = users.reduce((ac, v) => ac + v.notions.length, 0);
  console.log(`$$ discover ${jobs} jobs`);

  let jobs_done = 0;
  for (const user of users) {
    jobs_done += await publishToOneUser(user);
  }

  console.log(`$$ ${jobs_done} content published ✨`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
};
