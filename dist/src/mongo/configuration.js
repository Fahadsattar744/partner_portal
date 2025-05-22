"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_process_1 = require("node:process");
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('mongo', () => ({
    url: node_process_1.env.MONGODB_URL,
    username: node_process_1.env.MONGODB_ATLAS_USERNAME,
    password: node_process_1.env.MONGODB_ATLAS_PASSWORD,
    host: node_process_1.env.MONGODB_ATLAS_URL,
    database: node_process_1.env.MONGODB_ATLAS_DATABASE || 'partner_portal',
}));
//# sourceMappingURL=configuration.js.map