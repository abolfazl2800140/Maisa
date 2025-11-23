import { IsEmail, IsString, MinLength, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'ایمیل معتبر نیست' })
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8, { message: 'رمز عبور باید حداقل 8 کاراکتر باشد' })
  password: string;

  @ApiProperty({ example: 'علی', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'احمدی', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: '09123456789', required: false })
  @IsOptional()
  @Matches(/^09\d{9}$/, { message: 'شماره تلفن معتبر نیست' })
  phone?: string;
}
