"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncErrorCatcher = exports.errorResponser = exports.errorLogger = exports.generateError = void 0;
const DEFAULT_HTTP_STATUS_MESSAGES = {
    400: "Bad Requests",
    401: "Unauthorized",
    403: "Foribdden",
    404: "Not Found",
    409: "duplicate",
    500: "Internal Server Error",
    503: "Temporary Unavailable",
};
const generateError = ({ message = "", status = 500, }) => {
    const error = new Error(message || DEFAULT_HTTP_STATUS_MESSAGES[status]);
    error.status = status;
    throw error;
};
exports.generateError = generateError;
const errorLogger = (err, req, res, next) => {
    if (err.status >= 500)
        console.error("\n", err.stack, "\n");
    next(err);
};
exports.errorLogger = errorLogger;
const errorResponser = (err, req, res, next) => {
    const { message, status } = err;
    res.status(status || 500).json({ status, message });
};
exports.errorResponser = errorResponser;
const asyncErrorCatcher = (fn) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fn(req, res, next);
    }
    catch (e) {
        e.status = 500;
        next(e);
    }
});
exports.asyncErrorCatcher = asyncErrorCatcher;
//# sourceMappingURL=errorHandler.js.map