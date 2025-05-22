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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const argon2 = require("argon2");
const user_schema_1 = require("./schemas/user.schema");
const redis_service_1 = require("../redis/redis.service");
let UserService = UserService_1 = class UserService {
    userModel;
    redis;
    logger = new common_1.Logger(UserService_1.name);
    constructor(userModel, redis) {
        this.userModel = userModel;
        this.redis = redis;
    }
    findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findById(id) {
        const doc = await this.userModel.findById(id).lean();
        if (!doc)
            throw new common_1.NotFoundException('User not found');
        const { password, ...safe } = doc;
        return safe;
    }
    async validateUser(email, password) {
        const user = await this.userModel.findOne({ email });
        if (!user || !(await argon2.verify(user.password, password)))
            throw new common_1.UnauthorizedException('Invalid credentials');
        return user;
    }
    async create(dto) {
        try {
            if (await this.userModel.exists({ email: dto.email }))
                throw new common_1.BadRequestException('Email already in use');
            if (await this.userModel.exists({ username: dto.username }))
                throw new common_1.BadRequestException('Username already in use');
            const hash = await argon2.hash(dto.password);
            const user = await new this.userModel({
                ...dto,
                password: hash,
            }).save();
            const safeUser = this.leanSafe(user);
            await this.redis.addToUsernameBloom(dto.username);
            await this.redis.cacheUser(dto.username, safeUser);
            return safeUser;
        }
        catch (error) {
            this.logger.error('Error creating user', error.message);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            else {
                throw new common_1.BadRequestException('Failed to create user');
            }
        }
    }
    leanSafe(u) {
        const { password, ...safe } = u.toObject();
        return safe;
    }
    async getUserById(id) {
        const user = await this.userModel.findById(id).select('-password').lean();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async checkUsernameAvailability(username) {
        const mightExist = await this.redis.mightExistInBloom(username);
        if (!mightExist)
            return true;
        const existing = await this.userModel.findOne({ username });
        return !existing;
    }
    async getAllUsers() {
        const users = await this.userModel.find().select('-password').lean();
        return users;
    }
    async updateByUsername(username, dto, currentUserId) {
        const updater = await this.userModel.findById(currentUserId);
        if (!updater)
            throw new common_1.NotFoundException('Updater not found');
        if (dto.role && updater.role !== user_schema_1.UserRole.Admin) {
            throw new common_1.ForbiddenException('Only admins can change roles');
        }
        const updated = await this.userModel
            .findOneAndUpdate({ username }, dto, { new: true })
            .select('-password')
            .lean();
        if (!updated)
            throw new common_1.NotFoundException('User not found');
        await this.redis.invalidateUser(username);
        await this.redis.cacheUser(username, updated);
        return updated;
    }
    async updatePasswordByEmail(email, newPassword) {
        const hash = await argon2.hash(newPassword);
        const updated = await this.userModel.findOneAndUpdate({ email }, { password: hash }, { new: true });
        if (!updated)
            throw new common_1.NotFoundException('User not found');
        return this.leanSafe(updated);
    }
    async deleteByUsername(username) {
        const deleted = await this.userModel.findOneAndDelete({ username });
        if (!deleted)
            throw new common_1.NotFoundException('User not found');
        await this.redis.invalidateUser(username);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        redis_service_1.RedisService])
], UserService);
//# sourceMappingURL=user.service.js.map