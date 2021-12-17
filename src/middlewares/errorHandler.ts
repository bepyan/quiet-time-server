import {
  ErrorRequestHandler,
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";

const DEFAULT_HTTP_STATUS_MESSAGES = {
  400: "Bad Requests",
  401: "Unauthorized",
  403: "Foribdden",
  404: "Not Found",
  409: "duplicate",
  500: "Internal Server Error",
  503: "Temporary Unavailable",
};

export type StatusType = keyof typeof DEFAULT_HTTP_STATUS_MESSAGES;

export interface ErrorWithStatus extends Error {
  status?: StatusType;
}

export const generateError = ({
  message = "",
  status = 500,
}: {
  message: string;
  status: StatusType;
}) => {
  const error: ErrorWithStatus = new Error(
    message || DEFAULT_HTTP_STATUS_MESSAGES[status]
  );
  error.status = status;
  throw error;
};

export const errorLogger: ErrorRequestHandler = (err, req, res, next) => {
  if (err.status >= 500) console.error("\n", err.stack, "\n");
  next(err);
};

export const errorResponser: ErrorRequestHandler = (err, req, res, next) => {
  const { message, status } = err;
  res.status(status || 500).json({ status, message });
};

export const asyncErrorCatcher =
  (fn: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (e: any) {
      e.status = 500;
      next(e);
    }
  };
