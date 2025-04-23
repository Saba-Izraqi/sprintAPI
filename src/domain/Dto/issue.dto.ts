import {
  IsString,
  IsOptional,
  IsInt,
  IsUUID,
  Min,
  Max,
  Length,
  Matches
} from 'class-validator';
import { Expose, Type } from 'class-transformer';


export class CreateIssueDto {
  @IsString()
  @Length(2, 20)
  @Matches(/^[A-Z]+-\d+$/, { message: 'Key must be in format PROJ-123' })
  key!: string;

  @IsString()
  @Length(5, 255)
  title!: string;

  @IsString()
  @Length(10, 5000)
  description!: string;

  @IsInt()
  @Min(0)
  @Max(20)
  storyPoint!: number;

  @IsOptional()
  @IsUUID()

  statusId?: string;

  @IsOptional()
  @IsUUID()
 
  assignee?: string;

  @IsOptional()
  @IsUUID()
  epicId?: string;

  @IsOptional()
  @IsUUID()
  sprintId?: string;

  @IsUUID()
  boardProjectId!: string;
}

export class UpdateIssueDto {
  @IsOptional()
  @IsString()
  @Length(5, 255)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(10, 5000)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  storyPoint?: number;

  @IsOptional()
  @IsUUID()
  statusId?: string;

  @IsOptional()
  @IsUUID()
  
  assignee?: string | null;

  @IsOptional()
  @IsUUID()
  epicId?: string | null;

  @IsOptional()
  @IsUUID()
  sprintId?: string | null;
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
  @IsOptional()
  @IsUUID()
  statusId?: string;

  @Expose()
  @IsOptional()
  @IsUUID()
  assignee?: string;

  @Expose()
  @IsOptional()
  @IsUUID()
  epicId?: string;

  @Expose()
  @IsOptional()
  @IsUUID()
  sprintId?: string;

  @Expose()
  boardProjectId!: string;

  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @Expose()
  @Type(() => Date)
  updatedAt!: Date;

  constructor(partial: Partial<IssueResponseDto>) {
    Object.assign(this, partial);
  }
}