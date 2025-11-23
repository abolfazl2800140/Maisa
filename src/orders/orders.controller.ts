import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'ایجاد سفارش جدید' })
  create(@GetUser('id') userId: string, @Body() data: any) {
    return this.ordersService.create(userId, data);
  }

  @Get()
  @ApiOperation({ summary: 'لیست سفارشات' })
  findAll(@GetUser('id') userId: string, @GetUser('role') userRole: UserRole) {
    return this.ordersService.findAll(userId, userRole);
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت جزئیات سفارش' })
  findOne(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @GetUser('role') userRole: UserRole,
  ) {
    return this.ordersService.findOne(id, userId, userRole);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.admin, UserRole.super_admin)
  @ApiOperation({ summary: 'تغییر وضعیت سفارش (فقط ادمین)' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @GetUser('role') userRole: UserRole,
  ) {
    return this.ordersService.updateStatus(id, status, userRole);
  }
}
