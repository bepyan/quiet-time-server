import express from "express";
import bible from "./bible";

const router = express.Router();

router.use("/bible", bible);

router.get("/", (req, res, next) => {
  res.send("welcome!");
});

export default router;
