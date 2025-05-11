import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { StatusType } from "../entities/status.entity";
import { Status } from "../entities/status.entity"; // Import Status entity if not already
import { UUID } from "crypto"; // Assuming UUID is a string type alias or similar

export class CreateStatusDto {
  @IsString()
  name!: string;

  @IsEnum(StatusType)
  type!: StatusType;

  @IsUUID()
  @IsOptional()
  columnId?: string ;
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
  columnId?: string ;
}

export class StatusResponseDto {
  id: string;
  name: string;
  type: StatusType;
  columnId: string | null; // Changed from UUID to string for broader compatibility, adjust if UUID is a specific object
  createdAt: Date;
  updatedAt: Date;

  constructor(statusEntity: Status, parentBoardColumnId?: string) {
    this.id = statusEntity.id;
    this.name = statusEntity.name;
    this.type = statusEntity.type;

    // Prioritize the explicitly passed parentBoardColumnId
    // Fallback to the Status entity's own columnId (if TypeORM makes it available directly)
    // Then fallback to the loaded relation's ID, and finally to null.
    if (parentBoardColumnId) {
      this.columnId = parentBoardColumnId;
    } else {
      // TypeORM often makes the foreign key value available directly on the entity
      // e.g., if your Status entity has a 'columnId' property mapped to the FK.
      this.columnId = (statusEntity as any).columnId || statusEntity.column?.id || null;
    }

    this.createdAt = statusEntity.createdAt;
    this.updatedAt = statusEntity.updatedAt;
  }
}