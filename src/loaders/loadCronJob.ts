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

  schedule.scheduleJob(rule, QTContentService.publishToAllUser);
};

export const load_QTContent_collector = () => {
  if (!isHeroku) return;

  const rule = new schedule.RecurrenceRule();
  rule.hour = 22;
  rule.minute = 0;
  rule.dayOfWeek = [0, new schedule.Range(0, 6)];
  rule.tz = "Asia/Seoul";

  schedule.scheduleJob(rule, QTContentService.collectContent);
};
