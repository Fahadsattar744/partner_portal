import {
  Controller,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './schemas/user.schema';
import { UserService } from './user.service';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async me(@UserId() userId: string) {
    return await this.userService.getUserById(userId);
  }

  @Get('validate/:username')
  async validateUsername(@Param('username') username: string) {
    const result = await this.userService.checkUsernameAvailability(username);
    return { available: result };
  }

  @Roles(UserRole.Admin)
  @Get('all')
  async getAll() {
    return await this.userService.getAllUsers();
  }

  @Roles(UserRole.Admin)
  @Patch(':username')
  async updateUser(
    @Param('username') username: string,
    @Body() dto: UpdateUserDto,
    @UserId() currentUserId: string,
  ) {
    const updated = await this.userService.updateByUsername(
      username,
      dto,
      currentUserId,
    );
    return { message: 'User updated.', data: updated };
  }

  @Roles(UserRole.Admin)
  @Delete(':username')
  async deleteUser(@Param('username') username: string) {
    await this.userService.deleteByUsername(username);
    return { message: 'User deleted.' };
  }
}
