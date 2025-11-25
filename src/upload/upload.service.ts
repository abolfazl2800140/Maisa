import { Injectable, BadRequestException } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  private readonly uploadPath = join(process.cwd(), 'public', 'uploads');
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  async uploadImage(file: Express.Multer.File): Promise<string> {
    // بررسی نوع فایل
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('فرمت فایل مجاز نیست. فقط JPG, PNG, WebP');
    }

    // بررسی حجم فایل
    if (file.size > this.maxFileSize) {
      throw new BadRequestException('حجم فایل نباید بیشتر از 5 مگابایت باشد');
    }

    // ایجاد پوشه اگر وجود نداشت
    if (!existsSync(this.uploadPath)) {
      await mkdir(this.uploadPath, { recursive: true });
    }

    // ایجاد نام یونیک برای فایل
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.originalname.split('.').pop();
    const filename = `${timestamp}-${randomString}.${extension}`;

    // ذخیره فایل
    const filepath = join(this.uploadPath, filename);
    await writeFile(filepath, file.buffer);

    // برگرداندن URL
    return `/uploads/${filename}`;
  }

  async uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }
}
