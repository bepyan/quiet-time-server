import "dotenv/config";
import express from "express";
import router from "./routes";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 1234;

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGOOSE_URI!)
  .then(() => console.log("Successfully connected to mongodb"))
  .catch((e) => console.error(e));

app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`
  ####################################
  🛡️  Server listening on port: ${PORT} 🛡️
  🛡️    http://localhost:${PORT}/api    🛡️
  ####################################
`);
});
