import { UserController } from "controllers";
import express from "express";
import { validatorErrorChecker } from "middlewares";

const router = express.Router();

router.get("/", UserController.findAll);
router.post("/", UserController.create);
router.post("/notion", UserController.subscriptNotion);

export default router;
