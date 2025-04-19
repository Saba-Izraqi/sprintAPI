export interface CreateBoardDto {
    projectId: string;
    name: string;
  }
  
  export interface UpdateBoardDto {
    name?: string;
  }
  
  export interface BoardResponseDto {
    projectId: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }