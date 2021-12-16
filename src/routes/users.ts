import { UserController } from "controllers";
import express from "express";

const router = express.Router();

router.get("/", UserController.findAll);
router.post("/", UserController.create);
router.post("/notion", UserController.subscriptNotion);

export default router;
