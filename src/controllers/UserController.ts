import { ISubscriptNotionDTO, IUserDTO } from "@types";
import { RequestHandler } from "express";
import { UserModel } from "models";

/* ---------------- POST ---------------- */

export const create: RequestHandler = async (req, res) => {
  // 유효성 검사

  // body 설정
  const body: IUserDTO = req.body;

  console.log("create user", body);

  if (!body?.name) {
    res.status(400).json({ message: "body error" });
    return;
  }

  // 응답 전송
  const user = await new UserModel(body).save();
  res.send(user);
};

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
