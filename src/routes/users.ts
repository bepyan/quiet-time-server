import express from "express";
import { UserController } from "../controllers";

const router = express.Router();

router.get("/", UserController.findAll);
router.get("/:name", UserController.findOne);

router.post("/", UserController.create);
router.post("/notion", UserController.createNotion);
router.post("/notion/subscription", UserController.subscriptNotion);

router.delete("/", UserController.deleteUser);
router.delete("/notion/subscription", UserController.unSubscriptNotion);

export default router;
