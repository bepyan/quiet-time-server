import express from "express";
import bible from "./bible";
import notion from "./notion";

const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("welcome!");
});

router.use("/bible", bible);
router.use("/notion", notion);

export default router;
