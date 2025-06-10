import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from "class-validator";
import { Epic } from "../entities";

export class CreateEpicDto {
  @IsString()
  @Length(1, 100)
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsUUID()
  assignee?: string;

  @IsUUID()
  @IsNotEmpty()
  projectId!: string;
}

export class UpdateEpicDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  assignee?: string;
}

export class EpicResponseDto {
  id: string;
  key: string;
  title: string;  // Only title field, matching your JSON structure
  description: string;
  assignee?: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  assigneeUser?: {
    id: string;
    fullName: string;
    email: string;
    image?: string; 
  };
  issues?: any[]; 

  constructor(epic: Epic) {
    this.id = epic.id;
    this.key = epic.key;
    this.title = epic.title;  // Use title directly
    this.description = epic.description;
    this.assignee = epic.assignee;
    this.projectId = epic.projectId;
    this.createdAt = epic.createdAt;
    this.updatedAt = epic.updatedAt;
    this.deletedAt = epic.deletedAt;

    if (epic.assigneeUser) {
      this.assigneeUser = {
        id: epic.assigneeUser.id,
        fullName: epic.assigneeUser.fullName,
        email: epic.assigneeUser.email,
        image: epic.assigneeUser.image, 
      };
    }
    if (epic.issues) { 
      this.issues = epic.issues; 
    } 
  }
}
