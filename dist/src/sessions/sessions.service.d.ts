import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { SessionDocument } from './schemas/session.schema';
export declare class SessionsService {
    private readonly sessionModel;
    private readonly cfg;
    constructor(sessionModel: Model<SessionDocument>, cfg: ConfigService);
    private daysToMs;
    createSession(userId: string): Promise<{
        refreshToken: string;
    }>;
    validateRefreshToken(userId: string, token: string): Promise<SessionDocument>;
    rotateRefreshToken(session: SessionDocument): Promise<{
        newToken: string;
    }>;
    revokeSession(id: string): Promise<import("mongoose").UpdateWriteOpResult>;
    revokeAll(userId: string): Promise<import("mongoose").UpdateWriteOpResult>;
}
