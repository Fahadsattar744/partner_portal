import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/user/schemas/user.schema';

export class SignupDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsString()
  username: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
