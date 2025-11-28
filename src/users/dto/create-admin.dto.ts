import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateAdminDto {
    @ApiProperty({ example: 'admin@example.com' })
    @IsEmail({}, { message: 'ایمیل معتبر نیست' })
    email: string;

    @ApiProperty({ example: 'Admin123456' })
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
    @IsString()
    phone?: string;

    @ApiProperty({ enum: UserRole, example: UserRole.admin })
    @IsEnum(UserRole, { message: 'نقش معتبر نیست' })
    role: UserRole;
}
