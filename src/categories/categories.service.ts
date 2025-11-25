import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) { }

  async findAll(activeOnly = false) {
    return this.prisma.category.findMany({
      where: activeOnly ? { isActive: true } : {},
      include: {
        parent: true,
        children: true,
        _count: { select: { products: true } },
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: {
          where: { isActive: true },
          take: 10,
          include: { images: { where: { isPrimary: true }, take: 1 } },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('دسته‌بندی یافت نشد');
    }

    return category;
  }

  async create(data: any) {
    return this.prisma.category.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async toggleStatus(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException('دسته‌بندی یافت نشد');
    }

    return this.prisma.category.update({
      where: { id },
      data: { isActive: !category.isActive },
    });
  }
}
