import { IsNotEmpty, IsString, IsOptional, IsInt, Min, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateBoardColumnDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  order!: number;
}

export class UpdateBoardColumnDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

export class BoardColumnResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;
  
  @Expose()
  order!: number;

  @Expose()
  createdAt!: Date;
  
  @Expose()
  updatedAt!: Date;

  @Expose()
  statuses?: any[]; // This will be populated if the statuses relation is loaded
}
