import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Session, SessionDocument } from './schemas/session.schema';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
    private readonly cfg: ConfigService,
  ) {}

  private daysToMs(days: number) {
    return days * 24 * 60 * 60 * 1000;
  }

  async createSession(userId: string): Promise<{ refreshToken: string }> {
    const raw = uuidv4();
    const hash = await argon2.hash(raw);
    const ttlDays = this.cfg.get<number>('jwt.refreshTtlDays') ?? 7;
    const expiresAt = new Date(Date.now() + this.daysToMs(ttlDays));

    await new this.sessionModel({
      userId,
      refreshToken: hash,
      expiresAt,
    }).save();
    return { refreshToken: raw };
  }

  async validateRefreshToken(
    userId: string,
    token: string,
  ): Promise<SessionDocument> {
    const session = await this.sessionModel
      .findOne({ userId, isActive: true })
      .exec();
    if (!session || session.expiresAt < new Date())
      throw new UnauthorizedException('Invalid or expired refresh token');

    if (!(await argon2.verify(session.refreshToken, token)))
      throw new UnauthorizedException('Invalid refresh token');

    return session;
  }

  async rotateRefreshToken(
    session: SessionDocument,
  ): Promise<{ newToken: string }> {
    const raw = uuidv4();
    session.refreshToken = await argon2.hash(raw);
    session.expiresAt = new Date(
      Date.now() +
        this.daysToMs(this.cfg.get<number>('jwt.refreshTtlDays') ?? 7),
    );
    await session.save();
    return { newToken: raw };
  }

  revokeSession(id: string) {
    return this.sessionModel.updateOne({ _id: id }, { isActive: false }).exec();
  }

  revokeAll(userId: string) {
    return this.sessionModel
      .updateMany({ userId, isActive: true }, { isActive: false })
      .exec();
  }
}
