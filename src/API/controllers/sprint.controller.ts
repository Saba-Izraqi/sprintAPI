import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { SprintService } from "../../app/services/sprint.service";
import { CreateSprintDto, UpdateSprintDto } from "../../domain/DTOs/sprintDTO";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

@injectable()
export class SprintController {
  constructor(@inject(SprintService) private sprintService: SprintService) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const sprints = await this.sprintService.getAll(projectId);
      res.json({ sprints, success: true });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const sprint = await this.sprintService.getById(id);
      res.json({ sprint, success: true });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      req.body.projectId = projectId;
      const dto = plainToInstance(CreateSprintDto, req.body);
      const errors = await validate(dto);
      if (errors.length) {
        res.status(400).json({ errors });
        return;
      }
      const sprint = await this.sprintService.create(dto);
      res.status(201).json({ sprint, success: true });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateSprintDto, req.body);
      const errors = await validate(dto);
      if (errors.length) {
        res.status(400).json({ errors });
        return;
      }
      const sprint = await this.sprintService.update(id, dto);
      res.json({ sprint, success: true });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.sprintService.delete(id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}
