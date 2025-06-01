import { IsString, IsDateString, IsUUID, IsBoolean, IsOptional, Length } from "class-validator";
import { Expose, Type } from "class-transformer";

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
  @Expose() @Type(() => IssueChildDto) issues?: IssueChildDto[];
}

export class IssueChildDto {
  @Expose() id!: string;
  @Expose() key!: string;
  @Expose() title!: string;
  @Expose() description!: string;
  @Expose() statusId?: string;
  @Expose() assignee?: string;
  @Expose() epicId?: string;
  @Expose() projectId!: string;
  @Expose() type?: string;
}
