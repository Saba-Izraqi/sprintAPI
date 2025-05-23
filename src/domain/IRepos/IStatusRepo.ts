import { Status, StatusType } from "../entities/status.entity";

export interface IStatusRepo {
  /**
   * Creates a new status.
   * @param statusData - The data for the new status.
   * @returns The created status.
   */
  create(statusData: Partial<Status>): Promise<Status>;

  /**
   * Finds all statuses.
   * @returns A list of all statuses.
   */
  findAll(): Promise<Status[]>;

  /**
   * Finds a status by its ID.
   * @param id - The ID of the status to find.
   * @returns The status if found, otherwise null.
   */
  findById(id: string): Promise<Status | null>;
  
  /**
   * Finds statuses by their type.
   * @param type - The type of statuses to find.
   * @returns A list of statuses with the specified type.
   */
  findByType(type: StatusType): Promise<Status[]>;
  
  /**
   * Finds statuses by their associated board column.
   * @param columnId - The ID of the board column.
   * @returns A list of statuses associated with the specified column.
   */
  findByColumn(columnId: string): Promise<Status[]>;
  
  /**
   * Updates an existing status.
   * @param id - The ID of the status to update.
   * @param statusData - The partial data to update the status with.
   * @returns The updated status if found and updated, otherwise null.
   */
  update(id: string, statusData: Partial<Status>): Promise<Status | null>;

  /**
   * Deletes a status by its ID.
   * @param id - The ID of the status to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  delete(id: string): Promise<void>;
}
