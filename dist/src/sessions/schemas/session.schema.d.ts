import { HydratedDocument, Types } from 'mongoose';
export type SessionDocument = HydratedDocument<Session>;
export declare class Session {
    _id: string;
    userId: Types.ObjectId;
    refreshToken: string;
    expiresAt: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const SessionSchema: import("mongoose").Schema<Session, import("mongoose").Model<Session, any, any, any, import("mongoose").Document<unknown, any, Session, any> & Session & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Session, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Session>, {}> & import("mongoose").FlatRecord<Session> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
