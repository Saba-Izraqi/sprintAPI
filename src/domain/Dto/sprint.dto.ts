export interface CreateSprintDto {
    name: string;
    startDate: Date;
    endDate: Date;
    boardProjectId: string;
  }
  
  export interface UpdateSprintDto {
    name?: string;
    startDate?: Date;
    endDate?: Date;
  }
  
  export interface SprintResponseDto {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    boardProjectId: string;
    createdAt: Date;
    updatedAt: Date;
  }