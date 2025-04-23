import { 
  IsString, 
 
  IsOptional, 
  IsUUID, 
  Length, 
  Matches 
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreateEpicDto {
  @IsString()
  @Length(2, 20)
  @Matches(/^[A-Z]+-\d+$/)
  key!: string;

  @IsString()
  @Length(5, 255)
  title!: string;

  @IsString()
  @Length(10, 5000)
  description!: string;

  @IsOptional()
  @IsUUID()
  assignee?: string;

  @IsUUID()
  boardProjectId!: string;
}

export class UpdateEpicDto {
  @IsOptional()
  @IsString()
  @Length(5, 255)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(10, 5000)
  description?: string;

  @IsOptional()
  @IsUUID()
  assignee?: string | null;
}

export class EpicResponseDto {
  @Expose()
  id!: string;

  @Expose()
  key!: string;

  @Expose()
  title!: string;

  @Expose()
  description!: string;

  @Expose()
  @IsOptional()
  @IsUUID()
  assignee?: string;

  @Expose()
  boardProjectId!: string;

  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @Expose()
  @Type(() => Date)
  updatedAt!: Date;
}