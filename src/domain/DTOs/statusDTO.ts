import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  IsEnum,
  IsOptional,
} from "class-validator";
import { StatusType } from "../entities";

export class CreateStatusDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  name!: string;

  @IsNotEmpty()
  @IsEnum(StatusType)
  type!: StatusType;

  @IsOptional()
  @IsUUID()
  columnId?: string;
}

export class UpdateStatusDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  name?: string;

  @IsOptional()
  @IsEnum(StatusType)
  type?: StatusType;

  @IsOptional()
  @IsUUID()
  columnId?: string;
}

export class StatusResponseDto {
  id: string;
  name: string;
  type: StatusType;
  columnId?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(status: any) {
    this.id = status.id;
    this.name = status.name;
    this.type = status.type;
    this.columnId = status.column?.id;
    this.createdAt = status.createdAt;
    this.updatedAt = status.updatedAt;
    this.deletedAt = status.deletedAt;
  }
}
