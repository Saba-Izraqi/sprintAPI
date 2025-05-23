import { IsNotEmpty, IsString, IsOptional, IsUUID, IsInt, Min } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateIssueDto {
  @IsNotEmpty()
  @IsString()
  key!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  storyPoint!: number;

  @IsOptional()
  @IsUUID()
  statusId?: string;

  @IsOptional()
  @IsUUID()
  assignee?: string; // This will be the User ID

  @IsOptional()
  @IsUUID()
  epicId?: string;

  @IsOptional()
  @IsUUID()
  sprintId?: string;

  @IsNotEmpty()
  @IsString()
  boardProjectId!: string;
}

export class UpdateIssueDto {
  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  storyPoint?: number;

  @IsOptional()
  @IsUUID()
  statusId?: string;

  @IsOptional()
  @IsUUID()
  assignee?: string; // User ID

  @IsOptional()
  @IsUUID()
  epicId?: string;

  @IsOptional()
  @IsUUID()
  sprintId?: string;

  @IsOptional()
  @IsString()
  boardProjectId?: string;
}

export class IssueResponseDto {
  @Expose()
  id!: string;

  @Expose()
  key!: string;

  @Expose()
  title!: string;

  @Expose()
  description!: string;

  @Expose()
  storyPoint!: number;

  @Expose()
  statusId?: string;

  @Expose()
  assignee?: string; 

  @Expose()
  epicId?: string;

  @Expose()
  sprintId?: string;

  @Expose()
  boardProjectId!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
