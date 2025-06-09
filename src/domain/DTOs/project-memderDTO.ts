import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { ProjectPermission } from "../types/enums";
import { UserResponseDto } from "./userDTO";
import { ProjectMember } from "../entities";

/**
 * DTO for creating a new project member
 */
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

/**
 * DTO for updating an existing project member
 */
export class UpdateProjectMemberDto {
  @IsOptional()
  @IsEnum(ProjectPermission)
  permission?: ProjectPermission;
}

/**
 * DTO for project member response data
 */
export class ProjectMemberResponseDto {
  id: string;
  permission: ProjectPermission;
  user?: UserResponseDto;

  /**
   * Constructor for ProjectMemberResponseDto
   * @param member - The project member entity
   */
  constructor(member: ProjectMember) {
    this.id = member.id;
    this.permission = member.permission;
    this.user = member.user ? new UserResponseDto(member.user) : undefined;
  }
}