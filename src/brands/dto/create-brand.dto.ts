import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
    @ApiProperty({ example: 'مایسا' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'maysa' })
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiProperty({ example: 'برند معتبر کیف و کوله پشتی', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    logo?: string;
}
