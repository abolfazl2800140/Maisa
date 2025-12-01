import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const { images, variants, ...productData } = dto;

    // Generate base SKU from product name
    const baseSku = productData.name
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z]/g, 'X') + '-' + Date.now().toString().slice(-6);

    // اطمینان از یونیک بودن slug
    let slug = productData.slug;
    const existingProduct = await this.prisma.product.findUnique({
      where: { slug },
    });
    if (existingProduct) {
      slug = `${slug}-${Date.now().toString().slice(-6)}`;
    }

    // ایجاد محصول
    const product = await this.prisma.product.create({
      data: {
        ...productData,
        slug,
        variants: variants
          ? {
              create: variants.map((v, index) => ({
                ...v,
                sku: v.sku || `${baseSku}-${index + 1}`,
              })),
            }
          : undefined,
      },
    });

    // اتصال تصاویر آپلود شده به محصول
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await this.prisma.productImage.update({
          where: { id: img.imageId },
          data: {
            productId: product.id,
            altText: img.altText,
            displayOrder: img.displayOrder ?? i,
            isPrimary: img.isPrimary ?? i === 0,
          },
        });
      }
    }

    // برگرداندن محصول با تمام اطلاعات
    return this.prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        brand: true,
        images: {
          select: {
            id: true,
            mimeType: true,
            fileName: true,
            altText: true,
            displayOrder: true,
            isPrimary: true,
          },
        },
        variants: true,
      },
    });
  }

  async findAll(query: ProductQueryDto) {
    const {
      page = 1,
      limit = 20,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isFeatured,
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;

    if (minPrice || maxPrice) {
      where.finalPrice = {};
      if (minPrice) where.finalPrice.gte = minPrice;
      if (maxPrice) where.finalPrice.lte = maxPrice;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
          images: { 
            orderBy: { displayOrder: 'asc' }, 
            take: 1,
            select: { id: true, mimeType: true, isPrimary: true },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: { 
          orderBy: { displayOrder: 'asc' },
          select: { id: true, mimeType: true, fileName: true, altText: true, displayOrder: true, isPrimary: true },
        },
        variants: { where: { isActive: true } },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('محصول یافت نشد');
    }

    // افزایش تعداد بازدید
    await this.prisma.product.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: { 
          orderBy: { displayOrder: 'asc' },
          select: { id: true, mimeType: true, fileName: true, altText: true, displayOrder: true, isPrimary: true },
        },
        variants: { where: { isActive: true } },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('محصول یافت نشد');
    }

    // افزایش تعداد بازدید
    await this.prisma.product.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('محصول یافت نشد');
    }

    const { images, variants, ...updateData } = dto;

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        brand: true,
        images: true,
        variants: true,
      },
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('محصول یافت نشد');
    }

    // Soft delete
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
