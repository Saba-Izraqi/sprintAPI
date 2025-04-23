import { 
  IsString, 
  IsDateString, 
  IsUUID, 
  IsOptional,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsDate,
  MinDate,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreateSprintDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name!: string;

  @IsDateString()
  @IsNotEmpty()
  startDate!: Date;

  @IsDateString()
  endDate!: Date;

  @IsUUID('4',)
  boardProjectId!: string;
}

export class UpdateSprintDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @MinDate(new Date())
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  
  endDate?: Date;
}

export class SprintResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  @Type(() => Date)
  startDate!: Date;

  @Expose()
  @Type(() => Date)
  endDate!: Date;

  @Expose()
  boardProjectId!: string;

  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @Expose()
  @Type(() => Date)
  updatedAt!: Date;

  constructor(partial: Partial<SprintResponseDto>) {
    Object.assign(this, partial);
  }
}