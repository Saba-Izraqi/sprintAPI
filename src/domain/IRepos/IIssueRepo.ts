import { Issue } from "../entities/issue.entity";

export interface IIssueRepo {
  /**
   * Creates a new issue.
   * @param issueData - The data for the new issue.
   * @returns The created issue.
   */
  create(issueData: Partial<Issue>): Promise<Issue>;

  /**
   * Finds all issues.
   * @returns A list of all issues.
   */
  findAll(): Promise<Issue[]>;

  /**
   * Finds an issue by its ID.
   * @param id - The ID of the issue.
   * @returns The issue if found, otherwise null.
   */
  findById(id: string): Promise<Issue | null>;

  /**
   * Finds an issue by its key and board project ID.
   * (Issues usually have a key unique within a board/project).
   * @param key - The key of the issue.
   * @param boardProjectId - The ID of the board project.
   * @returns The issue if found, otherwise null.
   */
  findByKeyAndBoardProjectId(key: string, boardProjectId: string | null): Promise<Issue | null>;

  /**
   * Finds all issues belonging to a specific board project.
   * @param boardProjectId - The ID of the board project.
   * @returns A list of issues for the given board project.
   */
  findByBoardProjectId(boardProjectId: string): Promise<Issue[]>;

  /**
   * Finds all issues belonging to a specific epic.
   * @param epicId - The ID of the epic.
   * @returns A list of issues for the given epic.
   */
  findByEpicId(epicId: string): Promise<Issue[]>;

  /**
   * Finds all issues belonging to a specific sprint.
   * @param sprintId - The ID of the sprint.
   * @returns A list of issues for the given sprint.
   */
  findBySprintId(sprintId: string): Promise<Issue[]>;

  /**
   * Finds all issues assigned to a specific user.
   * @param userId - The ID of the user.
   * @returns A list of issues assigned to the given user.
   */
  findByAssignee(userId: string): Promise<Issue[]>;

  /**
   * Updates an existing issue.
   * @param id - The ID of the issue to update.
   * @param issueData - The partial data to update the issue with.
   * @returns The updated issue if found and updated, otherwise null.
   */
  update(id: string, issueData: Partial<Issue>): Promise<Issue | null>;

  /**
   * Deletes an issue by its ID.
   * @param id - The ID of the issue to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  delete(id: string): Promise<void>;
}
