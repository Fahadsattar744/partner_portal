import { UserRole } from '../schemas/user.schema';
export declare class QueryUserDto {
    role?: 'all' | UserRole.AgencyAdmin | UserRole.AgencyFieldAgent;
    agencyId?: string;
    email?: string;
    skip?: number;
    limit?: number;
}
