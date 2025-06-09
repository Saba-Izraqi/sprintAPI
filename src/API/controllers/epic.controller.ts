import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { EpicService } from "../../app/services/epic.service";
import { CreateEpicDto, UpdateEpicDto } from "../../domain/DTOs/epicDTO";

@injectable()
export class EpicController {
  constructor(@inject(EpicService) private epicService: EpicService) {}

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const epics = await this.epicService.get(projectId);
      res.status(200).json({ epics, success: true });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const epic = await this.epicService.getById(id);
      res.status(200).json({ epic, success: true });
    } catch (error) {
      next(error);
    }
  }

  async getByKey(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, projectId } = req.params;
      const epic = await this.epicService.getByKey(key, projectId);
      res.status(200).json({ epic, success: true });
    } catch (error) {
      next(error);
    }
  }  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const createEpicDto = (req as any).validatedData as CreateEpicDto;
      // No need to manually assign projectId - it's already merged by validateDTOWithParams

      const epic = await this.epicService.create(createEpicDto);
      res.status(201).json({ epic, success: true });
    } catch (error) {
      next(error);
    }
  }async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateEpicDto = (req as any).validatedData as UpdateEpicDto;

      const updatedEpic = await this.epicService.update(id, updateEpicDto);
      res.status(200).json({ epic: updatedEpic, success: true });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.epicService.delete(id);
      res
        .status(200)
        .json({ success: true, message: "Epic deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  async getEpicIssues(req: Request, res: Response, next: NextFunction) {
    try {
      const { epicId } = req.params;
      // You may want to add projectId as well if needed: const { projectId } = req.params;
      const issues = await this.epicService.getEpicIssues(epicId);
      res.status(200).json({ issues, success: true });
    } catch (error) {
      next(error);
    }
  }
}
