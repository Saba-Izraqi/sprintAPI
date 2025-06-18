export interface FindProjectOptions {
  id?: string;
  name?: string;
  keyPrefix?: string;
  createdById?: string;
}

export interface FindProjectMemberOptions {
  userId?: string;
  projectId?: string;
}

export interface FindBoardColumnOptions {
  projectId: string;
}