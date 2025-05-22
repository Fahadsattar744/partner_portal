import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupDto } from './dto/signup.dto';
import { UserService } from 'src/user/user.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { User, UserRole } from 'src/user/schemas/user.schema';
import { JwtPayload } from './strategies/jwt.strategy';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionsService: SessionsService,
    private readonly jwt: JwtService,
    private readonly redis: RedisService,
  ) {}

  async register(dto: SignupDto) {
    if (!dto.role || !Object.values(UserRole).includes(dto.role)) {
      throw new BadRequestException('Invalid role specified.');
    }

    const user = await this.userService.create({
      ...dto,
      username: dto.username,
      role: dto.role,
    });

    await this.redis.addToUsernameBloom(user.username);
    await this.redis.cacheUser(user.username, user);

    return {
      message: `${dto.role} Created`,
      data: user,
    };
  }

  async validateUser(email: string, password: string) {
    return this.userService.validateUser(email, password);
  }

  async login(user: User) {
    const { refreshToken } = await this.sessionsService.createSession(
      user._id.toString(),
    );

    const payload: JwtPayload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwt.sign(payload),
      refresh_token: refreshToken,
    };
  }

  async refresh(userId: string, oldToken: string) {
    const session = await this.sessionsService.validateRefreshToken(
      userId,
      oldToken,
    );
    const { newToken } = await this.sessionsService.rotateRefreshToken(session);

    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const payload: JwtPayload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwt.sign(payload),
      refresh_token: newToken,
    };
  }

  async logout(userId: string, token: string) {
    const session = await this.sessionsService.validateRefreshToken(
      userId,
      token,
    );
    await this.sessionsService.revokeSession(session._id.toString());
  }

  async resetPassword(dto: ResetPasswordDto) {
    await this.userService.updatePasswordByEmail(dto.email, dto.password);
    return { message: 'Password updated' };
  }
}
