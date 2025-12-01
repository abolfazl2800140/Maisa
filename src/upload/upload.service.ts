import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadService {
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  constructor(private prisma: PrismaService) {}

  validateFile(file: Express.Multer.File): void {
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('فرمت فایل مجاز نیست. فقط JPG, PNG, WebP');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('حجم فایل نباید بیشتر از 5 مگابایت باشد');
    }
  }

  // آپلود تصویر و ذخیره در دیتابیس - برگرداندن ID
  async uploadImage(file: Express.Multer.File): Promise<string> {
    this.validateFile(file);

    // ذخیره موقت بدون productId - بعداً به محصول متصل میشه
    const image = await this.prisma.productImage.create({
      data: {
        imageData: Buffer.from(file.buffer),
        mimeType: file.mimetype,
        fileName: file.originalname,
      },
    });

    return image.id;
  }

  // آپلود چند تصویر
  async uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]> {
    const ids: string[] = [];
    
    for (const file of files) {
      const id = await this.uploadImage(file);
      ids.push(id);
    }
    
    return ids;
  }

  // دریافت تصویر از دیتابیس
  async getImage(id: string): Promise<{ data: Uint8Array; mimeType: string }> {
    const image = await this.prisma.productImage.findUnique({
      where: { id },
      select: { imageData: true, mimeType: true },
    });

    if (!image) {
      throw new NotFoundException('تصویر یافت نشد');
    }

    return {
      data: image.imageData,
      mimeType: image.mimeType,
    };
  }

  // ذخیره تصویر مستقیم برای محصول
  async saveProductImage(
    productId: string,
    file: Express.Multer.File,
    isPrimary: boolean = false,
    displayOrder: number = 0,
  ): Promise<string> {
    this.validateFile(file);

    const image = await this.prisma.productImage.create({
      data: {
        productId,
        imageData: Buffer.from(file.buffer),
        mimeType: file.mimetype,
        fileName: file.originalname,
        isPrimary,
        displayOrder,
      },
    });

    return image.id;
  }
}
