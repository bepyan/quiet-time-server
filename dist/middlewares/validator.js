"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorErrorChecker = void 0;
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("./errorHandler");
const validatorErrorChecker = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        (0, errorHandler_1.generateError)({
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
exports.validatorErrorChecker = validatorErrorChecker;
//# sourceMappingURL=validator.js.map