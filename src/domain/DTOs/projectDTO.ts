import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
} from "class-validator";
import { UserResponseDto } from "./userDTO";
import { Project, ProjectPermission } from "../entities";
export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9_ ]+$/)
  @Length(3, 50)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z][A-Z0-9]{1,9}$/, {
    message:
      "Project key must be 2-10 uppercase letters/numbers, starting with a letter",
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
  @Matches(/^[A-Z][A-Z0-9]{1,9}$/, {
    message:
      "Project key must be 2-10 uppercase letters/numbers, starting with a letter",
  })
  keyPrefix?: string;
}
//* Defines a type representing allowed permission keys: "MEMBER" | "MODERATOR" | "ADMINISTRATOR"
type ProjectPermissionKeys = keyof typeof ProjectPermission;
export class ProjectResponseDto {
  id: string;
  name: string;
  keyPrefix: string;
  createdBy?: UserResponseDto;
  members: {
    id: string;
    permission: ProjectPermissionKeys;
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
        permission: ProjectPermission[
          member.permission
        ] as ProjectPermissionKeys,
        user: member.user ? new UserResponseDto(member.user) : undefined,
      })) ?? [];
  }
}
