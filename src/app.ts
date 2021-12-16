import "dotenv/config";
import express from "express";
import router from "./routes";

const app = express();

app.listen("1234", () => {
  console.log(`
  ####################################
  🛡️  Server listening on port: 1234 🛡️
  🛡️    http://localhost:1234/api    🛡️
  ####################################
`);
});

app.use("/api", router);
