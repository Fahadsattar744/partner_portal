import { UserRole } from '../schemas/user.schema';
export declare class ProvisionAgentDto {
    email: string;
    name: string;
    password?: string;
    role?: UserRole;
}
