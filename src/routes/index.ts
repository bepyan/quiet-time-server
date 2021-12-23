import express from "express";
import bible from "./bible";
import notion from "./notion";
import qtcontent from "./qt-content";
import users from "./users";

const router = express.Router();

router.get("/", (req, res, next) => {
  res.json({ message: "welcome!" });
});

router.use("/bible", bible);
router.use("/notion", notion);
router.use("/qt-content", qtcontent);
router.use("/users", users);

export default router;
