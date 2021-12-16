import mongoose from "mongoose";

export const loadDB = () => {
  mongoose.Promise = global.Promise;
  mongoose
    .connect(process.env.MONGOOSE_URI!)
    .then(() => console.log("Successfully connected to mongodb"))
    .catch((e) => console.error(e));
};
