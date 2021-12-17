import express from "express";
import { UserController } from "@controllers";

const router = express.Router();

router.get("/", UserController.findAll);

router.post("/", UserController.create);
router.post("/notion", UserController.subscriptNotion);

router.delete("/", UserController.deleteUser);
router.delete("/notion", UserController.unSubscriptNotion);

export default router;
