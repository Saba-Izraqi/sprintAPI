import { StatusType } from '../entities/status.entity';
import {
  IsString,
  Length,
  IsOptional, 
  IsUUID,
  IsEnum,
} from "class-validator";
import { Exclude, Expose } from 'class-transformer';

export class CreateStatusDto {
  @IsString()
  @Length(2, 50)
  name!: string;

  @IsEnum(StatusType)
  type!: StatusType;

  @IsOptional()
  @IsUUID()
  columnId?: string;
}

export class UpdateStatusDto {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  name?: string;

  @IsOptional()
  @IsEnum(StatusType)
  type?: StatusType;

  @IsOptional()
  @IsUUID()
  columnId?: string | null;
}

@Exclude()
export class StatusResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  type!: StatusType;

  @Expose()
  @IsOptional()
  @IsUUID()
  columnId?: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  constructor(status: Partial<StatusResponseDto>) {
    Object.assign(this, status);
  }
}