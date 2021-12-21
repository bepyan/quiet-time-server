import axios from "axios";
import schedule from "node-schedule";
import { NotionService, UserService } from "../services";

// https://github.com/node-schedule/node-schedule#cron-style-scheduling

export const load_heroku_awaker = () => {
  schedule.scheduleJob("*/20 * * * *", () => {
    console.log("$$ awake heroku in every 20 min")
    axios.get(`https://quiet-time-server.herokuapp.com/api`)
  });
}

export const load_QTConent_CronJob = () => {

  const rule = new schedule.RecurrenceRule();
  rule.hour = 5;
  rule.minute = 0;
  rule.dayOfWeek = [0, new schedule.Range(0, 6)];
  rule.tz = 'Asia/Seoul';


  if (process.env.INSTANCE_ID === "0") {
    console.log("$$ init corn setting")

    schedule.scheduleJob(rule, () => {
      UserService.findAll().then(async (data) => {
        console.log("$$ start QT cron-job");

        for (const user of data) {
          await Promise.all(
            user.notions.map(async (v) => {
              await NotionService.addQTContent(v);
            })
          );
        }
        console.log(`$$ ${data.length} jobs done`);
      });
    });

  }
};
