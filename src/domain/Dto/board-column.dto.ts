import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  Length,
  IsUUID
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreateBoardColumnDto {
  @IsString()
  @Length(2, 50)
  name!: string;

  @IsInt()
  @Min(0)
  @Max(1000)
  order!: number;
}

export class UpdateBoardColumnDto {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000)
  order?: number;
}

export class BoardColumnResponseDto {
  @Expose()
  @IsUUID()
  id!: string;

  @Expose()
  @IsString()
  name!: string;

  @Expose()
  @IsInt()
  order!: number;

  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @Expose()
  @Type(() => Date)
  updatedAt!: Date;
}