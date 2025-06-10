import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
} from "class-validator";
import { Transform, Expose } from "class-transformer";
import { Project, Sprint } from "../entities";
import { UserResponseDto } from "./userDTO";
import { ProjectPermission } from "../types";

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9_ ]+$/)
  @Length(3, 50)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  @Matches(/^[A-Za-z]{1,5}$/, {
    message: "Project key must be 1-5 letters, not case sensitive",
  })
  keyPrefix!: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;
  
  createdBy?: string;
}

export class UpdateProjectDTO {
  @Expose()
  @IsUUID()
  id!: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_ ]+$/)
  @Length(3, 50)
  name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toLowerCase())
  @Matches(/^[A-Za-z]{1,5}$/, {
    message: "Project key must be 1-5 letters, not case sensitive",
  })
  keyPrefix?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;
}

export class ProjectResponseDto {
  id: string;
  name: string;
  keyPrefix: string;
  createdBy: string;
  activeSprintId?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  members: {
    id: string;
    permission: ProjectPermission;
    user: UserResponseDto;
  }[];
  constructor(project: Project) {
    this.id = project.id;
    this.name = project.name;
    this.keyPrefix = project.keyPrefix;
    this.createdBy = project.createdBy;
    this.activeSprintId = project.activeSprintId;
    this.createdAt = project.createdAt;
    this.updatedAt = project.updatedAt;
    this.deletedAt = project.deletedAt;
    this.members =
      project.members?.map((member) => ({
        id: member.id,
        permission: member.permission,
        user: new UserResponseDto(member.user),
      })) ?? [];
  }
}
