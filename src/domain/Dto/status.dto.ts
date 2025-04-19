export enum StatusType {
    BACKLOG = 0,
    IN_PROGRESS = 1,
    DONE = 2,
  }
  
  export interface CreateStatusDto {
    name: string;
    type: StatusType;
    columnId?: string;
  }
  
  export interface UpdateStatusDto {
    name?: string;
    type?: StatusType;
    columnId?: string | null;
  }
  
  export interface StatusResponseDto {
    id: string;
    name: string;
    type: StatusType;
    columnId?: string;
    createdAt: Date;
    updatedAt: Date;
  }