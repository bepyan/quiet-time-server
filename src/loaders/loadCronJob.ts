import axios from "axios";
import schedule from "node-schedule";
import {
  CrawlerService,
  NotionService,
  QTContentService,
  UserService,
} from "../services";

// https://github.com/node-schedule/node-schedule#cron-style-scheduling

const isHeroku = process.env.INSTANCE_ID === "0";

export const load_heroku_awaker = () => {
  if (!isHeroku) return;

  schedule.scheduleJob("*/20 * * * *", () => {
    console.log("$$ awake heroku in every 20 min");
    axios.get(`https://quiet-time-server.herokuapp.com/api`);
  });
};

export const load_QTConent_publisher = () => {
  if (!isHeroku) return;

  const rule = new schedule.RecurrenceRule();
  rule.hour = 5;
  rule.minute = 0;
  rule.dayOfWeek = [0, new schedule.Range(0, 6)];
  rule.tz = "Asia/Seoul";

  schedule.scheduleJob(rule, () => {
    UserService.findAll().then(async (data) => {
      let jobs_done = 0;
      console.log("$$ start publishing QT");

      for (const user of data) {
        const { name, notion_auth, notions } = user;

        await Promise.all(
          notions.map(async (notion) => {
            try {
              await NotionService.createQTPage({
                notion_auth,
                database_id: notion.database_id,
                contentType: notion.contentType,
              });
              jobs_done++;
            } catch (e) {
              console.log(
                `$$ delete error notion | ${name} ${notion.database_id} `
              );
              await UserService.deleteNotion({ name, notion });
            }
          })
        );
      }

      console.log(`$$ ${jobs_done} content published ✨`);
    });
  });
};

export const load_QTContent_collector = () => {
  if (!isHeroku) return;

  const rule = new schedule.RecurrenceRule();
  rule.hour = 0;
  rule.minute = 1;
  rule.dayOfWeek = [0, new schedule.Range(0, 6)];
  rule.tz = "Asia/Seoul";

  schedule.scheduleJob(rule, async () => {
    console.log("$$ start collecting QT");

    await Promise.all(
      CrawlerService.crawlerKeyList.map(async (key) => {
        try {
          const content = await CrawlerService.parse(
            key as CrawlerService.CrawlerKey
          );
          await QTContentService.createOne(content);
        } catch (e) {
          console.error(e);
        }
      })
    );

    console.log(`$$ collecting content done ✨`);
  });
};
