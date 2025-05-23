import { IsNotEmpty, IsString, IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(5)
  keyPrefix!: string;

  // createdBy is now extracted from the JWT token and not part of the DTO
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(5)
  keyPrefix?: string;
}

export class ProjectResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;
  
  @Expose()
  keyPrefix!: string;  // Using Transform decorator to extract just the id from the createdBy User entity
  @Expose()
  @Transform(({ value, obj }) => {
    console.log('Transform createdBy value:', value);
    console.log('Transform obj:', obj);
    
    // If we have the value's ID directly, use that
    if (value && value.id) return value.id;
    
    // If createdBy is just a string ID already
    if (typeof value === 'string') return value;
    
    // Use the userId from the project creation request if available
    if (obj && obj._userId) return obj._userId;
    
    // Default to null if no user ID can be found
    return null;
  }) 
  createdBy!: string;
  
  @Expose()
  createdAt!: Date;
  
  @Expose()
  updatedAt!: Date;
}
