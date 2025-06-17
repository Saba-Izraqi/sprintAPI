import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { UserResponseDto } from "./userDTO";
import { ProjectMember } from "../entities";
import { ProjectPermission } from "../types";
import { IsNotAdministrator } from "./customValidators/isNotAdministrator";
import { Expose } from "class-transformer";

export class CreateProjectMemberDto {
  @IsNotEmpty()
  @IsUUID()
  @Expose()
  userId!: string;

  @IsNotEmpty()
  @IsUUID()
  @Expose()
  projectId!: string;

  @IsEnum(ProjectPermission)
  @IsNotAdministrator({ message: "Permission cannot be set to ADMINISTRATOR." })
  @Expose()
  permission!: ProjectPermission;
}

export class UpdateProjectMemberDto {
  @IsNotEmpty()
  @IsUUID()
  @Expose()
  userId!: string;

  @IsNotEmpty()
  @IsUUID()
  @Expose()
  projectId!: string;

  @IsEnum(ProjectPermission)
  @IsNotAdministrator({ message: "Permission cannot be set to ADMINISTRATOR." })
  @Expose()
  permission!: ProjectPermission;
}

export class ProjectMemberResponseDto {
  id: string;
  permission: ProjectPermission;
  user?: UserResponseDto | string;

  constructor(member: ProjectMember) {
    this.id = member.id;
    this.permission = member.permission;
    this.user = member.user
      ? new UserResponseDto(member.user)
      : member.userId ?? "";
  }
}
