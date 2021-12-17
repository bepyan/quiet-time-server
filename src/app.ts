import "dotenv/config";
import express from "express";
import { loadDB, load_QTConent_CronJob } from "loaders";
import routers from "./routes";

const app = express();
const PORT = process.env.PORT || 1234;

loadDB();
// testCronJob();
load_QTConent_CronJob();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", routers);

app.listen(PORT, () => {
  console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   Server listening on port: ${PORT}    ┃
┃     http://localhost:${PORT}/api       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`);
});
