"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
exports.validateQuery = validateQuery;
const error_middleware_1 = require("./error.middleware");
function validateBody(schema) {
    return (req, _res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) {
            throw new error_middleware_1.HttpError(400, 'Validation failed', error.details.map((d) => d.message));
        }
        req.body = value;
        next();
    };
}
function validateQuery(schema) {
    return (req, _res, next) => {
        const { error, value } = schema.validate(req.query, { abortEarly: false, stripUnknown: true });
        if (error) {
            throw new error_middleware_1.HttpError(400, 'Validation failed', error.details.map((d) => d.message));
        }
        req.query = value;
        next();
    };
}
//# sourceMappingURL=validation.middleware.js.map