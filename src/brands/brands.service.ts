import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto, UpdateBrandDto } from './dto';

@Injectable()
export class BrandsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.brand.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string) {
        const brand = await this.prisma.brand.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });

        if (!brand) {
            throw new NotFoundException('برند یافت نشد');
        }

        return brand;
    }

    async create(dto: CreateBrandDto) {
        return this.prisma.brand.create({
            data: dto,
        });
    }

    async update(id: string, dto: UpdateBrandDto) {
        const brand = await this.prisma.brand.findUnique({ where: { id } });

        if (!brand) {
            throw new NotFoundException('برند یافت نشد');
        }

        return this.prisma.brand.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        const brand = await this.prisma.brand.findUnique({ where: { id } });

        if (!brand) {
            throw new NotFoundException('برند یافت نشد');
        }

        return this.prisma.brand.delete({
            where: { id },
        });
    }

    async toggleStatus(id: string) {
        const brand = await this.prisma.brand.findUnique({ where: { id } });

        if (!brand) {
            throw new NotFoundException('برند یافت نشد');
        }

        return this.prisma.brand.update({
            where: { id },
            data: { isActive: !brand.isActive },
        });
    }
}
