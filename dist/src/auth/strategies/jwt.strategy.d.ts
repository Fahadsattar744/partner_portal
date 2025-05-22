import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly cfg;
    private readonly userService;
    constructor(cfg: ConfigService, userService: UserService);
    validate(payload: JwtPayload): Promise<{
        _id: string;
        email: string;
        role: import("../../user/schemas/user.schema").UserRole;
    }>;
}
export {};
