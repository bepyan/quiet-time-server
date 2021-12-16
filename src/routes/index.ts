import express from "express";
import bible from "./bible";
import notion from "./notion";
import users from "./users";

const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("welcome!");
});

router.use("/bible", bible);
router.use("/notion", notion);
router.use("/users", users);

export default router;
