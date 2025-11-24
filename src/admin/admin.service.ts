import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats() {
        // آمار کلی
        const [
            totalProducts,
            totalOrders,
            totalUsers,
            totalReviews,
            pendingOrders,
            lowStockProducts,
            pendingReviews,
            recentOrders,
        ] = await Promise.all([
            // تعداد کل محصولات
            this.prisma.product.count(),

            // تعداد کل سفارشات
            this.prisma.order.count(),

            // تعداد کل کاربران
            this.prisma.user.count(),

            // تعداد کل نظرات
            this.prisma.review.count(),

            // سفارشات در انتظار
            this.prisma.order.count({
                where: { status: 'pending' },
            }),

            // محصولات کم موجودی (variants با موجودی کمتر از 10)
            this.prisma.productVariant.count({
                where: {
                    stockQuantity: { lt: 10 },
                    isActive: true,
                },
            }),

            // نظرات در انتظار تایید
            this.prisma.review.count({
                where: { isApproved: false },
            }),

            // آخرین سفارشات
            this.prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            }),
        ]);

        // محاسبه درآمد کل (سفارشات پرداخت شده)
        const paidOrders = await this.prisma.order.aggregate({
            where: {
                paymentStatus: 'paid',
            },
            _sum: {
                totalAmount: true,
            },
        });

        const totalRevenue = paidOrders._sum.totalAmount || 0;

        // محصولات کم موجودی با جزئیات
        const lowStockProductsList = await this.prisma.productVariant.findMany({
            where: {
                stockQuantity: { lt: 10 },
                isActive: true,
            },
            take: 5,
            include: {
                product: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                stockQuantity: 'asc',
            },
        });

        return {
            totalProducts,
            totalOrders,
            totalUsers,
            totalReviews,
            pendingOrders,
            lowStockProducts,
            pendingReviews,
            totalRevenue: Number(totalRevenue),
            recentOrders: recentOrders.map((order) => ({
                id: order.id,
                orderNumber: order.orderNumber,
                customerName: `${order.user.firstName} ${order.user.lastName}`,
                totalAmount: Number(order.totalAmount),
                status: order.status,
                createdAt: order.createdAt,
            })),
            lowStockProductsList: lowStockProductsList.map((variant) => ({
                id: variant.id,
                productName: variant.product.name,
                sku: variant.sku,
                stockQuantity: variant.stockQuantity,
                color: variant.color,
                size: variant.size,
            })),
        };
    }
}
