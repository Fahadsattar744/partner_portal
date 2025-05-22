"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = void 0;
const joi_1 = require("joi");
exports.validationSchema = joi_1.default.object({
    PORT: joi_1.default.number().default(3000),
    MONGO_URI: joi_1.default.string().required(),
    JWT_SECRET: joi_1.default.string().required(),
});
//# sourceMappingURL=validation.js.map