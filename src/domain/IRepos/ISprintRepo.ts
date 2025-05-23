import { Sprint } from "../entities/sprint.entity";

export interface ISprintRepo {
  /**
   * Creates a new sprint.
   * @param sprintData - The data for the new sprint.
   * @returns The created sprint.
   */
  create(sprintData: Partial<Sprint>): Promise<Sprint>;

  /**
   * Finds all sprints.
   * @returns A list of all sprints.
   */
  findAll(): Promise<Sprint[]>;

  /**
   * Finds a sprint by its ID.
   * @param id - The ID of the sprint.
   * @returns The sprint if found, otherwise null.
   */
  findById(id: string): Promise<Sprint | null>;

  /**
   * Finds all sprints belonging to a specific board project.
   * @param boardProjectId - The ID of the board project.
   * @returns A list of sprints for the given board project.
   */
  findByBoardProjectId(boardProjectId: string): Promise<Sprint[]>;

  /**
   * Finds sprints within a date range
   * @param startDate - The start date to search from
   * @param endDate - The end date to search to
   * @returns A list of sprints within the date range
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<Sprint[]>;

  /**
   * Finds active sprints (sprints that include the current date)
   * @returns A list of active sprints
   */
  findActiveSprints(): Promise<Sprint[]>;

  /**
   * Updates an existing sprint.
   * @param id - The ID of the sprint to update.
   * @param sprintData - The partial data to update the sprint with.
   * @returns The updated sprint if found and updated, otherwise null.
   */
  update(id: string, sprintData: Partial<Sprint>): Promise<Sprint | null>;

  /**
   * Deletes a sprint by its ID.
   * @param id - The ID of the sprint to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  delete(id: string): Promise<void>;
}
