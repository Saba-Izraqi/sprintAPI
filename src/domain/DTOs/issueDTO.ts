import { IsString, IsNumber, IsOptional, Length, IsUUID } from "class-validator";
import { RelatedIssueType } from "../enums/types";
import { Expose, Type, Transform } from 'class-transformer'; // Added Expose, Type, Transform

export class CreateIssueDto {
  @IsString()
  @Length(1, 250)
  title!: string;

  @IsString()
  description!: string;

  @IsNumber()
  storyPoint!: number;

  @IsUUID()
  projectId!: string;

  @IsOptional()
  @IsUUID()
  assignee?: string;

  @IsOptional()
  @IsUUID()
  epicId?: string;

  @IsOptional()
  @IsUUID()
  sprintId?: string;

  @IsOptional()
  @IsUUID()
  statusId?: string;
}

export class UpdateIssueDto {
  @IsOptional()
  @IsString()
  @Length(1, 250)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  storyPoint?: number;

  @IsOptional()
  @IsUUID()
  assignee?: string;

  @IsOptional()
  @IsUUID()
  epicId?: string;

  @IsOptional()
  @IsUUID()
  sprintId?: string;

  @IsOptional()
  @IsUUID()
  statusId?: string;
}

class BasicUserDto {
  @Expose() id!: string;
  @Expose() fullName!: string;
  @Expose() email!: string;
  @Expose() image?: string; 
}

class BasicProjectDto {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() keyPrefix!: string;
}

class BasicEpicDto {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() description?: string;
}

class BasicSprintDto {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() startDate?: Date;
  @Expose() endDate?: Date;
}

class BasicStatusDto {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() order?: number; // order is optional in Partial, required in Full
}

class RelatedIssueTargetDto {
  @Expose() id!: string;
  @Expose() key!: string;
  @Expose() title!: string;
}

class RelatedIssueLinkDto {
  @Expose() id!: string;

  @Transform(({ obj }) => { // obj is the RelatedIssue entity
    if (obj.type === undefined) return 'UNKNOWN';
    const typeKey = Object.keys(RelatedIssueType).find(
      (key) => RelatedIssueType[key as keyof typeof RelatedIssueType] === obj.type
    );
    return typeKey || 'UNKNOWN';
  })
  @Expose()
  relationType!: string;

  @Expose()
  @Type(() => RelatedIssueTargetDto)
  targetIssue?: RelatedIssueTargetDto; // For outgoing

  @Expose()
  @Type(() => RelatedIssueTargetDto)
  sourceIssue?: RelatedIssueTargetDto; // For incoming
}


// Partial issue response for listing (lightweight)
export class IssuePartialResponseDto {
  @Expose() id!: string;
  @Expose() key!: string;
  @Expose() title!: string;
  @Expose() storyPoint!: number;
  @Expose() statusId?: string;
  @Expose() assignee?: string;
  @Expose() projectId!: string;
  
  @Expose()
  @Type(() => BasicUserDto)
  assigneeUser?: BasicUserDto;

  @Expose()
  @Type(() => BasicStatusDto)
  status?: BasicStatusDto;

  // Removed constructor, class-transformer handles mapping
}

// Full issue response for detailed view
export class IssueFullResponseDto {
  @Expose() id!: string;
  @Expose() key!: string;
  @Expose() title!: string;
  @Expose() description!: string;
  @Expose() storyPoint!: number;
  @Expose() statusId?: string;
  @Expose() assignee?: string;
  @Expose() epicId?: string;
  @Expose() sprintId?: string;
  @Expose() projectId!: string;
  @Expose() createdAt!: Date;
  @Expose() updatedAt!: Date;
  
  @Expose()
  @Type(() => BasicUserDto)
  assigneeUser?: BasicUserDto;

  @Expose()
  @Type(() => BasicProjectDto)
  project!: BasicProjectDto;

  @Expose()
  @Type(() => BasicEpicDto)
  epic?: BasicEpicDto;

  @Expose()
  @Type(() => BasicSprintDto)
  sprint?: BasicSprintDto;

  @Expose()
  @Type(() => BasicStatusDto)
  status?: BasicStatusDto;

  @Expose()
  @Type(() => RelatedIssueLinkDto)
  outgoingRelations?: RelatedIssueLinkDto[];

  @Expose()
  @Type(() => RelatedIssueLinkDto)
  incomingRelations?: RelatedIssueLinkDto[];

  // Removed constructor, class-transformer handles mapping
}
