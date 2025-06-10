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
  constructor(@inject(ProjectService) private projectService: ProjectService) {}  /**
   * @swagger
   * /api/v1/project:
   *   post:
   *     responses:
   *       201:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProjectsResponse'
   */  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const createProjectDto = (req as any).validatedData as CreateProjectDto;
      createProjectDto.createdBy = userId!;

      const project = await this.projectService.create(createProjectDto);
      res.status(201).json({
        projects: [new ProjectResponseDto(project)]
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/project:
   *   patch:
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProjectsResponse'
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updateProjectDto = (req as any).validatedData as UpdateProjectDTO;

      const project = await this.projectService.update(updateProjectDto);
      res.status(200).json({
        projects: [new ProjectResponseDto(project)]
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/project/{id}:
   *   delete:
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProjectsResponse'
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await this.projectService.delete(id);
      res.status(200).json({ 
        projects: []
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/project:
   *   get:
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProjectsResponse'
   */  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const query = req.query;
      const where: FindProjectOptions = {
        ...query,
      };

      const projects = await this.projectService.find(where, userId!);
      res.status(200).json({
        projects: projects.map((p) => new ProjectResponseDto(p))
      });
    } catch (error) {
      next(error);
    }
  }
}
