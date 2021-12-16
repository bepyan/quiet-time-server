import { ISubscriptNotionDTO, IUserDTO } from "@types";
import { RequestHandler } from "express";
import { body } from "express-validator";
import { validatorErrorChecker } from "middlewares";
import { UserModel } from "models";

/* ---------------- POST ---------------- */

export const create: RequestHandler[] = [
  body("name").notEmpty(),
  validatorErrorChecker,
  async (req, res) => {
    const body: IUserDTO = req.body;

    const user = await new UserModel(body).save();
    res.send(user);
  },
];

export const subscriptNotion: RequestHandler = async (req, res) => {
  const body: ISubscriptNotionDTO = req.body;

  const user = await new UserModel(body).save();
  res.send(user);
};

/* ---------------- GET ---------------- */

export const findAll: RequestHandler = (req, res) => {
  UserModel.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: err.message || "Retrieve document failure." });
    });
};

/* ---------------- UPDATE ---------------- */
