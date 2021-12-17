import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { generateError } from "./errorHandler";

export const validatorErrorChecker: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    generateError({
      status: 400,
      message: errors
        .array()
        .map((v) => v.msg)
        .join(", "),
    });
    return;
  }

  next();
};
