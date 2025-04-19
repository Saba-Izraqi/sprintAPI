export enum ProjectPermission {
    MEMBER = 0,
    MODERATOR = 1,
    ADMINISTRATOR = 2,
  }
  
  export interface CreateProjectMemberDto {
    userId: string;
    projectId: string;
    permission?: ProjectPermission;
  }
  
  export interface UpdateProjectMemberDto {
    permission?: ProjectPermission;
  }
  
  export interface ProjectMemberResponseDto {
    id: string;
    userId: string;
    projectId: string;
    permission: ProjectPermission;
    createdAt: Date;
    updatedAt: Date;
  }