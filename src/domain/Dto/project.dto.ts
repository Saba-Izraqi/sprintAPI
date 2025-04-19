export interface CreateProjectDto {
  name: string;
  keyPrefix: string;
  createdBy: string; // This should be the user ID
}

export interface UpdateProjectDto {
  name?: string;
  keyPrefix?: string;
}

export interface ProjectResponseDto {
  id: string;
  name: string;
  keyPrefix: string;
  createdBy: string; // Return just the user ID in response
  createdAt: Date;
  updatedAt: Date;
}