import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { ProjectService } from "../../app/services/project.service"; // Adjust path
import { validate } from "class-validator";
import { CreateProjectDto, UpdateProjectDto } from "../../domain/DTOs/projectDTO";
import { plainToClass } from "class-transformer"; // Import plainToClass

@injectable()
export class ProjectController {
  constructor(
    @inject(ProjectService) private projectService: ProjectService
  ) {}

  async createProject(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.id; 

    if (!userId) { 
      res.status(401).json({ error: "Unauthorized: User ID not found in request.", success: false });
      return;
    }

   
    const createDto = plainToClass(CreateProjectDto, req.body);

    const errors = await validate(createDto);
    if (errors.length > 0) {
      res.status(400).json({ errors, success: false });
      return;
    }

    try {
      const project = await this.projectService.create(createDto, userId);
      res.status(201).json({ project, success: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
      if (errorMessage.toLowerCase().includes('key prefix already exists')) {
        res.status(409).json({ error: errorMessage, success: false }); 
      } else {
        res.status(500).json({ error: errorMessage, success: false });
      }
    }
  }

  async getProject(req: Request, res: Response): Promise<void> {
    try {
      const project = await this.projectService.getProjectById(req.params.id);
      res.status(200).json({ project, success: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch project';
      if (errorMessage.toLowerCase().includes('not found')) {
        res.status(404).json({ error: errorMessage, success: false });
      } else {
        res.status(500).json({ error: errorMessage, success: false });
      }
    }
  }

  async updateProject(req: Request, res: Response): Promise<void> {
    
    const updateDto = plainToClass(UpdateProjectDto, req.body, { excludeExtraneousValues: true });


    const errors = await validate(updateDto);
    if (errors.length > 0) {
      res.status(400).json({ errors, success: false });
      return;
    }

    
    if (Object.keys(updateDto).length === 0) {
     
      if (req.body && Object.keys(req.body).length > 0) {
        res.status(400).json({ error: "No valid fields provided for update or invalid fields.", success: false });
      } else {
        const project = await this.projectService.getProjectById(req.params.id);
        if (project) {
            res.status(200).json({ project, success: true });
        } else {
             res.status(404).json({ error: 'Project not found', success: false });
        }
      }
      return;
    }

    try {
      const project = await this.projectService.updateProject(req.params.id, updateDto);
      res.status(200).json({ project, success: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
      if (errorMessage.toLowerCase().includes('not found')) {
        res.status(404).json({ error: errorMessage, success: false });
      } else if (errorMessage.toLowerCase().includes('key prefix already exists')) {
        res.status(409).json({ error: errorMessage, success: false }); // 409 Conflict
      } else {
        res.status(500).json({ error: errorMessage, success: false });
      }
    }
  }

  async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      await this.projectService.deleteProject(req.params.id);
     
      res.status(204).send();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
      if (errorMessage.toLowerCase().includes('not found')) {
        res.status(404).json({ error: errorMessage, success: false });
      } else {
        res.status(500).json({ error: errorMessage, success: false });
      }
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