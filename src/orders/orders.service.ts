import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    const orderNumber = `ORD-${Date.now()}`;

    return this.prisma.order.create({
      data: {
        ...data,
        orderNumber,
        userId,
      },
      include: {
        items: true,
        address: true,
      },
    });
  }

  async findAll(userId: string, userRole: UserRole) {
    const where = userRole === UserRole.customer ? { userId } : {};

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: { select: { name: true, slug: true } },
            },
          },
          user: { select: { email: true, firstName: true, lastName: true, phone: true } },
          address: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: string, userId: string, userRole: UserRole) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        user: { select: { email: true, firstName: true, lastName: true, phone: true } },
        address: true,
      },
    });

    if (!order) {
      throw new NotFoundException('سفارش یافت نشد');
    }

    // بررسی دسترسی
    if (userRole === UserRole.customer && order.userId !== userId) {
      throw new ForbiddenException('شما دسترسی به این سفارش ندارید');
    }

    return order;
  }

  async updateStatus(
    id: string, 
    data: { status: string; trackingCode?: string; adminNotes?: string },
    userRole: UserRole
  ) {
    if (userRole === UserRole.customer) {
      throw new ForbiddenException('شما دسترسی ندارید');
    }

    const updateData: any = { status: data.status as any };
    
    if (data.trackingCode !== undefined) {
      updateData.trackingCode = data.trackingCode;
    }
    if (data.adminNotes !== undefined) {
      updateData.adminNotes = data.adminNotes;
    }
    
    // اگر وضعیت به shipped تغییر کرد، تاریخ ارسال رو ثبت کن
    if (data.status === 'shipped') {
      updateData.shippedAt = new Date();
    }
    // اگر وضعیت به delivered تغییر کرد، تاریخ تحویل رو ثبت کن
    if (data.status === 'delivered') {
      updateData.deliveredAt = new Date();
    }
    // اگر وضعیت به cancelled تغییر کرد، تاریخ لغو رو ثبت کن
    if (data.status === 'cancelled') {
      updateData.cancelledAt = new Date();
    }

    return this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        user: { select: { email: true, firstName: true, lastName: true, phone: true } },
        address: true,
      },
    });
  }
}
