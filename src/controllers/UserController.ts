import { RequestHandler } from "express";
import { body } from "express-validator";
import { validatorErrorChecker } from "../middlewares";
import { UserService } from "../services";

/* ---------------- GET ---------------- */

export const findAll: RequestHandler = async (req, res) => {
  const data = await UserService.findAll();
  res.send(data);
};

/* ---------------- POST ---------------- */

export const create: RequestHandler[] = [
  body("name").notEmpty(),
  validatorErrorChecker,
  async (req, res) => {
    const user = await UserService.createUser(req.body);
    res.send(user);
  },
];

export const subscriptNotion: RequestHandler[] = [
  body("name").notEmpty(),
  body("notion").notEmpty(),
  validatorErrorChecker,
  async (req, res) => {
    const user = await UserService.addNotion(req.body);
    res.send(user);
  },
];

export const unSubscriptNotion: RequestHandler[] = [
  body("name").notEmpty(),
  body("notion").notEmpty(),
  validatorErrorChecker,
  async (req, res) => {
    const user = await UserService.delelteNotion(req.body);
    res.send(user);
  },
];

/* ---------------- UPDATE ---------------- */

/* ---------------- DELETE ---------------- */

export const deleteUser: RequestHandler[] = [
  body("name").notEmpty(),
  validatorErrorChecker,
  async (req, res) => {
    const user = await UserService.deleteUser(req.body.name);
    res.send(user);
  },
];
