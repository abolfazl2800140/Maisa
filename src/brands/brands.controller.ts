import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
    constructor(private brandsService: BrandsService) { }

    @Get()
    @ApiOperation({ summary: 'لیست برندها' })
    findAll() {
        return this.brandsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'دریافت برند با ID' })
    findOne(@Param('id') id: string) {
        return this.brandsService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.admin, UserRole.super_admin)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'ایجاد برند جدید (فقط ادمین)' })
    create(@Body() dto: CreateBrandDto) {
        return this.brandsService.create(dto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.admin, UserRole.super_admin)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'ویرایش برند (فقط ادمین)' })
    update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
        return this.brandsService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.admin, UserRole.super_admin)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'حذف برند (فقط ادمین)' })
    remove(@Param('id') id: string) {
        return this.brandsService.remove(id);
    }

    @Patch(':id/toggle-status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.admin, UserRole.super_admin)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'فعال/غیرفعال کردن برند (فقط ادمین)' })
    toggleStatus(@Param('id') id: string) {
        return this.brandsService.toggleStatus(id);
    }
}
