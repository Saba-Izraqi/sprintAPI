import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
} from "class-validator";
import { UserResponseDto } from "./userDTO";
import { Project } from "../entities";
import { ProjectPermission } from '../enums/types';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9_ ]+$/)
  @Length(3, 50)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z]{1,5}$/, {
    message: "Project key must be 1-5 letters, not case sensitive",
  })
  keyPrefix!: string;

  @IsNotEmpty()
  @IsUUID()
  createdById!: string;
}

export class UpdateProjectDTO {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_ ]+$/)
  @Length(3, 50)
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]{1,5}$/, {
    message: "Project key must be 1-5 letters, not case sensitive",
  })
  keyPrefix?: string;
}

export class ProjectResponseDto {
  id: string;
  name: string;
  keyPrefix: string;
  createdBy?: UserResponseDto;
  members: {
    id: string;
    permission: ProjectPermission;
    user?: UserResponseDto;
  }[];
  constructor(project: Project) {
    this.id = project.id;
    this.name = project.name;
    this.keyPrefix = project.keyPrefix;
    this.createdBy = project.createdBy
      ? new UserResponseDto(project.createdBy)
      : undefined;
    this.members =
      project.members?.map((member) => ({
        id: member.id,
        permission: member.permission,
        user: member.user ? new UserResponseDto(member.user) : undefined,
      })) ?? [];
  }
}
