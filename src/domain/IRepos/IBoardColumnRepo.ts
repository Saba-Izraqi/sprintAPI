import { BoardColumn } from "../entities/board-column.entity";

export interface IBoardColumnRepo {
  /**
   * Creates a new board column.
   * @param boardColumnData - The data for the new board column.
   * @returns The created board column.
   */
  create(boardColumnData: Partial<BoardColumn>): Promise<BoardColumn>;

  /**
   * Finds all board columns.
   * @returns A list of all board columns.
   */
  findAll(): Promise<BoardColumn[]>;

  /**
   * Finds a board column by its ID.
   * @param id - The ID of the board column to find.
   * @returns The board column if found, otherwise null.
   */
  findById(id: string): Promise<BoardColumn | null>;
  
  /**
   * Updates an existing board column.
   * @param id - The ID of the board column to update.
   * @param boardColumnData - The partial data to update the board column with.
   * @returns The updated board column if found and updated, otherwise null.
   */
  update(id: string, boardColumnData: Partial<BoardColumn>): Promise<BoardColumn | null>;

  /**
   * Deletes a board column by its ID.
   * @param id - The ID of the board column to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  delete(id: string): Promise<void>;
}
