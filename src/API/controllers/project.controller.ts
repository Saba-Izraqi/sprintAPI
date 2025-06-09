import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { ProjectService } from "../../app/services/project.service";
import {
  CreateProjectDto,
  UpdateProjectDTO,
  ProjectResponseDto,
} from "../../domain/DTOs/projectDTO";
import { FindProjectOptions } from "../../domain/types";

@injectable()
export class ProjectController {
  constructor(@inject(ProjectService) private projectService: ProjectService) {}
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const createProjectDto = (req as any).validatedData as CreateProjectDto;
      createProjectDto.createdBy = userId!;

      const project = await this.projectService.create(createProjectDto);
      res
        .status(201)
        .json({ project: new ProjectResponseDto(project), success: true });
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updateProjectDto = (req as any).validatedData as UpdateProjectDTO;

      const project = await this.projectService.update(updateProjectDto);
      res
        .status(200)
        .json({ project: new ProjectResponseDto(project), success: true });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await this.projectService.delete(id);
      res.status(204).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const query = req.query;
      const where: FindProjectOptions = {
        ...query,
      };

      const projects = await this.projectService.find(where, userId!);
      res.status(200).json({
        projects: projects.map((p) => new ProjectResponseDto(p)),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
