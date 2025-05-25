import { RelatedIssueType } from "../enums/types";
import { Expose, Transform } from 'class-transformer';

export class CreateRelatedIssueDto {
  @Expose() issueId!: string;
  @Expose() relatedIssueId!: string;
  @Expose() type!: RelatedIssueType;
}

export class UpdateRelatedIssueDto {
  @Expose() type!: RelatedIssueType;
}

export class RelatedIssueResponseDto {
  @Expose() id!: string;
  @Expose() issueId!: string; // This will be mapped from sourceIssue.id
  @Expose() relatedIssueId!: string; // This will be mapped from targetIssue.id
  
  @Transform(({ value }) => { // value is the numeric enum value
    if (value === undefined) return 'UNKNOWN';
    const typeKey = Object.keys(RelatedIssueType).find(
      (key) => RelatedIssueType[key as keyof typeof RelatedIssueType] === value
    );
    return typeKey || 'UNKNOWN';
  })
  @Expose() 
  type!: string; // Changed to string to hold the enum key name

  // Optional: Add any other fields from the RelatedIssue entity you want to expose
  // For example, if you want to include details of the linked issues directly:
  // @Expose() issueKey?: string;
  // @Expose() relatedIssueKey?: string;
}

