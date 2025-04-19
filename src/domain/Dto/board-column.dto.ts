export interface CreateBoardColumnDto {
    name: string;
    order: number;
  }
  
  export interface UpdateBoardColumnDto {
    name?: string;
    order?: number;
  }
  
  export interface BoardColumnResponseDto {
    id: string;
    name: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
  }