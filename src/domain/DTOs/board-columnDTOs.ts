import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
} from "class-validator";
import { StatusResponseDto } from '../../domain/DTOs/statusDTO';
import { BoardColumn } from '../../domain/entities/board-column.entity';

export class CreateBoardColumnDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 25)
  name!: string;

  @IsInt()
  @IsNotEmpty()
  order!: number;
}

export class UpdateBoardColumnDto {
  @IsString()
  @IsOptional()
  @Length(1, 25)
  name?: string;

  @IsInt()
  @IsOptional()
  order?: number;
}


export class BoardColumnResponseDto {
  id: string;
  name: string;
  order: number;
  statuses: StatusResponseDto[];
  createdAt: Date;
  updatedAt: Date;

  constructor(boardColumn: BoardColumn) {
    this.id = boardColumn.id;
    this.name = boardColumn.name;
    this.order = boardColumn.order;
    this.statuses = boardColumn.statuses
      ? boardColumn.statuses.map(statusEntity => new StatusResponseDto(statusEntity, boardColumn.id)) // Pass boardColumn.id here
      : [];
    this.createdAt = boardColumn.createdAt;
    this.updatedAt = boardColumn.updatedAt;
  }
}