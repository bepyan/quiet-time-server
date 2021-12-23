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
  rule.minute = 10;
  rule.dayOfWeek = [0, new schedule.Range(0, 6)];
  rule.tz = "Asia/Seoul";

  if (isHeroku()) {
    console.log("$$ init corn setting");

    schedule.scheduleJob(rule, () => {
      UserService.findAll().then(async (data) => {
        console.log("$$ start QT cron-job");

        try {
          for (const user of data) {
            await Promise.all(
              user.notions.map(async (v) => {
                try {
                  await NotionService.createQTPage({
                    notion_auth: user.notion_auth,
                    database_id: v.database_id,
                    contentType: v.contentType
                  });
                } catch (e: any) {
                  if (e.code === "object_not_found") {
                    console.log(`$$ delete not found notion ${v.database_id} `)
                    await UserService.deleteNotion({
                      name: user.name,
                      notion: v,
                    })
                  }
                }
              })
            );
          }
          console.log(`$$ ${data.length} users done`);
        } catch (e) {
          console.log(`$$ error `, e)
        }
      });
    });
  }
};
