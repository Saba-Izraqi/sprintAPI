import { IsString, IsDateString, IsUUID, IsBoolean, IsOptional, Length } from "class-validator";
import { Expose } from "class-transformer";

export class CreateSprintDto {
  @IsString()
  @Length(1, 25)
  name!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsUUID()
  projectId!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isComplete?: boolean;
}

export class UpdateSprintDto {
  @IsOptional()
  @IsString()
  @Length(1, 25)
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
  isComplete?: boolean;
}

export class SprintResponseDto {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() startDate!: string;
  @Expose() endDate!: string;
  @Expose() projectId!: string;
  @Expose() isActive!: boolean;
  @Expose() isComplete!: boolean;
}
