export interface CreateEpicDto {
    key: string;
    title: string;
    description: string;
    assignee?: string;
    boardProjectId: string;
  }
  
  export interface UpdateEpicDto {
    title?: string;
    description?: string;
    assignee?: string | null;
  }
  
  export interface EpicResponseDto {
    id: string;
    key: string;
    title: string;
    description: string;
    assignee?: string;
    boardProjectId: string;
    createdAt: Date;
    updatedAt: Date;
  }