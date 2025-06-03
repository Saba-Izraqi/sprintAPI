import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  IsInt,
  Min,
  IsOptional,
} from "class-validator";

export class CreateBoardColumnDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 25)
  name!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  order!: number;

  @IsNotEmpty()
  @IsUUID()
  projectId!: string;
}
export class UpdateBoardColumnDto {
  @IsOptional()
  @IsString()
  @Length(1, 25)
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsUUID()
  projectId?: string;
}

export class BoardColumnResponseDto {
  id: string;
  name: string;
  order: number;
  projectId: string;

  constructor(column: any) {
    this.id = column.id;
    this.name = column.name;
    this.order = column.order;
    this.projectId = column.projectId;
  }
}