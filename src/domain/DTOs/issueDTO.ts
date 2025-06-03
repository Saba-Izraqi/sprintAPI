import { IsString, IsNumber, IsOptional, Length, IsUUID, IsEnum } from "class-validator";
import { IssueType } from "../enums/types";
import { Expose, Type } from 'class-transformer'; // Added Expose, Type

export class CreateIssueDto {
  @IsString()
  @Length(1, 250)
  title!: string;

  @IsString()
  description!: string;

  @IsNumber()
  storyPoint!: number;

  @IsUUID()
  projectId!: string;

  @IsOptional()
  @IsUUID()
  assignee?: string;

  @IsOptional()
  @IsUUID()
  epicId?: string;

  @IsOptional()
  @IsUUID()
  sprintId?: string;

  @IsOptional()
  @IsUUID()
  statusId?: string;

  @IsEnum(IssueType)
  @IsOptional()
  type: IssueType = IssueType.TASK;
}

export class UpdateIssueDto {
  @IsOptional()
  @IsString()
  @Length(1, 250)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  storyPoint?: number;

  @IsOptional()
  @IsUUID()
  assignee?: string;

  @IsOptional()
  @IsUUID()
  epicId?: string;

  @IsOptional()
  @IsUUID()
  sprintId?: string;

  @IsOptional()
  @IsUUID()
  statusId?: string;

  @IsOptional()
  @IsEnum(IssueType)
  type?: IssueType;
}

class BasicUserDto {
  @Expose() id!: string;
  @Expose() fullName!: string;
  @Expose() email!: string;
  @Expose() image?: string; 
}

class BasicProjectDto {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() keyPrefix!: string;
}

class BasicEpicDto {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() description?: string;
}

class BasicSprintDto {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() startDate?: Date;
  @Expose() endDate?: Date;
}

class BasicStatusDto {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() order?: number; // order is optional in Partial, required in Full
}

// Partial issue response for listing (lightweight)
export class IssuePartialResponseDto {
  @Expose() id!: string;
  @Expose() key!: string;
  @Expose() title!: string;
  @Expose() storyPoint!: number;
  @Expose() statusId?: string;
  @Expose() assignee?: string;
  @Expose() projectId!: string;
  
  @Expose()
  @Type(() => BasicUserDto)
  assigneeUser?: BasicUserDto;

  @Expose()
  @Type(() => BasicStatusDto)
  status?: BasicStatusDto;

  @Expose()
  type!: IssueType; // Added type field
}

// Full issue response for detailed view
export class IssueFullResponseDto {
  @Expose() id!: string;
  @Expose() key!: string;
  @Expose() title!: string;
  @Expose() description!: string;
  @Expose() storyPoint!: number;
  @Expose() statusId?: string;
  @Expose() assignee?: string;
  @Expose() epicId?: string;
  @Expose() sprintId?: string;
  @Expose() projectId!: string;
  @Expose() createdAt!: Date;
  @Expose() updatedAt!: Date;
  
  @Expose()
  @Type(() => BasicUserDto)
  assigneeUser?: BasicUserDto;

  @Expose()
  @Type(() => BasicProjectDto)
  project!: BasicProjectDto;

  @Expose()
  @Type(() => BasicEpicDto)
  epic?: BasicEpicDto;

  @Expose()
  @Type(() => BasicSprintDto)
  sprint?: BasicSprintDto;

  @Expose()
  @Type(() => BasicStatusDto)
  status?: BasicStatusDto;

  @Expose()
  type!: IssueType; // Added type field
}
