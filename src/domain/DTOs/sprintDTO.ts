import { IsNotEmpty, IsString, IsOptional, IsISO8601, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateSprintDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsISO8601()
  startDate!: string;

  @IsNotEmpty()
  @IsISO8601()
  endDate!: string;

  @IsNotEmpty()
  @IsString()
  boardProjectId!: string;
}

export class UpdateSprintDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @IsOptional()
  @IsString()
  boardProjectId?: string;
}

export class SprintResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  startDate!: Date;

  @Expose()
  endDate!: Date;

  @Expose()
  boardProjectId!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
