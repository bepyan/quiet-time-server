import schedule from "node-schedule";
import { NotionService, UserService } from "../services";

// https://github.com/node-schedule/node-schedule#cron-style-scheduling

export const testCronJob = () => {
  schedule.scheduleJob("00 00 05 * * 0-6", () => {
    console.log("매일 5시에 작업실행");
  });

  schedule.scheduleJob("1 * * * * *", () => {
    console.log("매 1분 마다 실행");
  });
};

export const load_QTConent_CronJob = () => {
  schedule.scheduleJob("00 00 05 * * 0-6", () => {
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
};
