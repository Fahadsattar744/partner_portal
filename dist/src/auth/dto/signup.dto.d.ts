import { UserRole } from 'src/user/schemas/user.schema';
export declare class SignupDto {
    email: string;
    password: string;
    username: string;
    role?: UserRole;
}
