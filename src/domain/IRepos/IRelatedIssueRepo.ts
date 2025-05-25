import { RelatedIssue } from "../entities/related-issue.entity";
import {
  CreateRelatedIssueDto,
  RelatedIssueResponseDto,
} from "../DTOs/relatedIssueDTO";
import { RelatedIssueType } from "../enums/types"; // Import RelatedIssueType

export interface IRelatedIssueRepo {
  create(createRelatedIssueDto: CreateRelatedIssueDto): Promise<RelatedIssue>;

  findByIds(
    issueId: string,
    relatedIssueId: string
  ): Promise<RelatedIssue | null>;

  findByIssueId(issueId: string): Promise<RelatedIssue[]>;

  update(
    id: string,
    relationshipType: RelatedIssueType
  ): Promise<RelatedIssue | null>; 

  findById_withRelations(id: string): Promise<RelatedIssue | null>;

  delete(id: string): Promise<boolean>;

  deleteByIds(issueId: string, relatedIssueId: string): Promise<boolean>;
}
