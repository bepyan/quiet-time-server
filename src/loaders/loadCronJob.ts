import { Notion } from "@utils";
import { UserModel } from "models";
import schedule from "node-schedule";

// https://github.com/node-schedule/node-schedule#cron-style-scheduling

export const loadCronJob = () => {
  schedule.scheduleJob("00 00 05 * * 0-6", () => {
    console.log("node-cron 실행 테스트");
  });

  schedule.scheduleJob("1 * * * * *", () => {
    console.log("매 1분 마다 실행");
  });
};

export const load_QTConent_CronJob = () => {
  schedule.scheduleJob("1 * * * * *", () => {
    UserModel.find().then(async (data) => {
      console.log("$$ start QT Cron Job");
      for (const user of data) {
        await Promise.all(
          user.notions.map(async (v) => {
            await Notion.addQTContent(v);
          })
        );
      }
      console.log(`$$ ${data.length} jobs done`);
    });
  });
};
