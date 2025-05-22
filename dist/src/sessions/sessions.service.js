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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const argon2 = require("argon2");
const uuid_1 = require("uuid");
const config_1 = require("@nestjs/config");
const session_schema_1 = require("./schemas/session.schema");
let SessionsService = class SessionsService {
    sessionModel;
    cfg;
    constructor(sessionModel, cfg) {
        this.sessionModel = sessionModel;
        this.cfg = cfg;
    }
    daysToMs(days) {
        return days * 24 * 60 * 60 * 1000;
    }
    async createSession(userId) {
        const raw = (0, uuid_1.v4)();
        const hash = await argon2.hash(raw);
        const ttlDays = this.cfg.get('jwt.refreshTtlDays') ?? 7;
        const expiresAt = new Date(Date.now() + this.daysToMs(ttlDays));
        await new this.sessionModel({
            userId,
            refreshToken: hash,
            expiresAt,
        }).save();
        return { refreshToken: raw };
    }
    async validateRefreshToken(userId, token) {
        const session = await this.sessionModel
            .findOne({ userId, isActive: true })
            .exec();
        if (!session || session.expiresAt < new Date())
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        if (!(await argon2.verify(session.refreshToken, token)))
            throw new common_1.UnauthorizedException('Invalid refresh token');
        return session;
    }
    async rotateRefreshToken(session) {
        const raw = (0, uuid_1.v4)();
        session.refreshToken = await argon2.hash(raw);
        session.expiresAt = new Date(Date.now() +
            this.daysToMs(this.cfg.get('jwt.refreshTtlDays') ?? 7));
        await session.save();
        return { newToken: raw };
    }
    revokeSession(id) {
        return this.sessionModel.updateOne({ _id: id }, { isActive: false }).exec();
    }
    revokeAll(userId) {
        return this.sessionModel
            .updateMany({ userId, isActive: true }, { isActive: false })
            .exec();
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map