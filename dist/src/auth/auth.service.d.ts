import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupDto } from './dto/signup.dto';
import { UserService } from 'src/user/user.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { User, UserRole } from 'src/user/schemas/user.schema';
import { RedisService } from 'src/redis/redis.service';
export declare class AuthService {
    private readonly userService;
    private readonly sessionsService;
    private readonly jwt;
    private readonly redis;
    constructor(userService: UserService, sessionsService: SessionsService, jwt: JwtService, redis: RedisService);
    register(dto: SignupDto): Promise<{
        message: string;
        data: {
            _id: string;
            email: string;
            username: string;
            fullName?: string;
            role: UserRole;
            createdAt: Date;
            updatedAt: Date;
            __v: number;
        };
    }>;
    validateUser(email: string, password: string): Promise<User>;
    login(user: User): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refresh(userId: string, oldToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(userId: string, token: string): Promise<void>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
