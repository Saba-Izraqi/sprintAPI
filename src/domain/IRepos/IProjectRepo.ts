import { Project } from "../entities/project.entity";

export interface IProjectRepo {
  /**
   * Creates a new project.
   * @param projectData - The data for the new project.
   * @returns The created project.
   */
  create(projectData: Partial<Project>): Promise<Project>;

  /**
   * Finds all projects.
   * @returns A list of all projects.
   */
  findAll(): Promise<Project[]>;

  /**
   * Finds a project by its ID.
   * @param id - The ID of the project to find.
   * @returns The project if found, otherwise null.
   */
  findById(id: string): Promise<Project | null>;
  
  /**
   * Finds projects created by a specific user.
   * @param userId - The ID of the user who created the projects.
   * @returns A list of projects created by the specified user.
   */
  findByCreator(userId: string): Promise<Project[]>;
  
  /**
   * Updates an existing project.
   * @param id - The ID of the project to update.
   * @param projectData - The partial data to update the project with.
   * @returns The updated project if found and updated, otherwise null.
   */
  update(id: string, projectData: Partial<Project>): Promise<Project | null>;

  /**
   * Deletes a project by its ID.
   * @param id - The ID of the project to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  delete(id: string): Promise<void>;
}
