"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const sessions_service_1 = require("../sessions/sessions.service");
const user_schema_1 = require("../user/schemas/user.schema");
const redis_service_1 = require("../redis/redis.service");
let AuthService = class AuthService {
    userService;
    sessionsService;
    jwt;
    redis;
    constructor(userService, sessionsService, jwt, redis) {
        this.userService = userService;
        this.sessionsService = sessionsService;
        this.jwt = jwt;
        this.redis = redis;
    }
    async register(dto) {
        if (!dto.role || !Object.values(user_schema_1.UserRole).includes(dto.role)) {
            throw new common_1.BadRequestException('Invalid role specified.');
        }
        const user = await this.userService.create({
            ...dto,
            username: dto.username,
            role: dto.role,
        });
        await this.redis.addToUsernameBloom(user.username);
        await this.redis.cacheUser(user.username, user);
        return {
            message: `${dto.role} Created`,
            data: user,
        };
    }
    async validateUser(email, password) {
        return this.userService.validateUser(email, password);
    }
    async login(user) {
        const { refreshToken } = await this.sessionsService.createSession(user._id.toString());
        const payload = {
            sub: user._id,
            email: user.email,
            role: user.role,
        };
        return {
            access_token: this.jwt.sign(payload),
            refresh_token: refreshToken,
        };
    }
    async refresh(userId, oldToken) {
        const session = await this.sessionsService.validateRefreshToken(userId, oldToken);
        const { newToken } = await this.sessionsService.rotateRefreshToken(session);
        const user = await this.userService.findById(userId);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const payload = {
            sub: user._id,
            email: user.email,
            role: user.role,
        };
        return {
            access_token: this.jwt.sign(payload),
            refresh_token: newToken,
        };
    }
    async logout(userId, token) {
        const session = await this.sessionsService.validateRefreshToken(userId, token);
        await this.sessionsService.revokeSession(session._id.toString());
    }
    async resetPassword(dto) {
        await this.userService.updatePasswordByEmail(dto.email, dto.password);
        return { message: 'Password updated' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        sessions_service_1.SessionsService,
        jwt_1.JwtService,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map