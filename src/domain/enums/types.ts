/**
 * The types with positive values is the names of the incoming relation
 * To take the name of the opposite relation side, take the RelatedIssueType[type * -1];
 * The Related TO relation is symmetric so it has a value of 0.
 */
export enum RelatedIssueType {
  RELATED_TO = 0,
  BLOCKS = 1,
  BLOCKED_BY = -1,
  DUPLICATES = 2,
  DUPLICATED_BY = -2,
}

export enum IssueType {
  BUG = "bug",
  STORY = "story",
  TASK = "task",
}
