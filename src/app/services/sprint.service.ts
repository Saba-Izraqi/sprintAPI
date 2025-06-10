import { inject, injectable } from "tsyringe";
import { ISprintRepo } from "../../domain/IRepos/ISprintRepo";
import { IProjectRepo } from "../../domain/IRepos/IProjectRepo";
import { CreateSprintDto, UpdateSprintDto, SprintResponseDto } from "../../domain/DTOs/sprintDTO";
import { Sprint } from "../../domain/entities";

@injectable()
export class SprintService {  constructor(
    @inject("ISprintRepo") private sprintRepo: ISprintRepo,
    @inject("IProjectRepo") private projectRepo: IProjectRepo
  ) {}

  async createSprint(sprintData: CreateSprintDto): Promise<SprintResponseDto> {
    // Verify project exists
    const projects = await this.projectRepo.find({ id: sprintData.projectId });
    if (!projects || projects.length === 0) {
      throw new Error("Project not found");
    }

    // Validate dates
    const startDate = new Date(sprintData.startDate);
    const endDate = new Date(sprintData.endDate);
    
    if (startDate >= endDate) {
      throw new Error("Start date must be before end date");
    }

    const sprint = await this.sprintRepo.create({
      name: sprintData.name,
      startDate,
      endDate,
      isActive: sprintData.isActive || false,
      isArchived: sprintData.isArchived || false,
      projectId: sprintData.projectId,
    });

    return this.mapSprintToResponse(sprint);
  }

  async getSprintById(id: string): Promise<SprintResponseDto> {
    const sprint = await this.sprintRepo.findById(id);
    if (!sprint) {
      throw new Error("Sprint not found");
    }
    return this.mapSprintToResponse(sprint);
  }  async getSprintsByProject(projectId: string): Promise<SprintResponseDto[]> {
    // Verify project exists
    const projects = await this.projectRepo.find({ id: projectId });
    if (!projects || projects.length === 0) {
      throw new Error("Project not found");
    }

    const sprints = await this.sprintRepo.findByProjectId(projectId);
    return sprints.map(this.mapSprintToResponse);
  }

  async getAll(): Promise<SprintResponseDto[]> {
    const sprints = await this.sprintRepo.findAll();
    return sprints.map(this.mapSprintToResponse);
  }

  async getActiveSprintByProject(projectId: string): Promise<SprintResponseDto | null> {
    const sprint = await this.sprintRepo.findActiveByProjectId(projectId);
    return sprint ? this.mapSprintToResponse(sprint) : null;
  }

  async updateSprint(id: string, updates: UpdateSprintDto): Promise<SprintResponseDto> {
    const existingSprint = await this.sprintRepo.findById(id);
    if (!existingSprint) {
      throw new Error("Sprint not found");
    }

    // Validate dates if provided
    if (updates.startDate || updates.endDate) {
      const startDate = updates.startDate ? new Date(updates.startDate) : existingSprint.startDate;
      const endDate = updates.endDate ? new Date(updates.endDate) : existingSprint.endDate;
      
      if (startDate >= endDate) {
        throw new Error("Start date must be before end date");
      }
    }    const updateData: Partial<Sprint> = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.startDate !== undefined) updateData.startDate = new Date(updates.startDate);
    if (updates.endDate !== undefined) updateData.endDate = new Date(updates.endDate);
    if (updates.isActive !== undefined) updateData.isActive = updates.isActive;
    if (updates.isArchived !== undefined) updateData.isArchived = updates.isArchived;

    const updatedSprint = await this.sprintRepo.update(id, updateData);
    if (!updatedSprint) {
      throw new Error("Failed to update sprint");
    }

    return this.mapSprintToResponse(updatedSprint);
  }

  async deleteSprint(id: string): Promise<void> {
    const sprint = await this.sprintRepo.findById(id);
    if (!sprint) {
      throw new Error("Sprint not found");
    }

    // If this is the active sprint, deactivate it first
    if (sprint.isActive) {
      await this.sprintRepo.deactivateAllSprints(sprint.projectId);
    }

    const deleted = await this.sprintRepo.delete(id);
    if (!deleted) {
      throw new Error("Failed to delete sprint");
    }
  }
  async activateSprint(id: string): Promise<SprintResponseDto> {
    const sprint = await this.sprintRepo.findById(id);
    if (!sprint) {
      throw new Error("Sprint not found");
    }

    // Set this sprint as active and deactivate others in the project
    await this.sprintRepo.setActiveSprint(sprint.projectId, id);

    const updatedSprint = await this.sprintRepo.findById(id);
    return this.mapSprintToResponse(updatedSprint!);
  }
  async completeSprint(id: string): Promise<SprintResponseDto> {
    const sprint = await this.sprintRepo.findById(id);
    if (!sprint) {
      throw new Error("Sprint not found");
    }

    if (!sprint.isActive) {
      throw new Error("Only active sprints can be completed");
    }

    // Update sprint to deactivate it
    await this.sprintRepo.update(id, {
      isActive: false,
    });

    // Deactivate from project
    await this.sprintRepo.deactivateAllSprints(sprint.projectId);

    const updatedSprint = await this.sprintRepo.findById(id);
    return this.mapSprintToResponse(updatedSprint!);
  }
  async getSprintWithIssues(id: string): Promise<any> {
    const sprint = await this.sprintRepo.findSprintWithIssues(id);
    if (!sprint) {
      throw new Error("Sprint not found");
    }

    return {
      ...this.mapSprintToResponse(sprint),
      issues: (sprint as any).issues || [],
    };
  }  private mapSprintToResponse(sprint: Sprint): SprintResponseDto {
    return {
      id: sprint.id,
      name: sprint.name,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      isActive: sprint.isActive,
      isArchived: sprint.isArchived,
      isCompleted: sprint.isCompleted,
      projectId: sprint.projectId,
      createdAt: sprint.createdAt,
      updatedAt: sprint.updatedAt,
      deletedAt: sprint.deletedAt,
    };
  }
}
