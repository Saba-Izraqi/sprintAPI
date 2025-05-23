import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateBoardDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsUUID()
  projectId!: string;
}

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  name?: string;
}

export class BoardResponseDto {
  @Expose()
  projectId!: string;

  @Expose()
  name!: string;
  
  @Expose()
  createdAt!: Date;
  
  @Expose()
  updatedAt!: Date;
  
  // Additional fields for the response that don't need to exist in the entity
  @Expose()
  sprintCount?: number;
  
  @Expose()
  projectName?: string;
}
