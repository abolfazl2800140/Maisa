import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto, ChangeRoleDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(UserRole.super_admin)
  @ApiOperation({ summary: 'لیست همه کاربران (فقط سوپر ادمین)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت اطلاعات یک کاربر' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'ویرایش اطلاعات کاربر' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/role')
  @Roles(UserRole.super_admin)
  @ApiOperation({ summary: 'تغییر نقش کاربر (فقط سوپر ادمین)' })
  changeRole(
    @Param('id') id: string,
    @Body() dto: ChangeRoleDto,
    @GetUser('id') currentUserId: string,
  ) {
    return this.usersService.changeRole(id, dto, currentUserId);
  }

  @Patch(':id/toggle-active')
  @Roles(UserRole.super_admin)
  @ApiOperation({ summary: 'فعال/غیرفعال کردن کاربر (فقط سوپر ادمین)' })
  toggleActive(@Param('id') id: string, @GetUser('id') currentUserId: string) {
    return this.usersService.toggleActive(id, currentUserId);
  }
}
