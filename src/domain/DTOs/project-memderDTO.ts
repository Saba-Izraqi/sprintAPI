import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { ProjectPermission } from "../enums/types";
import { UserResponseDto } from "./userDTO";
import { ProjectMember } from "../entities";

export class CreateProjectMemberDto {
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @IsNotEmpty()
  @IsUUID()
  projectId!: string;

  @IsEnum(ProjectPermission)
  permission!: ProjectPermission;
}

export class UpdateProjectMemberDto {
  @IsOptional()
  @IsEnum(ProjectPermission)
  permission?: ProjectPermission;
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