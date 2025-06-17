import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { UserResponseDto } from "./userDTO";
import { ProjectMember } from "../entities";
import { ProjectPermission } from "../types";
import { IsNotAdministrator } from "./customValidators/isNotAdministrator";

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
  @IsNotAdministrator({ message: "Permission cannot be set to ADMINISTRATOR." })
  permission!: ProjectPermission;
}

/**
 * DTO for updating an existing project member
 */
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
