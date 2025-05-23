import { IsNotEmpty, IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { StatusType } from '../entities/status.entity';

export class CreateStatusDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsEnum(StatusType)
  type?: StatusType;

  @IsOptional()
  @IsUUID()
  columnId?: string;
}

export class UpdateStatusDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(StatusType)
  type?: StatusType;

  @IsOptional()
  @IsUUID()
  columnId?: string;
}

export class StatusResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;
  
  @Expose()
  type!: StatusType;

  @Expose()
  columnId?: string;
  
  @Expose()
  createdAt!: Date;
  
  @Expose()
  updatedAt!: Date;
}
