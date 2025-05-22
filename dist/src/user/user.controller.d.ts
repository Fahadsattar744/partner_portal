import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './schemas/user.schema';
import { UserService } from './user.service';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UserService);
    me(userId: string): Promise<import("mongoose").FlattenMaps<{
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
    validateUsername(username: string): Promise<{
        available: boolean;
    }>;
    getAll(): Promise<(import("mongoose").FlattenMaps<{
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
    updateUser(username: string, dto: UpdateUserDto, currentUserId: string): Promise<{
        message: string;
        data: import("mongoose").FlattenMaps<{
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
        }>;
    }>;
    deleteUser(username: string): Promise<{
        message: string;
    }>;
}
