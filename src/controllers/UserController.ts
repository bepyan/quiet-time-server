import { RequestHandler } from "express";
import { body, param } from "express-validator";
import {
  asyncErrorCatcher,
  generateError,
  validatorErrorChecker,
} from "../middlewares";
import {
  CrawlerService,
  NotionService,
  QTContentService,
  UserService,
} from "../services";

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
  asyncErrorCatcher(async (req, res) => {
    const { name, notion_auth } = req.body;
    const user = await UserService.createUser({ name, notion_auth });
    res.send(user);
  }),
];

export const createNotion: RequestHandler[] = [
  param("name").notEmpty(),
  body("page_id").notEmpty(),
  body("contentType").notEmpty().isIn(CrawlerService.crawlerKeyList),
  validatorErrorChecker,
  asyncErrorCatcher(async (req, res) => {
    const { name } = req.params;
    const { page_id, contentType } = req.body;
    // 사용자 찾기
    const user = await UserService.findUser({ name });
    if (!user)
      return generateError({
        status: 400,
        message: "일치된 사용자가 없습니다.",
      });
    const { notion_auth } = user;

    // 노션 데이터베이스 생성
    const database = await NotionService.createQTDatabase({
      notion_auth,
      page_id,
    });
    const database_id: string = database.id;
    const content = await QTContentService.findOne({ contentType });

    // 노션 페이지 생성
    await NotionService.createQTPage({
      notion_auth,
      database_id,
      content,
    });

    // 구독 데이터 저장
    const result = await UserService.addNotion({
      name,
      notion: { database_id, contentType },
    });
    res.send(result);
  }),
];

export const subscriptNotion: RequestHandler[] = [
  param("name").notEmpty(),
  body("notion").notEmpty(),
  validatorErrorChecker,
  asyncErrorCatcher(async (req, res) => {
    const { name } = req.params;
    const { notion } = req.body;
    //  중복된 구독이면 에러
    if (await UserService.hasSubscript({ name, notion })) {
      generateError({ status: 400, message: "중복된 구독정보가 있습니다." });
      return;
    }

    const result = await UserService.addNotion({ name, notion });
    res.send(result);
  }),
];

export const unSubscriptNotion: RequestHandler[] = [
  param("name").notEmpty(),
  body("notion").notEmpty(),
  validatorErrorChecker,
  asyncErrorCatcher(async (req, res) => {
    const { name } = req.params;
    const { notion } = req.body;
    const user = await UserService.deleteNotion({ name, notion });
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
