import "dotenv/config";
import express from "express";
import routers from "./routes";
import { loadDB, load_QTConent_CronJob } from "./loaders";
import { errorResponser, errorLogger } from "./middlewares";

const app = express();
const PORT = process.env.PORT || 5000;

loadDB();
load_QTConent_CronJob();
// testCronJob();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", routers);
app.use(errorLogger);
app.use(errorResponser);

app.listen(PORT, () => {
  console.log(`
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃   Server listening on port: ${PORT}    ┃
  ┃     http://localhost:${PORT}/api       ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  `);
});
