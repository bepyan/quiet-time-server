import axios from "axios";
import schedule from "node-schedule";
import { NotionService, UserService } from "../services";

// https://github.com/node-schedule/node-schedule#cron-style-scheduling

const isHeroku = () => process.env.INSTANCE_ID === "0";

export const load_heroku_awaker = () => {
  if (isHeroku())
    schedule.scheduleJob("*/20 * * * *", () => {
      console.log("$$ awake heroku in every 20 min");
      axios.get(`https://quiet-time-server.herokuapp.com/api`);
    });
};

export const load_QTConent_CronJob = () => {
  const rule = new schedule.RecurrenceRule();
  rule.hour = 16;
  rule.minute = 30;
  rule.dayOfWeek = [0, new schedule.Range(0, 6)];
  rule.tz = "Asia/Seoul";

  if (isHeroku()) {
    console.log("$$ init corn setting");

    schedule.scheduleJob(rule, () => {
      UserService.findAll().then(async (data) => {
        let jobs_done = 0
        console.log("\n$$ start QT cron-job");

        for (const user of data) {
          const { name, notion_auth, notions } = user

          await Promise.all(
            notions.map(async (notion) => {
              try {
                await NotionService.createQTPage({
                  notion_auth,
                  database_id: notion.database_id,
                  contentType: notion.contentType
                });
                jobs_done++
              } catch (e) {
                console.log(`$$ delete error notion | ${name} ${notion.database_id} `)
                await UserService.deleteNotion({ name, notion })
              }
            })
          );
        }

        console.log(`$$ ${jobs_done} jobs done\n`);
      });
    });
  }
};
