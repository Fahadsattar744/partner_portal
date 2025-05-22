import { OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
export declare class RedisService implements OnModuleInit {
    private client;
    onModuleInit(): void;
    getClient(): Redis;
    addToUsernameBloom(username: string): Promise<void>;
    mightExistInBloom(username: string): Promise<boolean>;
    cacheUser(username: string, data: any, ttl?: number): Promise<void>;
    getCachedUser(username: string): Promise<any | null>;
    invalidateUser(username: string): Promise<void>;
}
