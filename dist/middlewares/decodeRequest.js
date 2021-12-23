"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeRequest = void 0;
const decodeRequest = (req, res, next) => {
    req.url = decodeURIComponent(req.url);
    next();
};
exports.decodeRequest = decodeRequest;
//# sourceMappingURL=decodeRequest.js.map