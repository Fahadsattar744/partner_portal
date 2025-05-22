import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
export declare enum UserRole {
    Admin = "admin",
    Editor = "editor",
    Viewer = "viewer"
}
export declare class User {
    _id: string;
    email: string;
    username: string;
    password: string;
    fullName?: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}
export declare const UserSchema: MongooseSchema<User, import("mongoose").Model<User, any, any, any, import("mongoose").Document<unknown, any, User, any> & User & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<User>, {}> & import("mongoose").FlatRecord<User> & Required<{
    _id: string;
}>>;
