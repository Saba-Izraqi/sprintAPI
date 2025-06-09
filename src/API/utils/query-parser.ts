import { Request } from "express";

export interface ParsedQueryOptions {
  sprintId?: string;
  assignee?: string;
  statusId?: string;
  epicId?: string;
  parentId?: string;
  type?: string;
  priority?: string;
  projectId?: string;
  page: number;
  limit: number;
  searchTerm?: string;
}

export function parseIssueQueryParams(req: Request): ParsedQueryOptions {
  const {
    sprintId,
    assignee,
    statusId,
    epicId,
    parentId,
    type,
    priority,
    projectId,
    page = "1",
    limit = "20",
    searchTerm,
  } = req.query;

  return {
    sprintId: sprintId as string | undefined,
    assignee: assignee as string | undefined,
    statusId: statusId as string | undefined,
    epicId: epicId as string | undefined,
    parentId: parentId as string | undefined,
    type: type as string | undefined,
    priority: priority as string | undefined,
    projectId: projectId as string | undefined,
    page: parseInt(page as string) || 1,
    limit: parseInt(limit as string) || 20,
    searchTerm: searchTerm as string | undefined,
  };
}
