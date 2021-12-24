import { RequestHandler } from "express";

export const decodeRequest: RequestHandler = (req, res, next) => {
  req.url = decodeURIComponent(req.url);
  next();
};
