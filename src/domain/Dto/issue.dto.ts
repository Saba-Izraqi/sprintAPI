export interface CreateIssueDto {
    key: string;
    title: string;
    description: string;
    storyPoint: number;
    statusId?: string;
    assignee?: string;
    epicId?: string;
    sprintId?: string;
    boardProjectId: string;
  }
  
  export interface UpdateIssueDto {
    title?: string;
    description?: string;
    storyPoint?: number;
    statusId?: string;
    assignee?: string ;
    epicId?: string ;
    sprintId?: string ;
  }
  
  export interface IssueResponseDto {
    id: string;
    key: string;
    title: string;
    description: string;
    storyPoint: number;
    statusId?: string;
    assignee?: string;
    epicId?: string;
    sprintId?: string;
    boardProjectId: string;
    createdAt: Date;
    updatedAt: Date;
  }