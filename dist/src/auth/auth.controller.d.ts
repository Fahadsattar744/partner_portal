import { AuthService } from './auth.service';
import { RefreshDto } from './dto/refresh.dto';
import { SignupDto } from './dto/signup.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(dto: SignupDto): Promise<{
        message: string;
        data: {
            _id: string;
            email: string;
            username: string;
            fullName?: string;
            role: import("../user/schemas/user.schema").UserRole;
            createdAt: Date;
            updatedAt: Date;
            __v: number;
        };
    }>;
    login(req: any): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refresh(req: any, dto: RefreshDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(req: any, dto: RefreshDto): Promise<void>;
    reset(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
