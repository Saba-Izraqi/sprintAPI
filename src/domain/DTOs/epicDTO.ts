import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { UserResponseDto } from './userDTO';
export class CreateEpicDto {
  @IsNotEmpty()
  @IsString()
  key!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsOptional()
  @IsUUID()
  assignee?: string; // This will be the User ID

  @IsNotEmpty()
  @IsString() // Assuming boardProjectId is a string, adjust if it's a UUID
  boardProjectId!: string;
}
export class UpdateEpicDto {
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
  @IsUUID()
  assignee?: string; // User ID

  @IsOptional()
  @IsString() // Assuming boardProjectId is a string
  boardProjectId?: string;
}

export class EpicResponseDto {
  id!: string;
  key!: string;
  title!: string;
  description!: string;
  assignee?: string; 
  boardProjectId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}