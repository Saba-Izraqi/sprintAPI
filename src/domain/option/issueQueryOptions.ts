export interface IssueQueryOptions {
  sprintId?: string;
  assignee?: string;
  statusId?: string;
  epicId?: string;
}

export interface FindIssueQueryOptions extends IssueQueryOptions {
  projectId?: string; // projectId is optional in the find method
}
