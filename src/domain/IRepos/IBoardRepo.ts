import { Board } from "../entities/board.entity";

export interface IBoardRepo {
  /**
   * Creates a new board.
   * @param boardData - The data for the new board.
   * @returns The created board.
   */
  create(boardData: Partial<Board>): Promise<Board>;

  /**
   * Finds all boards.
   * @returns A list of all boards.
   */
  findAll(): Promise<Board[]>;

  /**
   * Finds a board by its project ID.
   * @param projectId - The project ID associated with the board.
   * @returns The board if found, otherwise null.
   */
  findByProjectId(projectId: string): Promise<Board | null>;

  /**
   * Updates an existing board.
   * @param projectId - The project ID associated with the board to update.
   * @param boardData - The partial data to update the board with.
   * @returns The updated board if found and updated, otherwise null.
   */
  update(projectId: string, boardData: Partial<Board>): Promise<Board | null>;

  /**
   * Deletes a board by its project ID.
   * @param projectId - The project ID associated with the board to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  delete(projectId: string): Promise<void>;
}
