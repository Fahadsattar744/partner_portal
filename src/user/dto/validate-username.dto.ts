import { IsString, MinLength } from 'class-validator';

export class ValidateUsernameDto {
  @IsString()
  @MinLength(3)
  username: string;
}
