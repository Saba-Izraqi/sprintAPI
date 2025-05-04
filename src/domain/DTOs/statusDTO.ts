import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { StatusType } from "../entities/status.entity";

export class CreateStatusDto {
  @IsString()
  name!: string;

  @IsEnum(StatusType)
  type!: StatusType;

  @IsUUID()
  @IsOptional()
  columnId?: string | null;
}

export class UpdateStatusDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(StatusType)
  @IsOptional()
  type?: StatusType;

  @IsUUID()
  @IsOptional()
  columnId?: string | null;
}

export class StatusResponseDto {
  id: string;
  name: string;
  type: StatusType;
  columnId: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(status: any) {
    this.id = status.id;
    this.name = status.name;
    this.type = status.type;
    this.columnId = status.column?.id || null;
    this.createdAt = status.createdAt;
    this.updatedAt = status.updatedAt;
  }
}