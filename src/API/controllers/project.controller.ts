import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { ProjectService } from "../../app/services/project.service";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import {
  CreateProjectDto,
  UpdateProjectDTO,
  ProjectResponseDto,
} from "../../domain/DTOs/projectDTO";
import { UserError } from "../../app/exceptions";
import { FindProjectOptions } from "../../domain/IRepos/IProjectRepo";

@injectable()
export class ProjectController {
  constructor(@inject(ProjectService) private projectService: ProjectService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const dto = plainToInstance(CreateProjectDto, {
      ...req.body,
      createdById: req.body.userId,
    });
    try {
      const errors = await validate(dto);
      if (errors.length) {
        throw new UserError(errors);
      }

      const project = await this.projectService.create(dto);
      res
        .status(201)
        .json({ project: new ProjectResponseDto(project), success: true });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const dto = plainToInstance(UpdateProjectDTO, req.body);
    try {
      const errors = await validate(dto);
      if (errors.length) {
        throw new UserError(errors);
      }
      const project = await this.projectService.update(dto);
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
    const { userId } = req.body;
    const query = req.query;
    // TODO: Handle the userId to search for projects that the user is a member of
    const where: FindProjectOptions = {
      ...query,
      userId,
    };

    try {
      const projects = await this.projectService.find(where);
      res.status(200).json({
        projects: projects.map((p) => new ProjectResponseDto(p)),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
