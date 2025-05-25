import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
} from "class-validator";
import { Transform } from "class-transformer";
import { Project } from "../entities";
import { UserResponseDto } from "./userDTO";
import { ProjectPermission } from "../enums/types";
import { generateKeyPrefix } from "../../infrastructure/database/utils/generateKeyPrefix";

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
  @Transform(({ value }) => value.toLowerCase())
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
