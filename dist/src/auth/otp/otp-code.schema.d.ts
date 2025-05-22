import { HydratedDocument } from 'mongoose';
export type OtpCodeDocument = HydratedDocument<OtpCode>;
export type OtpType = 'signup' | 'password-reset';
export declare class OtpCode {
    _id: string;
    email: string;
    code: string;
    type: OtpType;
    expiresAt: Date;
}
export declare const OtpCodeSchema: import("mongoose").Schema<OtpCode, import("mongoose").Model<OtpCode, any, any, any, import("mongoose").Document<unknown, any, OtpCode, any> & OtpCode & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OtpCode, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<OtpCode>, {}> & import("mongoose").FlatRecord<OtpCode> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
