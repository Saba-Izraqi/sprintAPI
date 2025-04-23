import { 
  IsString, 
  IsOptional, 
  IsUUID, 
  Length 
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreateBoardDto {
  @IsUUID()
  projectId!: string;

  @IsString()
  @Length(3, 100)
  name!: string;
}

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;
}

export class BoardResponseDto {
  @Expose()
  @IsUUID()
  projectId!: string;

  @Expose()
  @IsString()
  name!: string;

  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @Expose()
  @Type(() => Date)
  updatedAt!: Date;
}