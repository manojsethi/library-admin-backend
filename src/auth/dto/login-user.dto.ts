// src/users/dto/register-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email for login',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'securePassword123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
