import { Epic } from "../entities/epic.entity";

export interface IEpicRepo {
  /**
   * Creates a new epic.
   * @param epicData - The data for the new epic.
   *                  Should include properties like key, title, boardProjectId, etc.
   *                  Relational objects like assigneeUser or board should be handled by providing their respective IDs (e.g., assignee, boardProjectId).
   * @returns The created epic.
   */
  create(epicData: Partial<Epic>): Promise<Epic>;

  /**
   * Finds all epics.
   * @returns A list of all epics.
   */
  findAll(): Promise<Epic[]>;

  /**
   * Finds an epic by its ID.
   * @param id - The ID of the epic.
   * @returns The epic if found, otherwise null.
   */
  findById(id: string): Promise<Epic | null>;
  /**
   * Finds an epic by its key and board project ID.
   * (Epics usually have a key unique within a board/project).
   * @param key - The key of the epic.
   * @param boardProjectId - The ID of the board project, or null to find epics not associated with any board.
   * @returns The epic if found, otherwise null.
   */
  findByKeyAndBoardProjectId(key: string, boardProjectId: string | null): Promise<Epic | null>;

  /**
   * Finds all epics belonging to a specific board project.
   * @param boardProjectId - The ID of the board project.
   * @returns A list of epics for the given board project.
   */
  findByBoardProjectId(boardProjectId: string): Promise<Epic[]>;

  /**
   * Updates an existing epic.
   * @param id - The ID of the epic to update.
   * @param epicData - The partial data to update the epic with.
   * @returns The updated epic if found and updated, otherwise null.
   */
  update(id: string, epicData: Partial<Epic>): Promise<Epic | null>;

  /**
   * Deletes an epic by its ID.
   * @param id - The ID of the epic to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  delete(id: string): Promise<void>;
}
