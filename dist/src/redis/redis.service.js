"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
let RedisService = class RedisService {
    client;
    onModuleInit() {
        this.client = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
    }
    getClient() {
        return this.client;
    }
    async addToUsernameBloom(username) {
        await this.client.call('BF.ADD', 'usernames', username);
    }
    async mightExistInBloom(username) {
        const result = await this.client.call('BF.EXISTS', 'usernames', username);
        return result === 1;
    }
    async cacheUser(username, data, ttl = 60) {
        await this.client.setex(`user:${username}`, ttl, JSON.stringify(data));
    }
    async getCachedUser(username) {
        const raw = await this.client.get(`user:${username}`);
        return raw ? JSON.parse(raw) : null;
    }
    async invalidateUser(username) {
        await this.client.del(`user:${username}`);
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)()
], RedisService);
//# sourceMappingURL=redis.service.js.map