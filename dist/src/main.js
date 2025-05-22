"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express_rate_limit_1 = require("express-rate-limit");
const common_1 = require("@nestjs/common");
const secure_headers_middleware_1 = require("./common/middleware/secure-headers.middleware");
const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Amzn-Remapped-Authorization',
        'Refresh_Token',
        'X-Personal-API-Key',
    ],
    exposedHeaders: [
        'Authorization',
        'X-Amzn-Remapped-Authorization',
        'Refresh_Token',
        'X-Personal-API-Key',
    ],
    maxAge: 1800,
};
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(secure_headers_middleware_1.secureHeaders);
    app.enableCors(corsOptions);
    app.getHttpAdapter().getInstance().disable('x-powered-by');
    app.use((0, express_rate_limit_1.default)({
        windowMs: 60_000,
        max: 60,
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map