import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { UploadService } from './upload.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @ApiOperation({ summary: 'آپلود یک تصویر' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('فایلی انتخاب نشده است');
    }

    const id = await this.uploadService.uploadImage(file);
    return {
      success: true,
      id,
      url: `/upload/image/${id}`,
      message: 'تصویر با موفقیت آپلود شد',
    };
  }

  @Post('images')
  @ApiOperation({ summary: 'آپلود چند تصویر' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('فایلی انتخاب نشده است');
    }

    const ids = await this.uploadService.uploadMultipleImages(files);
    return {
      success: true,
      ids,
      urls: ids.map(id => `/upload/image/${id}`),
      count: ids.length,
      message: `${ids.length} تصویر با موفقیت آپلود شد`,
    };
  }

  @Get('image/:id')
  @ApiOperation({ summary: 'دریافت تصویر' })
  async getImage(@Param('id') id: string, @Res() res: Response) {
    const image = await this.uploadService.getImage(id);
    
    res.set({
      'Content-Type': image.mimeType,
      'Cache-Control': 'public, max-age=31536000',
    });
    
    res.send(image.data);
  }
}
