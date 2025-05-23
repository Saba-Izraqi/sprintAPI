import { ProjectMember } from "../entities/project-members.entity";

export interface IProjectMemberRepo {
  /**
   * Creates a new project member.
   * @param memberData - The data for the new project member.
   * @returns The created project member.
   */
  create(memberData: Partial<ProjectMember>): Promise<ProjectMember>;

  /**
   * Finds all project members.
   * @returns A list of all project members.
   */
  findAll(): Promise<ProjectMember[]>;

  /**
   * Finds a project member by ID.
   * @param id - The ID of the project member to find.
   * @returns The project member if found, otherwise null.
   */
  findById(id: string): Promise<ProjectMember | null>;
  
  /**
   * Finds all members of a specific project.
   * @param projectId - The ID of the project.
   * @returns A list of project members for the specified project.
   */
  findByProject(projectId: string): Promise<ProjectMember[]>;
  
  /**
   * Finds all projects that a user is a member of.
   * @param userId - The ID of the user.
   * @returns A list of project memberships for the specified user.
   */
  findByUser(userId: string): Promise<ProjectMember[]>;
  
  /**
   * Finds a specific membership for a user in a project.
   * @param userId - The ID of the user.
   * @param projectId - The ID of the project.
   * @returns The project member if found, otherwise null.
   */
  findMembership(userId: string, projectId: string): Promise<ProjectMember | null>;
  
  /**
   * Updates an existing project member.
   * @param id - The ID of the project member to update.
   * @param memberData - The partial data to update the project member with.
   * @returns The updated project member if found and updated, otherwise null.
   */
  update(id: string, memberData: Partial<ProjectMember>): Promise<ProjectMember | null>;

  /**
   * Deletes a project member by ID.
   * @param id - The ID of the project member to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  delete(id: string): Promise<void>;
}
