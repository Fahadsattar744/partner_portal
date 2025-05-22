import { UserRole } from '../schemas/user.schema';
export declare class CreateUserDto {
    email: string;
    username: string;
    password: string;
    fullName?: string;
    role: UserRole;
}
