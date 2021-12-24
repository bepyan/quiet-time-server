import express from "express";
import craw from "./craw";
import qtcontent from "./qt-content";
import users from "./users";

const router = express.Router();

router.get("/", (req, res, next) => {
  res.json({ message: "welcome!" });
});

router.use("/craw", craw);
router.use("/qt-content", qtcontent);
router.use("/users", users);

export default router;
