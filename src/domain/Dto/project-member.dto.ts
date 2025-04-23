import { 
  IsUUID, 
  IsEnum, 
  IsOptional, 
  IsNotEmpty,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ProjectPermission } from '../entities/project-members.entity';


export class CreateProjectMemberDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsUUID()
  @IsNotEmpty()
  projectId!: string;

  @IsOptional()
  @IsEnum(ProjectPermission)
  permission: ProjectPermission = ProjectPermission.MEMBER;
}

export class UpdateProjectMemberDto {
  @IsOptional()
  @IsEnum(ProjectPermission)
  permission?: ProjectPermission;
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
  @Type(() => Date)
  createdAt!: Date;

  @Expose()
  @Type(() => Date)
  updatedAt!: Date;

  constructor(partial: Partial<ProjectMemberResponseDto>) {
    Object.assign(this, partial);
  }
}