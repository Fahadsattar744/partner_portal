import { Model } from 'mongoose';
import { User, UserRole } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserService {
    private readonly userModel;
    private readonly redis;
    private readonly logger;
    constructor(userModel: Model<User>, redis: RedisService);
    findByEmail(email: string): Promise<(import("mongoose").Document<unknown, {}, User, {}> & User & Required<{
        _id: string;
    }>) | null>;
    findById(id: string): Promise<{
        _id: string;
        email: string;
        username: string;
        fullName?: string | undefined;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
        __v: number;
    }>;
    validateUser(email: string, password: string): Promise<User>;
    create(dto: CreateUserDto): Promise<{
        _id: string;
        email: string;
        username: string;
        fullName?: string;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
        __v: number;
    }>;
    private leanSafe;
    getUserById(id: string): Promise<import("mongoose").FlattenMaps<{
        _id: string;
        email: string;
        username: string;
        password: string;
        fullName?: string | undefined;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
        __v: number;
    }> & Required<{
        _id: string;
    }>>;
    checkUsernameAvailability(username: string): Promise<boolean>;
    getAllUsers(): Promise<(import("mongoose").FlattenMaps<{
        _id: string;
        email: string;
        username: string;
        password: string;
        fullName?: string | undefined;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
        __v: number;
    }> & Required<{
        _id: string;
    }>)[]>;
    updateByUsername(username: string, dto: UpdateUserDto, currentUserId: string): Promise<import("mongoose").FlattenMaps<{
        _id: string;
        email: string;
        username: string;
        password: string;
        fullName?: string | undefined;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
        __v: number;
    }> & Required<{
        _id: string;
    }>>;
    updatePasswordByEmail(email: string, newPassword: string): Promise<{
        _id: string;
        email: string;
        username: string;
        fullName?: string;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
        __v: number;
    }>;
    deleteByUsername(username: string): Promise<void>;
}
