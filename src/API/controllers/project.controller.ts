import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { ProjectService } from "../../app/services/project.service";
import { validate } from "class-validator";
import { CreateProjectDto, UpdateProjectDto } from "../../domain/DTOs/projectDTO";
import { authenticate } from "../middlewares/auth.middleware";

@injectable()
export class ProjectController {
  constructor(
    @inject(ProjectService) private projectService: ProjectService
  ) {}

  async createProject(req: Request, res: Response): Promise<void> {
    const dto = Object.assign(new CreateProjectDto(), req.body);
    const errors = await validate(dto);
    
    if (errors.length > 0) {
      res.status(400).json({ errors, success: false });
      return;
    }

    try {
      const project = await this.projectService.createProject(dto);
      res.status(201).json({ project, success: true });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to create project',
        success: false 
      });
    }
  }

  async getProject(req: Request, res: Response): Promise<void> {
    try {
      const project = await this.projectService.getProjectById(req.params.id);
      if (!project) {
        res.status(404).json({ error: 'Project not found', success: false });
        return;
      }
      res.status(200).json({ project, success: true });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch project',
        success: false 
      });
    }
  }

  async updateProject(req: Request, res: Response): Promise<void> {
    const dto = Object.assign(new UpdateProjectDto(), req.body);
    const errors = await validate(dto);
    
    if (errors.length > 0) {
      res.status(400).json({ errors, success: false });
      return;
    }

    try {
      const project = await this.projectService.updateProject(req.params.id, dto);
      if (!project) {
        res.status(404).json({ error: 'Project not found', success: false });
        return;
      }
      res.status(200).json({ project, success: true });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to update project',
        success: false 
      });
    }
  }

  async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const success = await this.projectService.deleteProject(req.params.id);
      if (!success) {
        res.status(404).json({ error: 'Project not found', success: false });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to delete project',
        success: false 
      });
    }
  }

  async getAllProjects(req: Request, res: Response): Promise<void> {
    try {
      const projects = await this.projectService.getAllProjects();
      res.status(200).json({ projects, success: true });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch projects',
        success: false 
      });
    }
  }

  async getUserProjects(req: Request, res: Response): Promise<void> {
    try {
      const projects = await this.projectService.getProjectsByUser(req.params.userId);
      res.status(200).json({ projects, success: true });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch user projects',
        success: false 
      });
    }
  }
}