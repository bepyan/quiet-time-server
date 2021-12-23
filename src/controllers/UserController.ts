import { RequestHandler } from "express";
import { body, param } from "express-validator";
import {
  asyncErrorCatcher,
  generateError,
  validatorErrorChecker,
} from "../middlewares";
import { CrawlerService, NotionService, UserService } from "../services";

/* ---------------- GET ---------------- */

export const findAll: RequestHandler = async (req, res) => {
  const data = await UserService.findAll();
  res.send(data);
};

export const findOne: RequestHandler[] = [
  param("name").notEmpty(),
  validatorErrorChecker,
  async (req, res) => {
    const data = await UserService.findUser({ name: req.params.name });
    res.send(data);
  },
];

/* ---------------- POST ---------------- */

export const create: RequestHandler[] = [
  body("name").notEmpty(),
  body("notion_auth").notEmpty(),
  validatorErrorChecker,
  async (req, res) => {
    const user = await UserService.createUser(req.body);
    res.send(user);
  },
];

export const createNotion: RequestHandler[] = [
  body("name").notEmpty(),
  body("page_id").notEmpty(),
  body("contentType").notEmpty().isIn(CrawlerService.crawlerKeyList),
  validatorErrorChecker,
  asyncErrorCatcher(async (req, res) => {
    const { name, page_id, contentType } = req.body;
    const user = await UserService.findUser({ name });
    if (!user) {
      generateError({ status: 404, message: "일치된 사용자가 없습니다." });
      return;
    }
    const { notion_auth } = user;

    const database = await NotionService.createQTDatabase({
      notion_auth,
      page_id,
    });
    const database_id: string = database.id;

    await NotionService.createQTPage({
      notion_auth,
      database_id,
      contentType,
    });

    const result = await UserService.addNotion({
      name,
      notion: { database_id, contentType },
    });
    res.send(result);
  }),
];

export const subscriptNotion: RequestHandler[] = [
  body("name").notEmpty(),
  body("notion").notEmpty(),
  validatorErrorChecker,
  asyncErrorCatcher(async (req, res) => {
    const { name, notion } = req.body;
    const result = await UserService.addNotion({ name, notion });
    res.send(result);
  }),
];

export const unSubscriptNotion: RequestHandler[] = [
  body("name").notEmpty(),
  body("notion").notEmpty(),
  validatorErrorChecker,
  asyncErrorCatcher(async (req, res) => {
    const user = await UserService.deleteNotion(req.body);
    res.send(user);
  }),
];

/* ---------------- UPDATE ---------------- */

/* ---------------- DELETE ---------------- */

export const deleteUser: RequestHandler[] = [
  body("name").notEmpty(),
  validatorErrorChecker,
  asyncErrorCatcher(async (req, res) => {
    const user = await UserService.deleteUser(req.body.name);
    res.send(user);
  }),
];
