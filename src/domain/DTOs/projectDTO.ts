import { 
    IsString, 
    IsNotEmpty, 
    IsOptional, 
    MinLength, 
    MaxLength, 
    Matches,
    IsUUID,
    IsAlphanumeric
    
  } from 'class-validator';
  import { Expose, Type } from 'class-transformer';
  
  export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    name!: string;
  
    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()
    @MinLength(2)
    @MaxLength(5)
    @Matches(/^[A-Za-z0-9]+$/)
    keyPrefix!: string;
  
    @IsUUID()
    @IsNotEmpty()
    createdBy!: string;
  }
  
  export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name?: string;
  
    @IsOptional()
    @IsString()
    @IsAlphanumeric()
    @MinLength(2)
    @MaxLength(5)
    @Matches(/^[A-Za-z0-9]+$/)
    keyPrefix?: string;
  }
  
  export class ProjectResponseDto {
    @Expose()
    id!: string;
  
    @Expose()
    name!: string;
  
    @Expose()
    keyPrefix!: string;
  
    @Expose()
    createdBy!: string;
  
    @Expose()
    @Type(() => Date)
    createdAt!: Date;
  
    @Expose()
    @Type(() => Date)
    updatedAt!: Date;
  
    constructor(partial: Partial<ProjectResponseDto>) {
      Object.assign(this, partial);
    }
  }