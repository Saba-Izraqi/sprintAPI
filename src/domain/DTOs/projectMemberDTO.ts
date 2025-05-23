import { IsNotEmpty, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { ProjectPermission } from '../entities/project-members.entity';

export class CreateProjectMemberDto {
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @IsNotEmpty()
  @IsUUID()
  projectId!: string;

  @IsOptional()
  @IsEnum(ProjectPermission)
  permission?: ProjectPermission = ProjectPermission.MEMBER;
}

export class UpdateProjectMemberDto {
  @IsNotEmpty()
  @IsEnum(ProjectPermission)
  permission!: ProjectPermission;
}

export class ProjectMemberResponseDto {
  @Expose()
  id!: string;

  @Expose()
  userId!: string;

  @Expose()
  projectId!: string;
  
  @Expose()
  permission!: ProjectPermission;
  
  @Expose()
  createdAt!: Date;
  
  @Expose()
  updatedAt!: Date;
}
