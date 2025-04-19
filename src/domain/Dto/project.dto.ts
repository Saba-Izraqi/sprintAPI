export interface CreateProjectDto {
    name: string;
    keyPrefix: string;
    createdBy: string;
  }
  
  export interface UpdateProjectDto {
    name?: string;
    keyPrefix?: string;
  }
  
  export interface ProjectResponseDto {
    id: string;
    name: string;
    keyPrefix: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  }