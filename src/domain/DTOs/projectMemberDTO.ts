import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { UserResponseDto } from "./userDTO";
import { ProjectMember } from "../entities";
import { ProjectPermission } from "../types";
import { IsNotAdministrator } from "./customValidators/isNotAdministrator";

export class CreateProjectMemberDto {
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @IsNotEmpty()
  @IsUUID()
  projectId!: string;

  @IsEnum(ProjectPermission)
  @IsNotAdministrator({ message: "Permission cannot be set to ADMINISTRATOR." })
  permission!: ProjectPermission;
}

export class UpdateProjectMemberDto {
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @IsNotEmpty()
  @IsUUID()
  projectId!: string;

  @IsEnum(ProjectPermission)
  @IsNotAdministrator({ message: "Permission cannot be set to ADMINISTRATOR." })
  permission!: ProjectPermission;
}

export class ProjectMemberResponseDto {
  id: string;
  permission: ProjectPermission;
  user?: UserResponseDto;

  constructor(member: ProjectMember) {
    this.id = member.id;
    this.permission = member.permission;
    this.user = member.user ? new UserResponseDto(member.user) : undefined;
  }
}
