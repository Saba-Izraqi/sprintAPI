import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsBoolean,
  MaxLength,
} from "class-validator";

export class CreateSprintDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(25) // Match entity constraint
  name!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  // This will be populated from URL params
  projectId!: string;
}

export class UpdateSprintDto {
  @IsOptional()
  @IsString()
  @MaxLength(25) // Match entity constraint
  name?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}

export class SprintResponseDto {
  id!: string;
  name!: string;
  startDate!: Date;
  endDate!: Date;
  isActive!: boolean;
  isArchived!: boolean;
  projectId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
