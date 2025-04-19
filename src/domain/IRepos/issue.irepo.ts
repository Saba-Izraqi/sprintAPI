import { CreateIssueDto, UpdateIssueDto, IssueResponseDto } from "../Dto/issue.dto";

export interface IIssueRepository {
  create(issue: CreateIssueDto): Promise<IssueResponseDto>;
  findById(id: string): Promise<IssueResponseDto | null>;
  findByKey(key: string): Promise<IssueResponseDto | null>;
  update(id: string, updates: UpdateIssueDto): Promise<IssueResponseDto | null>;
  delete(id: string): Promise<boolean>;
  getIssuesByProject(projectId: string): Promise<IssueResponseDto[]>;
  getIssuesBySprint(sprintId: string): Promise<IssueResponseDto[]>;
  getIssuesByEpic(epicId: string): Promise<IssueResponseDto[]>;
  getIssuesByAssignee(assigneeId: string): Promise<IssueResponseDto[]>;
}