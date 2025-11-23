import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class ChangeRoleDto {
  @ApiProperty({ enum: UserRole, example: UserRole.admin })
  @IsEnum(UserRole, { message: 'نقش معتبر نیست' })
  role: UserRole;
}
