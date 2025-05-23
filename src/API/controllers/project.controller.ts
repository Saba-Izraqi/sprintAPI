import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { ProjectService } from "../../app/services/project.service";
import { CreateProjectDto, UpdateProjectDto } from "../../domain/DTOs/projectDTO";
import { ApiError } from "../middlewares/error.middleware";

@injectable()
export class ProjectController {
  constructor(
    @inject(ProjectService) private readonly projectService: ProjectService
  ) {}
  async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {    try {
      const createProjectDto = req.body as CreateProjectDto;
      
      // Get the user ID from the auth token that was attached to req.body by the auth middleware
      const userId = req.body.id;
      
      if (!userId) {
        throw new ApiError(401, "User ID not found in token. Please log in again.");
      }

      // Pass both the DTO and the authenticated user's ID to the service
      const projectResponse = await this.projectService.create(createProjectDto, userId);
      res.status(201).json(projectResponse);
    } catch (error) {
      next(error);
    }
  }

  async getAllProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projects = await this.projectService.getAll();
      res.status(200).json(projects);
    } catch (error) {
      next(error);
    }
  }

  async getProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const project = await this.projectService.getById(id);
      
      if (!project) {
        throw new ApiError(404, `Project with ID "${id}" not found.`);
      }
      
      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  }
  
  async getProjectsByCreator(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const projects = await this.projectService.getByCreator(userId);
      res.status(200).json(projects);
    } catch (error) {
      next(error);
    }
  }

  async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateProjectDto = req.body as UpdateProjectDto;
      
      const updatedProject = await this.projectService.update(id, updateProjectDto);
      res.status(200).json(updatedProject);
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.projectService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
