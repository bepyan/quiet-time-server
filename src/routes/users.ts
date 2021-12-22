import express from "express";
import { UserController } from "../controllers";

const router = express.Router();

router.get("/", UserController.findAll);
router.get("/:name", UserController.findOne);

router.post("/", UserController.create);
router.post("/:name/notion", UserController.createNotion);
router.post("/:name/notion/subscription", UserController.subscriptNotion);

router.delete("/", UserController.deleteUser);
router.delete("/:name/notion/subscription", UserController.unSubscriptNotion);

export default router;
