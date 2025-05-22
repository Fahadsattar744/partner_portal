import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import * as argon2 from 'argon2';
import { User, UserRole } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly redis: RedisService,
  ) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    const doc = await this.userModel.findById(id).lean();
    if (!doc) throw new NotFoundException('User not found');
    const { password, ...safe } = doc;
    return safe;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await argon2.verify(user.password, password)))
      throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async create(dto: CreateUserDto) {
    try {
      if (await this.userModel.exists({ email: dto.email }))
        throw new BadRequestException('Email already in use');
      if (await this.userModel.exists({ username: dto.username }))
        throw new BadRequestException('Username already in use');

      const hash = await argon2.hash(dto.password);
      const user = await new this.userModel({
        ...dto,
        password: hash,
      }).save();

      const safeUser = this.leanSafe(user);

      await this.redis.addToUsernameBloom(dto.username);
      await this.redis.cacheUser(dto.username, safeUser);

      return safeUser;
    } catch (error) {
      this.logger.error('Error creating user', error.message);
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new BadRequestException('Failed to create user');
      }
    }
  }

  private leanSafe(u: User & HydratedDocument<User>) {
    const { password, ...safe } = u.toObject();
    return safe;
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id).select('-password').lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const mightExist = await this.redis.mightExistInBloom(username);
    if (!mightExist) return true;

    const existing = await this.userModel.findOne({ username });
    return !existing;
  }

  async getAllUsers() {
    const users = await this.userModel.find().select('-password').lean();
    return users;
  }

  async updateByUsername(
    username: string,
    dto: UpdateUserDto,
    currentUserId: string,
  ) {
    const updater = await this.userModel.findById(currentUserId);
    if (!updater) throw new NotFoundException('Updater not found');

    if (dto.role && updater.role !== UserRole.Admin) {
      throw new ForbiddenException('Only admins can change roles');
    }

    const updated = await this.userModel
      .findOneAndUpdate({ username }, dto, { new: true })
      .select('-password')
      .lean();

    if (!updated) throw new NotFoundException('User not found');

    await this.redis.invalidateUser(username);
    await this.redis.cacheUser(username, updated);
    return updated;
  }
  async updatePasswordByEmail(email: string, newPassword: string) {
    const hash = await argon2.hash(newPassword);
    const updated = await this.userModel.findOneAndUpdate(
      { email },
      { password: hash },
      { new: true },
    );
    if (!updated) throw new NotFoundException('User not found');
    return this.leanSafe(updated);
  }

  async deleteByUsername(username: string) {
    const deleted = await this.userModel.findOneAndDelete({ username });
    if (!deleted) throw new NotFoundException('User not found');
    await this.redis.invalidateUser(username);
  }
}
